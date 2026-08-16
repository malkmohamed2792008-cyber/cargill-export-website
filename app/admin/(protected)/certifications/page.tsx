import { Metadata } from "next"
import { FiAward, FiCheckCircle } from "react-icons/fi"

export const metadata: Metadata = {
  title: "Certifications | CARGILL Admin",
  description: "Manage export quality certifications",
}

export default function CertificationsPage() {
  const certifications = [
    { name: "GLOBALG.A.P.", issuer: "Food Safety Standard", status: "Active" },
    { name: "ISO 22000", issuer: "Food Safety Management", status: "Active" },
    { name: "BRCGS Food Safety", issuer: "Global Standard", status: "Active" },
    { name: "Halal Certification", issuer: "Egyptian Islamic Authority", status: "Active" },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 8px" }}>
          Quality Certifications
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          Manage global export quality standards and compliance certificates
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {certifications.map((cert) => (
          <div key={cert.name} className="card">
            <div className="card-body" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                background: "var(--fresh-leaf-100)",
                color: "var(--fresh-leaf)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <FiAward style={{ width: "24px", height: "24px" }} />
              </div>
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 4px" }}>
                  {cert.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 8px" }}>{cert.issuer}</p>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--fresh-leaf)",
                  background: "var(--fresh-leaf-50)",
                  padding: "2px 8px",
                  borderRadius: "999px",
                }}>
                  <FiCheckCircle style={{ width: "12px", height: "12px" }} />
                  {cert.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
