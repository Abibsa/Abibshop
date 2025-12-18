import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export class ProductService {
    private supabase = createClient()

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

        if (error) throw error
        return data as Product[]
    }

    /**
     * Get product by ID
     */
    async getProductById(id: string) {
        const { data, error } = await this.supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .eq('is_active', true)
            .single()

        if (error) throw error
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

        if (error) throw error
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

        if (error) throw error
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
}

export const productService = new ProductService()
