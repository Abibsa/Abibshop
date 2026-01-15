import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export class ProductService {
    private supabase = createClient()

    private fallbackData: Product[] = [
        // New Gift Method (Highlights)
        {
            id: 'gift-400', name: '400 Robux Gift', description: 'Via Gift (Tanpa Login) - Langsung Masuk', category: 'Robux Gift Card',
            price: 85000, original_price: 85000, stock: 500, is_active: true, is_featured: true, image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), discount: 0, metadata: {}
        },
        {
            id: 'gift-800', name: '800 Robux Gift', description: 'Via Gift (Tanpa Login) - Langsung Masuk', category: 'Robux Gift Card',
            price: 150000, original_price: 150000, stock: 500, is_active: true, is_featured: true, image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), discount: 0, metadata: {}
        },
        {
            id: 'gift-1000', name: '1000 Robux Gift', description: 'Via Gift (Tanpa Login) - Langsung Masuk', category: 'Robux Gift Card',
            price: 175000, original_price: 175000, stock: 500, is_active: true, is_featured: true, image_url: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), discount: 0, metadata: {}
        }
    ]

    /**
     * Get all active products
     */
    async getProducts(filters?: {
        category?: string
        featured?: boolean
        search?: string
    }) {
        let query = this.supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (filters?.category) {
            query = query.eq('category', filters.category)
        }

        if (filters?.featured !== undefined) {
            query = query.eq('is_featured', filters.featured)
        }

        if (filters?.search) {
            query = query.ilike('name', `%${filters.search}%`)
        }

        const { data, error } = await query

        if (error) {
            console.warn("⚠️ Database connection failed. Using OFFLINE MODE with fallback data.")
            // Filter fallback data based on requested filters
            let filtered = [...this.fallbackData]
            if (filters?.category) filtered = filtered.filter(p => p.category === filters.category)
            if (filters?.featured !== undefined) filtered = filtered.filter(p => p.is_featured === filters.featured)
            if (filters?.search) {
                const search = filters.search
                filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
            }
            return filtered
        }
        return data as Product[]
    }

    /**
     * Get product by ID
     */
    async getProductById(id: string) {
        // If it's a fallback ID, return immediately from local data
        if (id.startsWith('fallback-')) {
            const fallback = this.fallbackData.find(p => p.id === id)
            if (fallback) return fallback
        }

        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (error) {
            // Also check fallback data if DB fails, though ID might not match unless we are lucky or it is a fallback ID caught by error
            console.warn(`⚠️ Error fetching product ${id}. Checking fallback...`)
            const fallback = this.fallbackData.find(p => p.id === id)
            if (fallback) return fallback
            throw error // If not found in fallback, throw original error
        }
        return data as Product
    }

    /**
     * Get featured products
     */
    async getFeaturedProducts(limit = 6) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('is_featured', true)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.warn("⚠️ Database connection failed (Featured). Using OFFLINE MODE.")
            return this.fallbackData.filter(p => p.is_featured).slice(0, limit)
        }
        return data as Product[]
    }

    /**
     * Get products by category
     */
    async getProductsByCategory(category: string) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .eq('is_active', true)
            .order('price', { ascending: true })

        if (error) {
            console.warn(`⚠️ Database connection failed (Category ${category}). Using OFFLINE MODE.`)
            return this.fallbackData.filter(p => p.category === category)
        }
        return data as Product[]
    }

    /**
     * Create new product (Admin only)
     */
    async createProduct(product: ProductInsert) {
        const { data, error } = await this.supabase
            .from('products')
            .insert(product)
            .select()
            .single()

        if (error) throw error
        return data as Product
    }

    /**
     * Update product (Admin only)
     */
    async updateProduct(id: string, updates: ProductUpdate) {
        const { data, error } = await this.supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Product
    }

    /**
     * Delete product (Admin only)
     */
    async deleteProduct(id: string) {
        const { error } = await this.supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error
    }

    /**
     * Update product stock
     */
    async updateStock(id: string, quantity: number) {
        const { data, error } = await this.supabase
            .from('products')
            .update({ stock: quantity })
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Product
    }

    /**
     * Decrease product stock (for orders)
     */
    async decreaseStock(id: string, quantity: number) {
        // Get current stock
        const product = await this.getProductById(id)

        if (product.stock < quantity) {
            throw new Error('Insufficient stock')
        }

        return this.updateStock(id, product.stock - quantity)
    }
    /**
     * Subscribe to product changes (Realtime)
     */
    subscribeToProducts(callback: () => void) {
        return this.supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
            .subscribe()
    }
}

export const productService = new ProductService()
