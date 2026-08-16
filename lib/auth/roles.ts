export const USER_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const

export type UserRole = (typeof USER_ROLES)[number]

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && USER_ROLES.includes(value as UserRole)
}

export const ROLE_PERMISSIONS = {
  ADMIN: [
    "dashboard:read",
    "products:read",
    "products:write",
    "products:delete",
    "content:write",
    "inquiries:read",
    "inquiries:write",
    "settings:read",
    "settings:write",
    "admins:manage",
    "audit:read",
  ],
  EDITOR: [
    "dashboard:read",
    "products:read",
    "products:write",
    "content:write",
    "inquiries:read",
    "inquiries:write",
    "settings:read",
  ],
  VIEWER: [
    "dashboard:read",
    "products:read",
    "inquiries:read",
  ],
} as const satisfies Record<UserRole, readonly string[]>

export type Permission = (typeof ROLE_PERMISSIONS)[UserRole][number]

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission)
}
