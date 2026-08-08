import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Lightweight middleware that avoids importing server-only modules (Prisma/NextAuth)
// to prevent loading native node modules (e.g. node:util/types) in the Edge runtime.
// It uses the presence of NextAuth cookies as a heuristic for an authenticated session.

export default function middleware(req: NextRequest) {
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnLogin = req.nextUrl.pathname.startsWith("/admin/login")
  const isOnApi = req.nextUrl.pathname.startsWith("/api")

  // Allow public API routes
  if (isOnApi) {
    return NextResponse.next()
  }

  // Very small, safe heuristic: check for common NextAuth session cookie names.
  // This avoids importing NextAuth/Prisma inside middleware (which causes native module loads).
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.total-token",
    "next-auth.session"
  ]

  let isLoggedIn = false
  try {
    for (const name of cookieNames) {
      const c = req.cookies.get(name)
      if (c) {
        isLoggedIn = true
        break
      }
    }
  } catch (e) {
    // ignore and treat as not logged in
    isLoggedIn = false
  }

  // Redirect unauthenticated users to login for admin routes
  if (isOnAdmin && !isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // Redirect authenticated users away from login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
