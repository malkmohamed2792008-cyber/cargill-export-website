"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FiSearch, FiX } from "react-icons/fi"

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  className?: string
  onSearch?: (query: string) => void
  searchPath?: string
}

export default function SearchBar({
  placeholder = "Search...",
  defaultValue = "",
  className = "",
  onSearch,
  searchPath = "/admin/products"
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)

  const handleSearch = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) {
        params.set("search", query)
      } else {
        params.delete("search")
      }
      params.delete("page")

      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`${searchPath}?${params.toString()}`)
      }
    },
    [router, searchParams, onSearch, searchPath]
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(value)
  }

  const handleClear = () => {
    setValue("")
    handleSearch("")
  }

  return (
    <form onSubmit={handleSubmit} className={`c-search ${className}`}>
      <FiSearch />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}
        >
          <FiX style={{ width: "16px", height: "16px" }} />
        </button>
      )}
    </form>
  )
}
