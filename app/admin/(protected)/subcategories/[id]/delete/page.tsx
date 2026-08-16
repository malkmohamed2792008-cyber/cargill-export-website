"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiLoader, FiTrash2 } from "react-icons/fi"

export default function DeleteSubcategoryPage() {
  const router = useRouter()
  const params = useParams()
  const subcategoryId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [subcategoryName, setSubcategoryName] = useState("")

  // Fetch subcategory name on mount
  useState(() => {
    async function fetchSubcategory() {
      try {
        const response = await fetch(`/api/admin/categories?id=${subcategoryId}&type=subcategory`)
        if (response.ok) {
          const data = await response.json()
          setSubcategoryName(data.subcategory?.name || "")
        }
      } catch (err) {
        console.error("Error fetching subcategory:", err)
      }
    }
    fetchSubcategory()
  })

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/categories?id=${subcategoryId}&type=subcategory`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete subcategory")
      }

      router.push("/admin/categories?type=subcategory")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Link
        href="/admin/categories?type=subcategory"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Subcategories
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <FiTrash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Delete Subcategory</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Are you sure you want to delete this subcategory? This action cannot be undone.
            </p>
            {subcategoryName && (
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
                Subcategory: {subcategoryName}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/categories?type=subcategory"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </Link>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <FiLoader className="w-4 h-4 animate-spin" />}
            Delete Subcategory
          </button>
        </div>
      </div>
    </div>
  )
}
