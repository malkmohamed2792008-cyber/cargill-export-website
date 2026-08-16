"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { FiArrowLeft, FiSave, FiLoader, FiPlus, FiTrash2, FiUploadCloud } from "react-icons/fi"
import MediaPickerModal from "@/components/admin/MediaPickerModal"

interface Category {
  id: string
  name: string
  slug: string
  subcategories: { id: string; name: string; slug: string }[]
}

interface ProductFormData {
  name: string
  slug: string
  categoryId: string
  subcategoryId: string
  description: string
  shortDescription: string
  imageUrl: string
  isBestSelling: boolean
  isSeasonal: boolean
  // Specification
  specification: {
    productName: string
    scientificName: string
    category: string
    origin: string
    countryOfOrigin: string
    variety: string
    color: string
    shape: string
    size: string
    diameter: string
    weight: string
    taste: string
    texture: string
    moistureLevel: string
    maturity: string
    qualityGrade: string
    exportGrade: string
    shelfLife: string
    storageTemperature: string
    humidityRecommendation: string
    transportationMethod: string
    availability: string
  }
  // Export Season
  exportSeason: {
    availableMonths: number[]
    peakExportMonths: number[]
    offSeason: number[]
  }
  // Packaging
  packaging: { type: string; description: string; imageUrl: string }[]
  // Carton Spec
  cartonSpec: {
    cartonSize: string
    netWeight: string
    grossWeight: string
    dimensions: string
    piecesPerCarton: string
    cartonsPerPallet: string
  }
  // Storage
  storage: {
    storageTemperature: string
    humidity: string
    shippingMethod: string
    refrigeratedContainer: string
    shelfLifeDuringShipping: string
  }
  // Export Countries
  exportedTo: { name: string; code: string }[]
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
]

const initialFormData: ProductFormData = {
  name: "",
  slug: "",
  categoryId: "",
  subcategoryId: "",
  description: "",
  shortDescription: "",
  imageUrl: "",
  isBestSelling: false,
  isSeasonal: false,
  specification: {
    productName: "",
    scientificName: "",
    category: "",
    origin: "",
    countryOfOrigin: "Egypt",
    variety: "",
    color: "",
    shape: "",
    size: "",
    diameter: "",
    weight: "",
    taste: "",
    texture: "",
    moistureLevel: "",
    maturity: "",
    qualityGrade: "Grade A",
    exportGrade: "Grade A",
    shelfLife: "",
    storageTemperature: "0-4°C",
    humidityRecommendation: "",
    transportationMethod: "Sea",
    availability: "In Stock",
  },
  exportSeason: {
    availableMonths: [],
    peakExportMonths: [],
    offSeason: [],
  },
  packaging: [{ type: "", description: "", imageUrl: "" }],
  cartonSpec: {
    cartonSize: "",
    netWeight: "",
    grossWeight: "",
    dimensions: "",
    piecesPerCarton: "",
    cartonsPerPallet: "",
  },
  storage: {
    storageTemperature: "",
    humidity: "",
    shippingMethod: "",
    refrigeratedContainer: "Yes",
    shelfLifeDuringShipping: "",
  },
  exportedTo: [],
}

