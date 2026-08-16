import { Metadata } from "next"
import { FiGlobe } from "react-icons/fi"

export const metadata: Metadata = {
  title: "Export Markets | CARGILL Admin",
  description: "Manage global export markets",
}

export default function MarketsPage() {
  const markets = [
    { name: "European Union", region: "Europe", productsCount: 84 },
    { name: "Russia & CIS", region: "Eurasia", productsCount: 65 },
    { name: "United Arab Emirates", region: "Middle East", productsCount: 92 },
    { name: "Saudi Arabia", region: "Middle East", productsCount: 78 },
    { name: "United Kingdom", region: "Europe", productsCount: 45 },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 8px" }}>
          Export Markets
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Manage global export destinations and import regulations
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {markets.map((market) => (
          <div key={market.name} className="card">
            <div className="card-body" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: "var(--sun-citrus-100)",
                color: "var(--sun-citrus)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <FiGlobe style={{ width: "24px", height: "24px" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 4px" }}>
                  {market.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 8px" }}>Region: {market.region}</p>
                <span style={{ fontSize: "12px", color: "var(--text-light)" }}>
                  {market.productsCount} Export Products
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
