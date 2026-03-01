import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export class AuthService {
    private supabase = createClient()

    /**
     * Sign up with email and password
     */
    async signUp(email: string, password: string, fullName?: string) {
        // Sanitize email and remove any potential non-printable characters
        const cleanEmail = email.trim().toLowerCase().replace(/[^\x20-\x7E]/g, '');

        // Browser compatible hex logging
        const hexEmail = Array.from(new TextEncoder().encode(cleanEmail))
            .map(b => b.toString(16).padStart(2, '0'))
            .join(' ');

        console.log('SignUp Diagnostics:', {
            email: cleanEmail,
            hex: hexEmail,
            length: cleanEmail.length,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
        });

        const payload = {
            email: cleanEmail,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        };

        const { data, error } = await this.supabase.auth.signUp(payload)

        if (error) {
            console.error('Supabase SignUp Error (Details):', {
                message: error.message,
                status: error.status,
                code: error.code,
                email_sent: cleanEmail
            });
        }

        if (error) throw error

        // Create profile
        if (data.user) {
            await this.createProfile({
                id: data.user.id,
                email: data.user.email!,
                full_name: fullName || null,
            })
        }

        return data
    }

    /**
     * Sign in with email and password
     */
    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    }

    /**
     * Sign out
     */
    async signOut() {
        const { error } = await this.supabase.auth.signOut()
        if (error) throw error
    }

    /**
     * Get current user
     */
    async getCurrentUser() {
        const { data: { user }, error } = await this.supabase.auth.getUser()
        if (error) throw error
        return user
    }

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await this.supabase.auth.getSession()
        if (error) throw error
        return session
    }

    /**
     * Create user profile
     */
    async createProfile(profile: ProfileInsert) {
        const { data, error } = await this.supabase
            .from('profiles')
            .insert(profile)
            .select()
            .single()

        if (error) throw error
        return data as Profile
    }

    /**
     * Get user profile (auto-creates if missing)
     */
    async getProfile(userId: string) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle()

        if (error) {
            console.error("getProfile error:", JSON.stringify(error))
            throw error
        }

        if (!data) {
            // Profile not found — try to auto-create (INSERT only, never overwrite)
            const { data: { user } } = await this.supabase.auth.getUser()

            try {
                const { data: created } = await this.supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        email: user?.email || '',
                        full_name: user?.user_metadata?.full_name || null,
                    })
                    .select()
                    .single()

                if (created) return created as Profile
            } catch {
                // Insert failed (RLS or duplicate) — continue with default
            }

            // Return safe default (role='user')
            return {
                id: userId,
                role: 'user',
                email: user?.email || '',
                full_name: user?.user_metadata?.full_name || null,
                phone: null,
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            } as Profile
        }

        return data as Profile
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updates: ProfileUpdate) {
        const { data, error } = await this.supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data as Profile
    }

    /**
     * Check if user is admin
     */
    async isAdmin(userId: string) {
        try {
            const profile = await this.getProfile(userId)
            return profile.role === 'admin'
        } catch (error) {
            console.error("isAdmin check failed:", error);
            // Fallback to checking jwt if profile fetch fails
            const session = await this.getSession();
            return session?.user?.app_metadata?.role === 'admin' || false;
        }
    }

    /**
     * Reset password
     */
    async resetPassword(email: string) {
        const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
        })

        if (error) throw error
    }

    /**
     * Update password
     */
    async updatePassword(newPassword: string) {
        const { error } = await this.supabase.auth.updateUser({
            password: newPassword,
        })

        if (error) throw error
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (event: string, session: any) => void) {
        return this.supabase.auth.onAuthStateChange(callback)
    }
}

export const authService = new AuthService()
