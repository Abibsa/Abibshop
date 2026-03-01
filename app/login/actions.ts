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

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role || 'user'
}
