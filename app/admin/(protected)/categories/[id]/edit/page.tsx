"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi"

interface CategoryFormData {
  name: string
  slug: string
  description: string
  imageUrl: string
}

const initialFormData: CategoryFormData = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
}

export default function CategoryFormPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string | undefined
  const isEdit = !!categoryId

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData)

  useEffect(() => {
    if (isEdit && categoryId) {
      async function fetchCategory() {
        try {
          const response = await fetch(`/api/admin/categories?id=${categoryId}&type=category`)
          if (response.ok) {
            const data = await response.json()
            setFormData({
              name: data.category.name,
              slug: data.category.slug,
              description: data.category.description || "",
              imageUrl: data.category.imageUrl || "",
            })
          }
        } catch (err) {
          console.error("Error fetching category:", err)
        } finally {
          setFetching(false)
        }
      }
      fetchCategory()
    }
  }, [isEdit, categoryId])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: value }
      // Auto-generate slug if creating new and slug is empty
      if (!isEdit && value && !prev.slug) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEdit ? `/api/admin/categories?id=${categoryId}&type=category` : "/api/admin/categories"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "category" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save category")
      }

      router.push("/admin/categories")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/categories"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/categories"
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50"
          >
            {loading && <FiLoader className="w-5 h-5 animate-spin" />}
            <FiSave className="w-5 h-5" />
            {isEdit ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
