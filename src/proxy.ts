import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API, 정적 파일은 통과
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const response = NextResponse.next()
  const session = await getIronSession<SessionData>(request, response, sessionOptions)
  const isLoggedIn = session.isLoggedIn === true
  const isPublicPage = pathname === '/login' || pathname === '/signup'

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 로그인 상태에서 로그인/회원가입 페이지 접근 시 주문 목록으로
  if (isLoggedIn && isPublicPage) {
    return NextResponse.redirect(new URL('/orders', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