export default function ProductFormPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string | undefined
  const isEdit = !!productId

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState("")
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)

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
    if (isEdit && productId) {
      async function fetchProduct() {
        try {
          const response = await fetch(`/api/admin/products/${productId}`)
          if (response.ok) {
            const data = await response.json()
            setFormData({
              ...initialFormData,
              ...data.product,
              specification: { ...initialFormData.specification, ...data.product.specification },
              exportSeason: { ...initialFormData.exportSeason, ...data.product.exportSeason },
              packaging: data.product.packaging?.length ? data.product.packaging : initialFormData.packaging,
              cartonSpec: { ...initialFormData.cartonSpec, ...data.product.cartonSpec },
              storage: { ...initialFormData.storage, ...data.product.storage },
              exportedTo: data.product.exportedCountries?.map((c: { name: string; code: string }) => ({ name: c.name, code: c.code })) || [],
            })
          }
        } catch (err) {
          console.error("Error fetching product:", err)
        } finally {
          setFetching(false)
        }
      }
      fetchProduct()
    }
  }, [isEdit, productId])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, name: value }
      // Auto-generate slug if creating new product and slug is empty
      if (!isEdit && value && !prev.slug) {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const handleChange = (
    section: keyof ProductFormData | "specification" | "exportSeason" | "packaging" | "cartonSpec" | "storage",
    field: string,
    value: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, unknown>),
        [field]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to save product")
      }

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addPackaging = () => {
    setFormData((prev) => ({
      ...prev,
      packaging: [...prev.packaging, { type: "", description: "", imageUrl: "" }],
    }))
  }

  const removePackaging = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      packaging: prev.packaging.filter((_, i) => i !== index),
    }))
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiLoader className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name *
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
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, categoryId: e.target.value, subcategoryId: "" }))
                }}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subcategory *
              </label>
              <select
                required
                value={formData.subcategoryId}
                onChange={(e) => setFormData((prev) => ({ ...prev, subcategoryId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                disabled={!formData.categoryId}
              >
                <option value="">Select Subcategory</option>
                {categories
                  .find((c) => c.id === formData.categoryId)
                  ?.subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
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
                Product Main Image
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="URL or select from library..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2 whitespace-nowrap"
                >
                  <FiUploadCloud /> Pick / Upload
                </button>
              </div>

              {formData.imageUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                    <img
                      src={formData.imageUrl}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = "none"
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">Selected main product image preview</span>
                </div>
              )}

              <MediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
                folder="products"
              />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBestSelling}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isBestSelling: e.target.checked }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Best Seller</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isSeasonal}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isSeasonal: e.target.checked }))}
                  className="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Seasonal</span>
              </label>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.specification.productName}
                onChange={(e) => handleChange("specification", "productName", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Scientific Name
              </label>
              <input
                type="text"
                value={formData.specification.scientificName}
                onChange={(e) => handleChange("specification", "scientificName", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.specification.category}
                onChange={(e) => handleChange("specification", "category", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Origin
              </label>
              <input
                type="text"
                value={formData.specification.origin}
                onChange={(e) => handleChange("specification", "origin", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country of Origin
              </label>
              <input
                type="text"
                value={formData.specification.countryOfOrigin}
                onChange={(e) => handleChange("specification", "countryOfOrigin", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Variety
              </label>
              <input
                type="text"
                value={formData.specification.variety}
                onChange={(e) => handleChange("specification", "variety", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color
              </label>
              <input
                type="text"
                value={formData.specification.color}
                onChange={(e) => handleChange("specification", "color", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Size
              </label>
              <input
                type="text"
                value={formData.specification.size}
                onChange={(e) => handleChange("specification", "size", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight
              </label>
              <input
                type="text"
                value={formData.specification.weight}
                onChange={(e) => handleChange("specification", "weight", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quality Grade
              </label>
              <input
                type="text"
                value={formData.specification.qualityGrade}
                onChange={(e) => handleChange("specification", "qualityGrade", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Export Grade
              </label>
              <input
                type="text"
                value={formData.specification.exportGrade}
                onChange={(e) => handleChange("specification", "exportGrade", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shelf Life
              </label>
              <input
                type="text"
                value={formData.specification.shelfLife}
                onChange={(e) => handleChange("specification", "shelfLife", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Storage Temperature
              </label>
              <input
                type="text"
                value={formData.specification.storageTemperature}
                onChange={(e) => handleChange("specification", "storageTemperature", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Availability
              </label>
              <input
                type="text"
                value={formData.specification.availability}
                onChange={(e) => handleChange("specification", "availability", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Export Season */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export Season</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Months
              </label>
              <div className="flex flex-wrap gap-2">
                {months.map((month) => (
                  <button
                    key={month.value}
                    type="button"
                    onClick={() => {
                      const current = formData.exportSeason.availableMonths
                      const updated = current.includes(month.value)
                        ? current.filter((m) => m !== month.value)
                        : [...current, month.value].sort()
                      setFormData((prev) => ({
                        ...prev,
                        exportSeason: { ...prev.exportSeason, availableMonths: updated },
                      }))
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      formData.exportSeason.availableMonths.includes(month.value)
                        ? "bg-primary text-white border-primary"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Peak Export Months
              </label>
              <div className="flex flex-wrap gap-2">
                {months.map((month) => (
                  <button
                    key={month.value}
                    type="button"
                    onClick={() => {
                      const current = formData.exportSeason.peakExportMonths
                      const updated = current.includes(month.value)
                        ? current.filter((m) => m !== month.value)
                        : [...current, month.value].sort()
                      setFormData((prev) => ({
                        ...prev,
                        exportSeason: { ...prev.exportSeason, peakExportMonths: updated },
                      }))
                    }}
                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                      formData.exportSeason.peakExportMonths.includes(month.value)
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {month.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Packaging */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Packaging</h2>
            <button
              type="button"
              onClick={addPackaging}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
            >
              <FiPlus className="w-4 h-4" />
              Add Packaging
            </button>
          </div>
          <div className="space-y-4">
            {formData.packaging.map((pkg, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Type"
                    value={pkg.type}
                    onChange={(e) => {
                      const updated = [...formData.packaging]
                      updated[index].type = e.target.value
                      setFormData((prev) => ({ ...prev, packaging: updated }))
                    }}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={pkg.description}
                    onChange={(e) => {
                      const updated = [...formData.packaging]
                      updated[index].description = e.target.value
                      setFormData((prev) => ({ ...prev, packaging: updated }))
                    }}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={pkg.imageUrl}
                    onChange={(e) => {
                      const updated = [...formData.packaging]
                      updated[index].imageUrl = e.target.value
                      setFormData((prev) => ({ ...prev, packaging: updated }))
                    }}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                {formData.packaging.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePackaging(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Carton Specification */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Carton Specification</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Carton Size
              </label>
              <input
                type="text"
                value={formData.cartonSpec.cartonSize}
                onChange={(e) => handleChange("cartonSpec", "cartonSize", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Net Weight
              </label>
              <input
                type="text"
                value={formData.cartonSpec.netWeight}
                onChange={(e) => handleChange("cartonSpec", "netWeight", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gross Weight
              </label>
              <input
                type="text"
                value={formData.cartonSpec.grossWeight}
                onChange={(e) => handleChange("cartonSpec", "grossWeight", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                value={formData.cartonSpec.dimensions}
                onChange={(e) => handleChange("cartonSpec", "dimensions", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pieces per Carton
              </label>
              <input
                type="text"
                value={formData.cartonSpec.piecesPerCarton}
                onChange={(e) => handleChange("cartonSpec", "piecesPerCarton", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cartons per Pallet
              </label>
              <input
                type="text"
                value={formData.cartonSpec.cartonsPerPallet}
                onChange={(e) => handleChange("cartonSpec", "cartonsPerPallet", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Storage */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Storage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Storage Temperature
              </label>
              <input
                type="text"
                value={formData.storage.storageTemperature}
                onChange={(e) => handleChange("storage", "storageTemperature", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Humidity
              </label>
              <input
                type="text"
                value={formData.storage.humidity}
                onChange={(e) => handleChange("storage", "humidity", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipping Method
              </label>
              <input
                type="text"
                value={formData.storage.shippingMethod}
                onChange={(e) => handleChange("storage", "shippingMethod", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Refrigerated Container
              </label>
              <input
                type="text"
                value={formData.storage.refrigeratedContainer}
                onChange={(e) => handleChange("storage", "refrigeratedContainer", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shelf Life During Shipping
              </label>
              <input
                type="text"
                value={formData.storage.shelfLifeDuringShipping}
                onChange={(e) => handleChange("storage", "shelfLifeDuringShipping", e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {/* Export Countries */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Export Countries</h2>
            <button
              type="button"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  exportedTo: [...prev.exportedTo, { name: "", code: "" }],
                }))
              }}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
            >
              <FiPlus className="w-4 h-4" />
              Add Country
            </button>
          </div>
          <div className="space-y-4">
            {formData.exportedTo.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No export countries added</p>
            ) : (
              formData.exportedTo.map((country, index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Country Name"
                      value={country.name}
                      onChange={(e) => {
                        const updated = [...formData.exportedTo]
                        updated[index].name = e.target.value
                        setFormData((prev) => ({ ...prev, exportedTo: updated }))
                      }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Country Code (e.g., SA, UAE)"
                      value={country.code}
                      onChange={(e) => {
                        const updated = [...formData.exportedTo]
                        updated[index].code = e.target.value.toUpperCase()
                        setFormData((prev) => ({ ...prev, exportedTo: updated }))
                      }}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                  {formData.exportedTo.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          exportedTo: prev.exportedTo.filter((_, i) => i !== index),
                        }))
                      }}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
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
            {isEdit ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
