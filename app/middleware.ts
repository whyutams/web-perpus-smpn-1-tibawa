import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const response = await updateSession(request)
    const pathname = request.nextUrl.pathname

    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute) {
        const supabaseResponse = response.cookies.get('sb-access-token')
        if (!supabaseResponse) {
            const redirectUrl = new URL('/login', request.url)
            redirectUrl.searchParams.set('redirect', pathname)
            return Response.redirect(redirectUrl)
        }
    }

    if (pathname === '/login') {
        const supabaseResponse = response.cookies.get('sb-access-token')
        if (supabaseResponse) {
            return Response.redirect(new URL('/dashboard', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}