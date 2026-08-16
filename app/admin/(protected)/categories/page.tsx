import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPrismaClient } from "@/lib/prisma"
import { FiPlus, FiEdit2, FiTrash2, FiFolder } from "react-icons/fi"
import SearchBar from "@/components/admin/SearchBar"
import DataTable, { TablePagination } from "@/components/admin/DataTable"

export const metadata: Metadata = {
  title: "Categories | CARGILL Admin",
  description: "Manage categories and subcategories",
}

interface Props {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>
}

async function getCategoriesData({
  page = "1",
  search,
  type,
}: {
  page?: string
  search?: string
  type?: string
}) {
  const prisma = getPrismaClient()
  if (!prisma) {
    return {
      categories: [],
      subcategories: [],
      total: 0,
      totalPages: 0,
      page: 1,
    }
  }

  const pageNum = parseInt(page) || 1
  const limit = 10
  const skip = (pageNum - 1) * limit

  // Get all categories with counts
  const categories = await prisma.productCategory.findMany({
    include: {
      subcategories: {
        include: {
          _count: {
            select: { products: true },
          },
        },
        orderBy: { name: "asc" },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  })

  // Filter by search
  let filteredCategories = categories
  let filteredSubcategories: typeof categories[0]["subcategories"] = []

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCategories = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchLower) ||
        cat.slug.toLowerCase().includes(searchLower)
    )

    // Also filter subcategories
    filteredSubcategories = categories
      .flatMap((cat) =>
        cat.subcategories.map((sub) => ({
          ...sub,
          categoryName: cat.name,
          categoryId: cat.id,
        }))
      )
      .filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchLower) ||
          sub.slug.toLowerCase().includes(searchLower)
      )
  }

  // Filter by type if specified
  let total = filteredCategories.length
  if (type === "subcategory") {
    filteredSubcategories = categories.flatMap((cat) =>
      cat.subcategories.map((sub) => ({
        ...sub,
        categoryName: cat.name,
        categoryId: cat.id,
      }))
    )
    if (search) {
      const searchLower = search.toLowerCase()
      filteredSubcategories = filteredSubcategories.filter(
        (sub) =>
          sub.name.toLowerCase().includes(searchLower) ||
          sub.slug.toLowerCase().includes(searchLower)
      )
    }
    total = filteredSubcategories.length
  }

  // Paginate
  const paginatedCategories = filteredCategories.slice(skip, skip + limit)
  const paginatedSubcategories = filteredSubcategories.slice(skip, skip + limit)

  return {
    categories: paginatedCategories,
    subcategories: paginatedSubcategories,
    total,
    totalPages: Math.ceil(total / limit),
    page: pageNum,
  }
}

export default async function AdminCategoriesPage({ searchParams }: Props) {
  const params = await searchParams
  const { categories, subcategories, total, totalPages, page } = await getCategoriesData(params)

  const categoryColumns = [
    {
      key: "image",
      header: "Image",
      className: "w-16",
      render: (category: typeof categories[0]) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {category.imageUrl ? (
            <Image src={category.imageUrl} alt={category.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FiFolder className="w-5 h-5" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Category Name",
      render: (category: typeof categories[0]) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
          <p className="text-sm text-gray-500">{category.slug}</p>
        </div>
      ),
    },
    {
      key: "subcategories",
      header: "Subcategories",
      render: (category: typeof categories[0]) => category.subcategories.length,
    },
    {
      key: "products",
      header: "Products",
      render: (category: typeof categories[0]) => category._count.products,
    },
    {
      key: "actions",
      header: "",
      render: (category: typeof categories[0]) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/categories/${category.id}/edit`}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/categories/${category.id}/delete`}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ]

  const subcategoryColumns = [
    {
      key: "name",
      header: "Subcategory Name",
      render: (sub: typeof subcategories[0] & { categoryName: string }) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{sub.name}</p>
          <p className="text-sm text-gray-500">{sub.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Parent Category",
      render: (sub: typeof subcategories[0] & { categoryName: string }) => (
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <FiFolder className="w-3 h-3" />
          {sub.categoryName}
        </div>
      ),
    },
    {
      key: "products",
      header: "Products",
      render: (sub: typeof subcategories[0] & { categoryName: string }) => sub._count.products,
    },
    {
      key: "actions",
      header: "",
      render: (sub: typeof subcategories[0] & { categoryName: string }) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/admin/subcategories/${sub.id}/edit`}
            className="p-2 text-gray-500 hover:text-primary transition-colors"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </Link>
          <Link
            href={`/admin/subcategories/${sub.id}/delete`}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </Link>
        </div>
      ),
    },
  ]

  const activeType = params.type || "category"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories & Subcategories</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {total} item{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Category
          </Link>
          <Link
            href="/admin/subcategories/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Subcategory
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex gap-6">
          <Link
            href="/admin/categories"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeType === "category"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Categories ({categories.length})
          </Link>
          <Link
            href="/admin/categories?type=subcategory"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeType === "subcategory"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Subcategories ({subcategories.length})
          </Link>
        </nav>
      </div>

      {/* Search */}
      <SearchBar placeholder="Search categories..." defaultValue={params.search || ""} />

      {/* Content */}
      {activeType === "category" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {categories.length > 0 ? (
            <>
              <DataTable
                columns={categoryColumns}
                data={categories}
                keyExtractor={(category) => category.id}
                emptyMessage="No categories found"
              />
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  window.location.href = `/admin/categories?page=${newPage}${params.search ? `&search=${params.search}` : ""}`
                }}
              />
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No categories found. Create your first category to get started.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          {subcategories.length > 0 ? (
            <>
              <DataTable
                columns={subcategoryColumns}
                data={subcategories.map((sub) => ({
                  ...sub,
                  categoryName: categories.find((c) => c.subcategories.some((s) => s.id === sub.id))?.name || "",
                }))}
                keyExtractor={(sub) => sub.id}
                emptyMessage="No subcategories found"
              />
              <TablePagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  const sp = new URLSearchParams()
                  sp.set("page", String(newPage))
                  sp.set("type", "subcategory")
                  if (params.search) sp.set("search", params.search)
                  window.location.href = `/admin/categories?${sp.toString()}`
                }}
              />
            </>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No subcategories found. Create your first subcategory to get started.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
