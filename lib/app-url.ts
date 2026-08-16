/**
 * Resolve the public application origin without hardcoding localhost.
 * Prefer Auth.js / app URL env vars; fall back to the incoming request URL.
 */
export function getAppOrigin(request?: Request): string {
  const candidates = [
    process.env.AUTH_URL,
    process.env.NEXTAUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ]

  for (const value of candidates) {
    if (!value) continue
    try {
      return new URL(value).origin
    } catch {
      // ignore invalid env values
    }
  }

  if (request) {
    try {
      return new URL(request.url).origin
    } catch {
      // ignore
    }
  }

  const vercel = process.env.VERCEL_URL
  if (vercel) {
    const host = vercel.startsWith("http") ? vercel : `https://${vercel}`
    try {
      return new URL(host).origin
    } catch {
      // ignore
    }
  }

  return "http://localhost:3000"
}
