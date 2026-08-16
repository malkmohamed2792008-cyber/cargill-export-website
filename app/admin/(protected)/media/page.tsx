"use client"

import { useState, useEffect } from "react"
import {
  FiImage,
  FiUploadCloud,
  FiSearch,
  FiTrash2,
  FiCopy,
  FiCheck,
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi"
import FileUpload from "@/components/admin/FileUpload"

interface MediaAsset {
  id: string
  url: string
  originalName: string
  filename: string
  altText?: string
  folder: string
  size: number
  mimeType: string
  createdAt: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [folderFilter, setFolderFilter] = useState("all")
  const [folders, setFolders] = useState<{ name: string; count: number }[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showUploadBox, setShowUploadBox] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/media?search=${encodeURIComponent(search)}&folder=${folderFilter}&limit=50`
      )
      const data = await res.json()
      if (data.media) {
        setMedia(data.media)
        if (data.folders) {
          setFolders(data.folders)
        }
      }
    } catch (err) {
      console.error("Failed to fetch media:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const res = await fetch(
          `/api/admin/media?search=${encodeURIComponent(search)}&folder=${folderFilter}&limit=50`
        )
        const data = await res.json()
        if (active && data.media) {
          setMedia(data.media)
          if (data.folders) setFolders(data.folders)
        }
      } catch (err) {
        console.error("Failed to fetch media:", err)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [search, folderFilter])

  const handleCopyUrl = (url: string, id: string) => {
    const fullUrl = window.location.origin + url
    navigator.clipboard.writeText(fullUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this media file?")) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" })
      if (res.ok) {
        setMedia(media.filter((item) => item.id !== id))
        if (selectedAsset?.id === id) setSelectedAsset(null)
      } else {
        alert("Failed to delete file")
      }
    } catch (err) {
      console.error("Delete error:", err)
      alert("Error deleting file")
    } finally {
      setDeletingId(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--deep-grove)", margin: 0 }}>
            Media Library
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
            Upload, search, and manage all images and assets for Cargill platform
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => fetchMedia()}
            className="btn btn-outline"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <FiRefreshCw /> Refresh
          </button>
          <button
            onClick={() => setShowUploadBox(!showUploadBox)}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FiUploadCloud /> {showUploadBox ? "Hide Upload" : "Upload File"}
          </button>
        </div>
      </div>

      {/* Upload Box Section */}
      {showUploadBox && (
        <div className="card" style={{ marginBottom: "24px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "600" }}>
            Upload New Media File
          </h3>
          <FileUpload
            folder="products"
            onUploadSuccess={() => {
              fetchMedia()
            }}
          />
        </div>
      )}

      {/* Filters and Search Bar */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
          <FiSearch
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search by file name or alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: "36px", width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FiFilter style={{ color: "var(--text-muted)" }} />
          <select
            value={folderFilter}
            onChange={(e) => setFolderFilter(e.target.value)}
            className="select"
            style={{ width: "180px" }}
          >
            <option value="all">All Folders</option>
            {folders.map((f) => (
              <option key={f.name} value={f.name}>
                {f.name} ({f.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid & Sidebar Detail Layout */}
      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        {/* Main Grid */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {loading ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              Loading media files...
            </div>
          ) : media.length === 0 ? (
            <div className="card" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              <FiImage style={{ fontSize: "48px", marginBottom: "12px", opacity: 0.5 }} />
              <h3>No media assets found</h3>
              <p style={{ fontSize: "14px" }}>Click &quot;Upload File&quot; to add new images to the library.</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: "16px",
              }}
            >
              {media.map((asset) => {
                const isSelected = selectedAsset?.id === asset.id
                return (
                  <div
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className="card"
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      border: isSelected ? "2px solid var(--fresh-leaf)" : "1px solid var(--stone)",
                      boxShadow: isSelected ? "0 4px 12px rgba(74, 124, 89, 0.2)" : "none",
                      transition: "all 0.2s ease",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: "6px", overflow: "hidden" }}>
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.originalName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div style={{ marginTop: "8px" }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "var(--ink)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={asset.originalName}
                      >
                        {asset.originalName}
                      </p>
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "var(--text-muted)" }}>
                        {formatFileSize(asset.size)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar Details for Selected Media */}
        {selectedAsset && (
          <div
            className="card"
            style={{
              width: "320px",
              padding: "20px",
              alignSelf: "flex-start",
              position: "sticky",
              top: "24px",
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "var(--deep-grove)" }}>
              Asset Details
            </h3>

            <div
              style={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid var(--stone)",
                marginBottom: "16px",
              }}
            >
              <img
                src={selectedAsset.url}
                alt={selectedAsset.altText || selectedAsset.originalName}
                style={{ width: "100%", height: "100%", objectFit: "contain", backgroundColor: "#f8fafc" }}
              />
            </div>

            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              <div>
                <strong>File Name:</strong>
                <p style={{ margin: "2px 0 0 0", wordBreak: "break-all", color: "var(--text-muted)" }}>
                  {selectedAsset.originalName}
                </p>
              </div>

              <div>
                <strong>Folder:</strong>
                <span className="c-chip" style={{ marginLeft: "8px", textTransform: "capitalize" }}>
                  {selectedAsset.folder}
                </span>
              </div>

              <div>
                <strong>File Size:</strong> {formatFileSize(selectedAsset.size)}
              </div>

              <div>
                <strong>Type:</strong> {selectedAsset.mimeType}
              </div>

              <div>
                <strong>URL Path:</strong>
                <p style={{ margin: "2px 0 0 0", wordBreak: "break-all", fontSize: "12px", color: "var(--text-muted)" }}>
                  {selectedAsset.url}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button
                onClick={() => handleCopyUrl(selectedAsset.url, selectedAsset.id)}
                className="btn btn-outline"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
              >
                {copiedId === selectedAsset.id ? <FiCheck color="#16a34a" /> : <FiCopy />}
                {copiedId === selectedAsset.id ? "URL Copied!" : "Copy Public URL"}
              </button>

              <button
                onClick={() => handleDelete(selectedAsset.id)}
                className="btn"
                disabled={deletingId === selectedAsset.id}
                style={{
                  width: "100%",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  cursor: "pointer",
                }}
              >
                <FiTrash2 /> {deletingId === selectedAsset.id ? "Deleting..." : "Delete Asset"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
