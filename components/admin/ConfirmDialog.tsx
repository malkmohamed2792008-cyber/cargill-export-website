"use client"

import { FiAlertTriangle } from "react-icons/fi"

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "warning" | "info"
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null

  const variantStyles = {
    danger: {
      icon: "background: var(--danger-light); color: var(--danger);",
      button: "background: var(--danger); color: var(--white);",
    },
    warning: {
      icon: "background: var(--warning-light); color: var(--sun-citrus);",
      button: "background: var(--sun-citrus); color: var(--ink);",
    },
    info: {
      icon: "background: var(--info-light); color: var(--info);",
      button: "background: var(--deep-grove); color: var(--white);",
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className="c-modal-overlay" onClick={onCancel}>
      <div className="c-modal" onClick={(e) => e.stopPropagation()}>
        <div className="c-modal-header">
          {title}
          <button
            onClick={onCancel}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", color: "var(--text-light)" }}
          >
            ✕
          </button>
        </div>
        <div className="c-modal-body">{message}</div>
        <div className="c-modal-footer">
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-ghost"
            style={{ padding: "8px 16px", fontSize: "13px" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn"
            style={{
              background: styles.button.split(";")[0].split(": ")[1],
              color: styles.button.split(";")[1].split(": ")[1],
              padding: "8px 16px",
              fontSize: "13px",
            }}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
