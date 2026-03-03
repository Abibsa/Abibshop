"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Server-side role check — guaranteed to work because 
 * server Supabase client has proper cookie-based auth
 */
export async function checkUserRole(): Promise<string> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return 'user'

    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        if (error) {
            console.error("DEBUG: Role check error:", error)
            return 'user'
        }

        return profile?.role || 'user'
    } catch (e) {
        console.error("DEBUG: Unexpected error in checkUserRole:", e)
        return 'user'
    }
}
