import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { hasPermission, isUserRole, type Permission, type UserRole } from "@/lib/auth/roles"

export async function requireSession() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/admin/login")
  }

  const role = (session.user as { role?: unknown }).role
  if (!isUserRole(role)) {
    redirect("/admin/login")
  }

  return { session, role }
}

export async function requireRole(allowedRoles: readonly UserRole[]) {
  const { session, role } = await requireSession()

  if (!allowedRoles.includes(role)) {
    redirect("/admin/unauthorized")
  }

  return { session, role }
}

export async function requirePermission(permission: Permission) {
  const { session, role } = await requireSession()

  if (!hasPermission(role, permission)) {
    redirect("/admin/unauthorized")
  }

  return { session, role }
}
