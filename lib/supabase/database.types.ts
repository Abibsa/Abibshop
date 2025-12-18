export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    role: 'user' | 'admin'
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'user' | 'admin'
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    role?: 'user' | 'admin'
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            products: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    category: string
                    price: number
                    original_price: number | null
                    discount: number
                    stock: number
                    image_url: string | null
                    is_active: boolean
                    is_featured: boolean
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    category: string
                    price: number
                    original_price?: number | null
                    discount?: number
                    stock?: number
                    image_url?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    category?: string
                    price?: number
                    original_price?: number | null
                    discount?: number
                    stock?: number
                    image_url?: string | null
                    is_active?: boolean
                    is_featured?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: string
                    order_number: string
                    user_id: string | null
                    customer_email: string
                    customer_name: string
                    customer_phone: string | null
                    customer_whatsapp: string | null
                    product_id: string | null
                    product_name: string
                    product_price: number
                    quantity: number
                    game_username: string
                    game_user_id: string | null
                    total_amount: number
                    payment_method: string | null
                    payment_status: 'pending' | 'paid' | 'failed' | 'expired'
                    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
                    created_at: string
                    updated_at: string
                    completed_at: string | null
                    notes: string | null
                    metadata: Json
                }
                Insert: {
                    id?: string
                    order_number?: string
                    user_id?: string | null
                    customer_email: string
                    customer_name: string
                    customer_phone?: string | null
                    customer_whatsapp?: string | null
                    product_id?: string | null
                    product_name: string
                    product_price: number
                    quantity?: number
                    game_username: string
                    game_user_id?: string | null
                    total_amount: number
                    payment_method?: string | null
                    payment_status?: 'pending' | 'paid' | 'failed' | 'expired'
                    status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
                    created_at?: string
                    updated_at?: string
                    completed_at?: string | null
                    notes?: string | null
                    metadata?: Json
                }
                Update: {
                    id?: string
                    order_number?: string
                    user_id?: string | null
                    customer_email?: string
                    customer_name?: string
                    customer_phone?: string | null
                    customer_whatsapp?: string | null
                    product_id?: string | null
                    product_name?: string
                    product_price?: number
                    quantity?: number
                    game_username?: string
                    game_user_id?: string | null
                    total_amount?: number
                    payment_method?: string | null
                    payment_status?: 'pending' | 'paid' | 'failed' | 'expired'
                    status?: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed'
                    created_at?: string
                    updated_at?: string
                    completed_at?: string | null
                    notes?: string | null
                    metadata?: Json
                }
            }
            order_logs: {
                Row: {
                    id: string
                    order_id: string
                    status: string
                    message: string | null
                    created_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    order_id: string
                    status: string
                    message?: string | null
                    created_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    order_id?: string
                    status?: string
                    message?: string | null
                    created_by?: string | null
                    created_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    color: string | null
                    is_active: boolean
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    color?: string | null
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    color?: string | null
                    is_active?: boolean
                    sort_order?: number
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            generate_order_number: {
                Args: Record<string, never>
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
