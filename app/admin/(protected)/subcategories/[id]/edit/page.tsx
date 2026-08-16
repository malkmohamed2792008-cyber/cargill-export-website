"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiSave, FiLoader } from "react-icons/fi"

interface Category {
  id: string
  name: string
}

interface SubcategoryFormData {
  name: string
  slug: string
  categoryId: string
}

const initialFormData: SubcategoryFormData = {
  name: "",
  slug: "",
  categoryId: "",
}

export default function SubcategoryFormPage() {
  const router = useRouter()
  const params = useParams()
  const subcategoryId = params.id as string | undefined
  const isEdit = !!subcategoryId

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<SubcategoryFormData>(initialFormData)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/admin/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    if (isEdit && subcategoryId) {
      async function fetchSubcategory() {
        try {
          const response = await fetch(`/api/admin/categories?id=${subcategoryId}&type=subcategory`)
          if (response.ok) {
            const data = await response.json()
            setFormData({
              name: data.subcategory.name,
              slug: data.subcategory.slug,
              categoryId: data.subcategory.categoryId,
            })
          }
        } catch (err) {
          console.error("Error fetching subcategory:", err)
        } finally {
          setFetching(false)
        }
      }
      fetchSubcategory()
    }
  }, [isEdit, subcategoryId])

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
      const url = isEdit ? `/api/admin/categories?id=${subcategoryId}&type=subcategory` : "/api/admin/categories"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "subcategory" }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save subcategory")
      }

      router.push("/admin/categories?type=subcategory")
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
          href="/admin/categories?type=subcategory"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Subcategories
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
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subcategory Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subcategory Name *
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
                Parent Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/categories?type=subcategory"
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary-dark disabled:opacity-50"
          >
            {loading && <FiLoader className="w-5 h-5 animate-spin" />}
            <FiSave className="w-5 h-5" />
            {isEdit ? "Update Subcategory" : "Create Subcategory"}
          </button>
        </div>
      </form>
    </div>
  )
}
