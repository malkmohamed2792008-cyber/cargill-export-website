"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FiChevronDown } from "react-icons/fi"

interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  name: string
  label: string
  options: FilterOption[]
  defaultValue?: string
  className?: string
  onChange?: (value: string) => void
  searchPath?: string
}

export default function FilterSelect({
  name,
  label,
  options,
  defaultValue = "",
  className = "",
  onChange,
  searchPath = "/admin/products"
}: FilterSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    params.delete("page")

    if (onChange) {
      onChange(value)
    } else {
      router.push(`${searchPath}?${params.toString()}`)
    }
  }

  const currentValue = searchParams.get(name) || defaultValue

  return (
    <div className={`relative ${className}`}>
      <select
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        className="select appearance-none pr-10"
        style={{ minWidth: "160px" }}
      >
        <option value="">All {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: "16px", height: "16px", color: "var(--text-light)" }}
      />
    </div>
  )
}
