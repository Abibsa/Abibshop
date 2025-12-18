import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']
type OrderLog = Database['public']['Tables']['order_logs']['Row']

export class OrderService {
    private supabase = createClient()

    /**
     * Create new order
     */
    async createOrder(orderData: OrderInsert) {
        const { data, error } = await this.supabase
            .from('orders')
            .insert(orderData)
            .select()
            .single()

        if (error) throw error
        return data as Order
    }

    /**
     * Get order by ID
     */
    async getOrderById(id: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Order
    }

    /**
     * Get order by order number
     */
    async getOrderByNumber(orderNumber: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('order_number', orderNumber)
            .single()

        if (error) throw error
        return data as Order
    }

    /**
     * Get all orders (with filters)
     */
    async getOrders(filters?: {
        status?: string
        paymentStatus?: string
        userId?: string
        limit?: number
        offset?: number
    }) {
        let query = this.supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })

        if (filters?.status) {
            query = query.eq('status', filters.status)
        }

        if (filters?.paymentStatus) {
            query = query.eq('payment_status', filters.paymentStatus)
        }

        if (filters?.userId) {
            query = query.eq('user_id', filters.userId)
        }

        if (filters?.limit) {
            query = query.limit(filters.limit)
        }

        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
        }

        const { data, error, count } = await query

        if (error) throw error
        return { orders: data as Order[], total: count || 0 }
    }

    /**
     * Get user orders
     */
    async getUserOrders(userId: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as Order[]
    }

    /**
     * Update order status
     */
    async updateOrderStatus(
        id: string,
        status: Order['status'],
        notes?: string
    ) {
        const updates: OrderUpdate = {
            status,
            notes,
        }

        // If status is completed, set completed_at
        if (status === 'completed') {
            updates.completed_at = new Date().toISOString()
        }

        const { data, error } = await this.supabase
            .from('orders')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Order
    }

    /**
     * Update payment status
     */
    async updatePaymentStatus(
        id: string,
        paymentStatus: Order['payment_status']
    ) {
        const { data, error } = await this.supabase
            .from('orders')
            .update({ payment_status: paymentStatus })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Order
    }

    /**
     * Get order logs
     */
    async getOrderLogs(orderId: string) {
        const { data, error } = await this.supabase
            .from('order_logs')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as OrderLog[]
    }

    /**
     * Get order statistics
     */
    async getOrderStats() {
        const { data: allOrders, error: allError } = await this.supabase
            .from('orders')
            .select('total_amount, status, payment_status')

        if (allError) throw allError

        const stats = {
            total: allOrders.length,
            pending: allOrders.filter(o => o.status === 'pending').length,
            processing: allOrders.filter(o => o.status === 'processing').length,
            completed: allOrders.filter(o => o.status === 'completed').length,
            cancelled: allOrders.filter(o => o.status === 'cancelled').length,
            totalRevenue: allOrders
                .filter(o => o.payment_status === 'paid')
                .reduce((sum, o) => sum + Number(o.total_amount), 0),
            pendingRevenue: allOrders
                .filter(o => o.payment_status === 'pending')
                .reduce((sum, o) => sum + Number(o.total_amount), 0),
        }

        return stats
    }

    /**
     * Search orders
     */
    async searchOrders(query: string) {
        const { data, error } = await this.supabase
            .from('orders')
            .select('*')
            .or(`order_number.ilike.%${query}%,customer_name.ilike.%${query}%,customer_email.ilike.%${query}%`)
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) throw error
        return data as Order[]
    }
}

export const orderService = new OrderService()
