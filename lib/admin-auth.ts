import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { Session } from "next-auth"

export type AdminRole = "ADMIN" | "EDITOR" | "VIEWER"

/** All authenticated admin roles (read access). */
export const ALL_ADMIN_ROLES: AdminRole[] = ["ADMIN", "EDITOR", "VIEWER"]

/** Roles allowed to mutate products, categories, media, and inquiries. */
export const CONTENT_WRITE_ROLES: AdminRole[] = ["ADMIN", "EDITOR"]

/** Full administrative access. */
export const ADMIN_ONLY_ROLES: AdminRole[] = ["ADMIN"]

function normalizeRole(role: unknown): AdminRole {
  if (role === "ADMIN" || role === "EDITOR" || role === "VIEWER") {
    return role
  }
  return "VIEWER"
}

/**
 * Server-side auth + RBAC for /api/admin/* handlers.
 * VIEWER: read-only. EDITOR/ADMIN: content mutations. ADMIN: full access.
 */
export async function requireAdminAuth(allowedRoles: AdminRole[] = ALL_ADMIN_ROLES): Promise<
  | { session: Session; role: AdminRole; error: null }
  | { session: Session | null; role: AdminRole | null; error: NextResponse }
> {
  const session = await auth()

  if (!session?.user) {
    return {
      session: null,
      role: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const role = normalizeRole(session.user.role)

  if (!allowedRoles.includes(role)) {
    return {
      session,
      role,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { session, role, error: null }
}
