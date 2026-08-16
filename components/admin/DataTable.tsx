"use client"

import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

export interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  onSort?: (key: string) => void
  sortKey?: string
  sortOrder?: "asc" | "desc"
  actions?: (item: T) => React.ReactNode
  emptyMessage?: string
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onSort,
  sortKey,
  sortOrder,
  actions,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  return (
    <div className="table-responsive overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.className}
                onClick={() => onSort?.(column.key)}
                style={onSort ? { cursor: "pointer" } : undefined}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {column.header}
                  {onSort && sortKey === column.key && (
                    <span style={{ color: "var(--sun-citrus)" }}>
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {actions && (
              <th style={{ textAlign: "left" }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={keyExtractor(item)}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render
                      ? column.render(item)
                      : String((item as Record<string, unknown>)[column.key] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td style={{ textAlign: "left" }}>{actions(item)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export function TablePagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        borderTop: "1px solid var(--stone)",
        background: "var(--white)",
      }}
    >
      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
        Page {page} of {totalPages}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="page-btn"
          aria-label="Previous page"
        >
          <FiChevronLeft style={{ width: "16px", height: "16px" }} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum: number
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (page <= 3) {
            pageNum = i + 1
          } else if (page >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = page - 2 + i
          }
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`page-btn ${page === pageNum ? "active" : ""}`}
              aria-label={`Page ${pageNum}`}
              aria-current={page === pageNum ? "page" : undefined}
            >
              {pageNum}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="page-btn"
          aria-label="Next page"
        >
          <FiChevronRight style={{ width: "16px", height: "16px" }} />
        </button>
      </div>
    </div>
  )
}
