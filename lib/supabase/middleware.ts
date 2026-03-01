import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Check authentication ( getUser() is safer than getSession() )
    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Check
    const isLoginPath = request.nextUrl.pathname.startsWith('/login')
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')

    // Redirect to login if accessing admin without session
    if (isAdminPath && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to home if already logged in and trying to access /login
    if (isLoginPath && user) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Role-based protection for /admin
    if (isAdminPath && user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return supabaseResponse
}
