"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { checkoutLimiter } from "@/lib/rate-limit"
import type { Database } from "@/lib/supabase/database.types"

type OrderInsert = Database['public']['Tables']['orders']['Insert']

// ─── Constants ────────────────────────────────────────────
const MAX_QUANTITY_PER_ITEM = 100
const MAX_CART_ITEMS = 20

// ─── Input Validation ─────────────────────────────────────
function validateCheckoutInput(data: {
    items: { productId: string, quantity: number, username: string, productName: string }[],
    email: string,
    whatsapp: string,
    paymentMethod: string,
}): string | null {
    if (!data.items?.length) return "Keranjang kosong."
    if (data.items.length > MAX_CART_ITEMS) return `Maksimal ${MAX_CART_ITEMS} item per checkout.`

    for (const item of data.items) {
        if (!item.productId || typeof item.productId !== 'string') return "Product ID tidak valid."
        if (!Number.isInteger(item.quantity) || item.quantity < 1) return `Quantity untuk ${item.productName} harus minimal 1.`
        if (item.quantity > MAX_QUANTITY_PER_ITEM) return `Quantity untuk ${item.productName} melebihi batas maksimal (${MAX_QUANTITY_PER_ITEM}).`
        if (!item.username || item.username.trim().length < 1) return "Username Roblox wajib diisi."
        if (item.username.trim().length > 100) return "Username Roblox terlalu panjang."
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Email tidak valid."
    if (!data.whatsapp || data.whatsapp.trim().length < 8) return "Nomor WhatsApp tidak valid."
    if (!data.paymentMethod) return "Metode pembayaran wajib dipilih."

    return null // all valid
}

// ─── Main Checkout Server Action ─────────────────────────
export async function processCheckout(data: {
    items: { productId: string, quantity: number, username: string, productName: string }[],
    email: string,
    whatsapp: string,
    paymentMethod: string,
}) {
    // ── FIX 4: Full input validation ──
    const validationError = validateCheckoutInput(data)
    if (validationError) return { success: false, error: validationError }

    // ── FIX 5: Rate limiting (5 checkouts per minute per email) ──
    const { success: rateLimitOk } = checkoutLimiter.check(5, data.email)
    if (!rateLimitOk) return { success: false, error: "Terlalu banyak percobaan. Silakan tunggu 1 menit." }

    // ── Get authenticated user (optional — guest checkout allowed) ──
    const supabaseSession = await createClient()
    const { data: { user } } = await supabaseSession.auth.getUser()

    // ── Admin client bypasses RLS for system operations ──
    const adminSupabase = createAdminClient() as any
    const newOrderIds: string[] = []
    const createdOrderIds: string[] = [] // Track for rollback

    try {
        for (const item of data.items) {
            // ── Fetch product from DB (server-side truth) ──
            const { data: product, error: productError } = await adminSupabase
                .from('products')
                .select('id, name, price, stock, is_active')
                .eq('id', item.productId)
                .single()

            if (productError || !product) {
                // Rollback previously created orders 
                await rollbackOrders(adminSupabase, createdOrderIds)
                return { success: false, error: `Produk "${item.productName}" tidak ditemukan.` }
            }

            if (!product.is_active) {
                await rollbackOrders(adminSupabase, createdOrderIds)
                return { success: false, error: `Produk "${product.name}" sedang tidak tersedia.` }
            }

            // ── FIX 1: Atomic stock decrease with row lock ──
            const { data: stockResult, error: stockError } = await adminSupabase
                .rpc('decrease_stock_atomic', {
                    p_product_id: product.id,
                    p_quantity: item.quantity
                })

            if (stockError || stockResult === false) {
                // Rollback previously created orders
                await rollbackOrders(adminSupabase, createdOrderIds)
                return {
                    success: false,
                    error: `Stok produk "${product.name}" tidak mencukupi. Silakan kurangi jumlah pesanan.`
                }
            }

            // ── Calculate total from DB price (never trust client) ──
            const totalAmount = (product.price || 0) * item.quantity

            // ── Insert order ──
            const orderToInsert: OrderInsert = {
                user_id: user?.id || null,
                customer_name: user?.user_metadata?.full_name || 'Customer',
                customer_email: data.email.trim(),
                customer_whatsapp: data.whatsapp.trim(),
                product_id: product.id,
                product_name: product.name,
                product_price: product.price || 0,
                quantity: item.quantity,
                game_username: item.username.trim(),
                game_user_id: null,
                total_amount: totalAmount,
                payment_method: data.paymentMethod,
                payment_status: 'pending',
                status: 'pending',
                metadata: {} as any
            }

            const { data: newOrder, error: orderError } = await adminSupabase
                .from('orders')
                .insert(orderToInsert)
                .select('id, order_number')
                .single()

            if (orderError || !newOrder) {
                console.error("Failed to insert order:", orderError)
                // Restore the stock we just decreased
                await adminSupabase.rpc('restore_stock', {
                    p_product_id: product.id,
                    p_quantity: item.quantity
                })
                await rollbackOrders(adminSupabase, createdOrderIds)
                return { success: false, error: "Gagal membuat pesanan. Silakan coba lagi." }
            }

            createdOrderIds.push(newOrder.id)
            newOrderIds.push(newOrder.order_number || '')
        }

        return { success: true, orderIds: newOrderIds }
    } catch (error: any) {
        console.error("Checkout process error:", error)
        // Best-effort rollback
        await rollbackOrders(adminSupabase, createdOrderIds)
        return { success: false, error: "Terjadi kesalahan internal. Silakan coba lagi." }
    }
}

// ── Rollback helper: delete any orders created during a failed checkout ──
async function rollbackOrders(adminSupabase: any, orderIds: string[]) {
    for (const id of orderIds) {
        try {
            await adminSupabase.from('orders').delete().eq('id', id)
        } catch (e) {
            console.error(`Failed to rollback order ${id}:`, e)
        }
    }
}
