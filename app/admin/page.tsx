import { Metadata } from "next"
import Link from "next/link"
import { FiPackage, FiLayers, FiAward, FiMail, FiFileText, FiClock, FiSettings, FiPlus, FiEye } from "react-icons/fi"

export const metadata: Metadata = {
  title: "Dashboard | CARGILL Admin",
  description: "Admin dashboard overview",
}

async function getStats() {
  const { getPrismaClient } = await import("@/lib/prisma")
  const prisma = getPrismaClient()
  if (!prisma) {
    return {
      products: 0,
      categories: 0,
      certifications: 0,
      quotes: { total: 0, pending: 0 },
      messages: { total: 0, unread: 0 },
    }
  }

  const [products, categories, certifications, quotes, messages] = await Promise.all([
    prisma.product.count(),
    prisma.productCategory.count(),
    prisma.certification.count(),
    prisma.quoteRequest.count().then((count) => ({
      total: count,
      pending: prisma.quoteRequest.count({ where: { status: "PENDING" } }),
    })),
    prisma.contactMessage.count().then((count) => ({
      total: count,
      unread: prisma.contactMessage.count({ where: { isRead: false } }),
    })),
  ])

  return {
    products,
    categories,
    certifications,
    quotes: {
      total: quotes.total,
      pending: await quotes.pending,
    },
    messages: {
      total: messages.total,
      unread: await messages.unread,
    },
  }
}

export default async function AdminDashboard() {
  const statsData = await getStats()

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 8px" }}>
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Welcome to CARGILL Admin Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
        <StatCard label="Total Products" value={statsData.products} icon={FiPackage} color="var(--fresh-leaf)" />
        <StatCard label="Categories" value={statsData.categories} icon={FiLayers} color="var(--sun-citrus)" />
        <StatCard label="Certifications" value={statsData.certifications} icon={FiAward} color="var(--crate-brown)" />
        <StatCard label="Quote Requests" value={statsData.quotes.total} icon={FiFileText} color="var(--deep-grove)" />
        <StatCard label="Messages" value={statsData.messages.total} icon={FiMail} color="var(--info)" />
      </div>

      {/* Pending Items */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
        {/* Pending Quotes */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--deep-grove)", margin: 0 }}>
                Pending Quotes
              </h2>
              <span style={{
                background: "var(--warning-light)",
                color: "var(--sun-citrus)",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700"
              }}>
                {statsData.quotes.pending} pending
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <FiClock style={{ width: "20px", height: "20px", color: "var(--sun-citrus)" }} />
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                {statsData.quotes.pending > 0
                  ? "You have quote requests waiting for review"
                  : "No pending quotes"}
              </p>
            </div>
            <Link
              href="/admin/quotes"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--deep-grove)", fontWeight: "600", textDecoration: "none" }}
            >
              View all quotes <FiEye style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
        </div>

        {/* Unread Messages */}
        <div className="card">
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--deep-grove)", margin: 0 }}>
                Unread Messages
              </h2>
              <span style={{
                background: "var(--info-light)",
                color: "var(--info)",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "700"
              }}>
                {statsData.messages.unread} unread
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <FiMail style={{ width: "20px", height: "20px", color: "var(--info)" }} />
              <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
                {statsData.messages.unread > 0
                  ? "You have unread contact messages"
                  : "No unread messages"}
              </p>
            </div>
            <Link
              href="/admin/messages"
              style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--deep-grove)", fontWeight: "600", textDecoration: "none" }}
            >
              View all messages <FiEye style={{ width: "14px", height: "14px" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-body">
          <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 16px" }}>
            Quick Actions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
            <Link
              href="/admin/products/new"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--stone)",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <FiPlus style={{ width: "24px", height: "24px", color: "var(--deep-grove)" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Add Product</span>
            </Link>
            <Link
              href="/admin/categories/new"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--stone)",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <FiLayers style={{ width: "24px", height: "24px", color: "var(--deep-grove)" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Add Category</span>
            </Link>
            <Link
              href="/admin/quotes"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--stone)",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <FiFileText style={{ width: "24px", height: "24px", color: "var(--deep-grove)" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>View Quotes</span>
            </Link>
            <Link
              href="/admin/settings"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--stone)",
                textDecoration: "none",
                transition: "all 0.2s ease"
              }}
            >
              <FiSettings style={{ width: "24px", height: "24px", color: "var(--deep-grove)" }} />
              <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
}) {
  return (
    <div className="c-stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "12px", color: "var(--text-light)", margin: "0 0 4px" }}>{label}</p>
          <p style={{ fontSize: "28px", fontWeight: "600", color: "var(--deep-grove)", margin: 0, fontFamily: "var(--font-mono)" }}>
            {value}
          </p>
        </div>
        <div style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-m)",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Icon style={{ width: "24px", height: "24px", color: "var(--white)" }} />
        </div>
      </div>
    </div>
  )
}
