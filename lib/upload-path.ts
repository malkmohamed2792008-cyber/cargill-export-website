import path from "path"

const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads")

/**
 * Allow only simple folder names (no path separators or traversal).
 */
export function sanitizeUploadFolder(folder: unknown): string | null {
  if (typeof folder !== "string") return null
  const trimmed = folder.trim().toLowerCase()
  if (!trimmed) return null
  if (!/^[a-z0-9_-]+$/.test(trimmed)) return null
  return trimmed
}

/**
 * Resolve a path under public/uploads and reject anything that escapes the root.
 */
export function resolveSafeUploadPath(...segments: string[]): string | null {
  const root = path.resolve(UPLOADS_ROOT)
  const resolved = path.resolve(root, ...segments)
  const relative = path.relative(root, resolved)
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null
  }
  return resolved
}

export function getUploadsRoot(): string {
  return path.resolve(UPLOADS_ROOT)
}
