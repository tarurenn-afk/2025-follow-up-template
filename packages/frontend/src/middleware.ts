import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  console.log(request.nextUrl.pathname)
  const cookie = request.cookies.get('userNo')
  const { pathname } = request.nextUrl
  if (pathname === '/' || pathname === '/login' || pathname === '/userCreate') {
    return NextResponse.next()
  }
  if (!cookie) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
