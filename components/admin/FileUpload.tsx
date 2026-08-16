"use client"

import { useState, useRef } from "react"
import { FiUploadCloud, FiCheck, FiAlertCircle, FiLoader } from "react-icons/fi"

export interface UploadedMediaAsset {
  id: string
  url: string
  originalName: string
  filename: string
  folder: string
  size: number
}

interface FileUploadProps {
  onUploadSuccess?: (url: string, media?: UploadedMediaAsset) => void
  folder?: string
  altText?: string
  accept?: string
  className?: string
  label?: string
}

export default function FileUpload({
  onUploadSuccess,
  folder = "products",
  altText = "",
  accept = "image/*",
  className = "",
  label = "Drag & drop image here or click to browse",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setSuccessMsg(null)

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.")
      return
    }

    if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
      setError("SVG files are not allowed for security reasons.")
      return
    }

    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)
      formData.append("altText", altText || file.name)

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setSuccessMsg("Uploaded successfully!")
      if (onUploadSuccess && data.media?.url) {
        onUploadSuccess(data.media.url, data.media)
      } else if (onUploadSuccess && data.url) {
        onUploadSuccess(data.url)
      }
    } catch (err: unknown) {
      const errorObj = err as Error
      setError(errorObj.message || "An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  return (
    <div className={`file-upload-wrapper ${className}`}>
      <div
        className={`c-upload ${isDragging ? "is-active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          cursor: "pointer",
          border: isDragging ? "2px dashed var(--fresh-leaf)" : "2px dashed var(--stone)",
          borderRadius: "var(--radius-m, 8px)",
          padding: "24px",
          textAlign: "center",
          backgroundColor: isDragging ? "rgba(74, 124, 89, 0.05)" : "var(--white, #ffffff)",
          transition: "all 0.2s ease",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: "none" }}
        />

        {isUploading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <FiLoader className="spin" style={{ fontSize: "28px", color: "var(--deep-grove, #1b382b)" }} />
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "var(--text-muted)" }}>
              Uploading image...
            </p>
          </div>
        ) : previewUrl ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            {/* Image Preview */}
            <div style={{ width: "80px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--stone)" }}>
              <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--fresh-leaf)", fontWeight: 600 }}>
              Click or drag to replace image
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <FiUploadCloud style={{ fontSize: "32px", color: "var(--deep-grove)" }} />
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{label}</p>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
              Supports JPG, PNG, WebP, GIF, AVIF (Max 10MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: "#dc2626", fontSize: "13px" }}>
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: "#16a34a", fontSize: "13px" }}>
          <FiCheck />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  )
}
