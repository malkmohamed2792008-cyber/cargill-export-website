import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { isUserRole, hasPermission } from "@/lib/auth/roles"

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: blob: https://images.unsplash.com; " +
    "connect-src 'self'; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self';",
}

export default auth((req) => {
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => response.headers.set(key, value))

  const isLoggedIn = !!req.auth
  const pathname = req.nextUrl.pathname
  const isOnAdmin = pathname.startsWith("/admin")
  const isOnLogin = pathname.startsWith("/admin/login")

  if (isOnAdmin && !isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  if (isOnAdmin && isLoggedIn && !isOnLogin) {
    const role = (req.auth?.user as { role?: unknown } | undefined)?.role

    if (!isUserRole(role) || !hasPermission(role, "dashboard:read")) {
      return NextResponse.redirect(new URL("/admin/unauthorized", req.url))
    }
  }

  return response
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
