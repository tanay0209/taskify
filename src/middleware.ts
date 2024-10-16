import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth-token')
    const url = request.nextUrl

    const publicRoutes = ['/login', '/register']

    if (authToken) {
        if (publicRoutes.some(route => url.pathname.startsWith(route))) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    } else {
        if (!publicRoutes.some(route => url.pathname.startsWith(route))) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/',
        '/register',
        '/login',   
    ]
}