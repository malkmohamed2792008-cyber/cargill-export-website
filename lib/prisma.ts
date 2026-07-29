import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"

declare global {
  var __cargillPrisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    return null
  }

  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({ adapter })
}

export function getPrismaClient() {
  if (typeof window !== "undefined") {
    return null
  }

  if (!globalThis.__cargillPrisma) {
    globalThis.__cargillPrisma = createPrismaClient() ?? undefined
  }

  return globalThis.__cargillPrisma ?? null
}

export const prisma = getPrismaClient()
