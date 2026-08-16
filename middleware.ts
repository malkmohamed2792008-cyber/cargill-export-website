import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Edge-safe middleware: does not import Prisma/NextAuth (avoids native Node modules).
 * Session presence is detected only via Auth.js v5 session-token cookies
 * (never csrf-token or callback-url).
 * Real auth + RBAC remain in server layouts and /api/admin handlers.
 */
function hasAuthJsSessionCookie(req: NextRequest): boolean {
  const cookies = req.cookies.getAll()
  for (const cookie of cookies) {
    const name = cookie.name
    if (
      name === "authjs.session-token" ||
      name === "__Secure-authjs.session-token" ||
      name.startsWith("authjs.session-token.") ||
      name.startsWith("__Secure-authjs.session-token.")
    ) {
      return Boolean(cookie.value)
    }
  }
  return false
}

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname
  const isOnLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/")
  const isLoggedIn = hasAuthJsSessionCookie(req)

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set("x-pathname", pathname)

  if (pathname.startsWith("/admin") && !isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ["/admin/:path*"],
}
