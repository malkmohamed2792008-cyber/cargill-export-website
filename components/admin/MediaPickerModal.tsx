"use client"

import { useState, useEffect } from "react"
import { FiX, FiSearch, FiCheck, FiImage } from "react-icons/fi"
import FileUpload from "./FileUpload"

interface MediaAsset {
  id: string
  url: string
  originalName: string
  filename: string
  altText?: string
  folder: string
  size: number
}

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (url: string, asset?: MediaAsset) => void
  title?: string
  folder?: string
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = "Select Image from Media Library",
  folder = "products",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library")
  const [mediaList, setMediaList] = useState<MediaAsset[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | undefined>(undefined)

  useEffect(() => {
    let isMounted = true
    if (isOpen) {
      const loadMedia = async () => {
        try {
          const res = await fetch(`/api/admin/media?search=${encodeURIComponent(search)}&folder=${folder}&limit=30`)
          const data = await res.json()
          if (isMounted && data.media) {
            setMediaList(data.media)
          }
        } catch (err) {
          console.error("Failed to load media:", err)
        } finally {
          if (isMounted) setLoading(false)
        }
      }
      loadMedia()
    }
    return () => {
      isMounted = false
    }
  }, [isOpen, search, folder])

  if (!isOpen) return null

  const handleConfirmSelect = () => {
    if (selectedUrl) {
      onSelect(selectedUrl, selectedAsset)
      onClose()
    }
  }

  return (
    <div
      className="c-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        className="c-modal"
        style={{
          backgroundColor: "var(--white, #ffffff)",
          borderRadius: "12px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          className="c-modal-header"
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--stone, #e2e8f0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "var(--deep-grove)" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "20px" }}
          >
            <FiX />
          </button>
        </div>

        {/* Modal Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--stone, #e2e8f0)",
            padding: "0 24px",
            backgroundColor: "#f8fafc",
          }}
        >
          <button
            onClick={() => setActiveTab("library")}
            style={{
              padding: "12px 16px",
              border: "none",
              background: "transparent",
              borderBottom: activeTab === "library" ? "2px solid var(--fresh-leaf, #4a7c59)" : "2px solid transparent",
              fontWeight: activeTab === "library" ? "600" : "500",
              color: activeTab === "library" ? "var(--fresh-leaf, #4a7c59)" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Media Library
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            style={{
              padding: "12px 16px",
              border: "none",
              background: "transparent",
              borderBottom: activeTab === "upload" ? "2px solid var(--fresh-leaf, #4a7c59)" : "2px solid transparent",
              fontWeight: activeTab === "upload" ? "600" : "500",
              color: activeTab === "upload" ? "var(--fresh-leaf, #4a7c59)" : "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Upload New File
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>
          {activeTab === "upload" ? (
            <FileUpload
              folder={folder}
              onUploadSuccess={(url, asset) => {
                onSelect(url, asset)
                onClose()
              }}
            />
          ) : (
            <div>
              {/* Search input */}
              <div style={{ marginBottom: "16px", position: "relative" }}>
                <FiSearch style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search image name or alt text..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: "36px", width: "100%" }}
                />
              </div>

              {/* Grid of Images */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  Loading library...
                </div>
              ) : mediaList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-muted)" }}>
                  <FiImage style={{ fontSize: "36px", marginBottom: "8px" }} />
                  <p>No media files found. Upload a file using the upload tab.</p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {mediaList.map((asset) => {
                    const isSelected = selectedUrl === asset.url
                    return (
                      <div
                        key={asset.id}
                        onClick={() => {
                          setSelectedUrl(asset.url)
                          setSelectedAsset(asset)
                        }}
                        style={{
                          position: "relative",
                          aspectRatio: "1",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: isSelected ? "3px solid var(--fresh-leaf, #4a7c59)" : "1px solid var(--stone)",
                          cursor: "pointer",
                          boxShadow: isSelected ? "0 4px 6px -1px rgba(74, 124, 89, 0.3)" : "none",
                        }}
                      >
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.originalName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                        {isSelected && (
                          <div
                            style={{
                              position: "absolute",
                              top: "6px",
                              right: "6px",
                              backgroundColor: "var(--fresh-leaf, #4a7c59)",
                              color: "#fff",
                              borderRadius: "50%",
                              width: "22px",
                              height: "22px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FiCheck style={{ fontSize: "14px" }} />
                          </div>
                        )}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            fontSize: "11px",
                            padding: "4px 6px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {asset.originalName}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {activeTab === "library" && (
          <div
            className="c-modal-footer"
            style={{
              padding: "16px 24px",
              borderTop: "1px solid var(--stone, #e2e8f0)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!selectedUrl}
              onClick={handleConfirmSelect}
            >
              Select Image
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
