import { requireSession } from "@/lib/auth/guards"
import Link from "next/link"
import { FiHome, FiPackage, FiLayers, FiAward, FiGlobe, FiFileText, FiMail, FiSettings, FiLogOut } from "react-icons/fi"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/products", label: "Products", icon: FiPackage },
  { href: "/admin/categories", label: "Categories", icon: FiLayers },
  { href: "/admin/certifications", label: "Certifications", icon: FiAward },
  { href: "/admin/markets", label: "Export Markets", icon: FiGlobe },
  { href: "/admin/quotes", label: "Quote Requests", icon: FiFileText },
  { href: "/admin/messages", label: "Messages", icon: FiMail },
  { href: "/admin/settings", label: "Settings", icon: FiSettings },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session, role } = await requireSession()

  return (
    <div className="c-shell">
      <div className="c-topbar">
        <div className="brand">Cargill</div>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: "12px", color: "var(--text-muted)", marginRight: "16px" }}>
          {role}
        </span>
        <Link
          href="/"
          style={{ fontSize: "14px", color: "var(--text-muted)", textDecoration: "none" }}
        >
          View Website
        </Link>
      </div>

      <div className="c-shell-body">
        <div className="c-sidebar">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="c-nav-item"
            >
              <item.icon style={{ width: "16px", height: "16px" }} />
              {item.label}
            </Link>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px", marginBottom: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--fresh-leaf)",
                  color: "var(--white)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "700",
                }}
              >
                {session.user?.name?.charAt(0) || "A"}
              </div>
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "13px", color: "var(--white)", fontWeight: "600", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.user?.name}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {session.user?.email}
                </p>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="c-nav-item"
                style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", textAlign: "right" }}
              >
                <FiLogOut style={{ width: "16px", height: "16px" }} />
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="c-content">
          {children}
        </div>
      </div>

      <div className="c-footer">
        <span>Cargill © 2026</span>
        <span>الدعم الفني · الشروط والأحكام</span>
      </div>
    </div>
  )
}
