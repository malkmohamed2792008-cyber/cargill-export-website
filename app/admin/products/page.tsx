import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPrismaClient } from "@/lib/prisma"
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi"
import SearchBar from "@/components/admin/SearchBar"
import FilterSelect from "@/components/admin/FilterSelect"
import DataTable, { TablePagination } from "@/components/admin/DataTable"
import { format } from "date-fns"

export const metadata: Metadata = {
  title: "Products | CARGILL Admin",
  description: "Manage products",
}

interface Props {
  searchParams: Promise<{ page?: string; search?: string; category?: string; subcategory?: string; sort?: string }>
}

async function getProducts({
  page = "1",
  search,
  category,
  subcategory,
  sort,
}: {
  page?: string
  search?: string
  category?: string
  subcategory?: string
  sort?: string
}) {
  const prisma = getPrismaClient()
  if (!prisma) {
    return {
      products: [],
      total: 0,
      totalPages: 0,
      page: 1,
      categories: [],
      subcategories: [],
    }
  }

  const pageNum = parseInt(page) || 1
  const limit = 10
  const skip = (pageNum - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
    ]
  }

  if (category) {
    where.categoryId = category
  }

  if (subcategory) {
    where.subcategoryId = subcategory
  }

  const orderBy: Record<string, string> = {}
  if (sort) {
    const [field, direction] = sort.split("-")
    orderBy[field] = direction
  } else {
    orderBy.createdAt = "desc"
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        subcategory: true,
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  const categories = await prisma.productCategory.findMany({
    orderBy: { name: "asc" },
  })

  const subcategories = await prisma.productSubcategory.findMany({
    orderBy: { name: "asc" },
  })

  return {
    products,
    total,
    totalPages: Math.ceil(total / limit),
    page: pageNum,
    categories,
    subcategories,
  }
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams
  const { products, total, totalPages, page, categories, subcategories } = await getProducts(params)

  const columns = [
    {
      key: "image",
      header: "Image",
      className: "w-20",
      render: (product: typeof products[0]) => (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              N/A
            </div>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Product Name",
      render: (product: typeof products[0]) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
          <p className="text-sm text-gray-500">{product.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (product: typeof products[0]) => product.category?.name || "-",
    },
    {
      key: "subcategory",
      header: "Subcategory",
      render: (product: typeof products[0]) => product.subcategory?.name || "-",
    },
    {
      key: "isBestSelling",
      header: "Status",
      render: (product: typeof products[0]) => (
        <div className="flex gap-2">
          {product.isBestSelling && (
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
              Best Seller
            </span>
          )}
          {product.isSeasonal && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
              Seasonal
            </span>
          )}
          {!product.isBestSelling && !product.isSeasonal && (
            <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
              Standard
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      render: (product: typeof products[0]) =>
        product.createdAt ? format(new Date(product.createdAt), "MMM d, yyyy") : "-",
    },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--deep-grove)", margin: "0 0 4px" }}>
            Products
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn btn-primary"
        >
          <FiPlus style={{ width: "16px", height: "16px" }} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "200px" }}>
          <SearchBar placeholder="Search products..." defaultValue={params.search || ""} />
        </div>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <FilterSelect
            name="category"
            label="Category"
            options={categories.map((c) => ({ value: c.id, label: c.name }))}
            defaultValue={params.category || ""}
          />
          <FilterSelect
            name="subcategory"
            label="Subcategory"
            options={subcategories.map((s) => ({ value: s.id, label: s.name }))}
            defaultValue={params.subcategory || ""}
          />
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(product) => product.id}
          actions={(product) => (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                style={{ padding: "8px", color: "var(--text-muted)", transition: "color 0.2s" }}
                title="View"
              >
                <FiEye style={{ width: "16px", height: "16px" }} />
              </Link>
              <Link
                href={`/admin/products/${product.id}/edit`}
                style={{ padding: "8px", color: "var(--text-muted)", transition: "color 0.2s" }}
                title="Edit"
              >
                <FiEdit2 style={{ width: "16px", height: "16px" }} />
              </Link>
              <Link
                href={`/admin/products/${product.id}/delete`}
                style={{ padding: "8px", color: "var(--danger)", transition: "color 0.2s" }}
                title="Delete"
              >
                <FiTrash2 style={{ width: "16px", height: "16px" }} />
              </Link>
            </div>
          )}
          emptyMessage="No products found"
        />
        <TablePagination
          page={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            const sp = new URLSearchParams()
            sp.set("page", String(newPage))
            if (params.search) sp.set("search", params.search)
            if (params.category) sp.set("category", params.category)
            if (params.subcategory) sp.set("subcategory", params.subcategory)
            window.location.href = `/admin/products?${sp.toString()}`
          }}
        />
      </div>
    </div>
  )
}
