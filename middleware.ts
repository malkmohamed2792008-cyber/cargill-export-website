import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnAdmin = req.nextUrl.pathname.startsWith("/admin")
  const isOnLogin = req.nextUrl.pathname.startsWith("/admin/login")
  const isOnApi = req.nextUrl.pathname.startsWith("/api")

  // Allow public API routes
  if (isOnApi) {
    return NextResponse.next()
  }

  // Redirect unauthenticated users to login
  if (isOnAdmin && !isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  // Redirect authenticated users away from login
  if (isOnLogin && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
