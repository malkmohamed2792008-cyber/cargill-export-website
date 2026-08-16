import { signOut } from "@/auth"
import { NextResponse } from "next/server"
import { getAppOrigin } from "@/lib/app-url"

export async function POST(request: Request) {
  await signOut({ redirect: false })
  const origin = getAppOrigin(request)
  return NextResponse.redirect(new URL("/admin/login", origin))
}
