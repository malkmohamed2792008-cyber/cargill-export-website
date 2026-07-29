import type { Product } from "@/lib/products"

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export interface ProductSelectionFilters {
  category?: string | null
  subcategory?: string | null
  search?: string | null
}

export function normalizeCatalogText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

export function matchesCatalogQuery(product: Product, query: string) {
  const needle = normalizeCatalogText(query)
  if (!needle) return true

  return [
    product.name,
    product.shortDescription,
    product.description,
    product.specifications.category,
    product.categoryId,
    product.subcategoryId,
    product.slug,
  ].some((value) => normalizeCatalogText(value).includes(needle))
}

export function matchesCatalogSelection(product: Product, filters: ProductSelectionFilters) {
  if (filters.category && product.categoryId !== filters.category) {
    return false
  }

  if (filters.subcategory && product.subcategoryId !== filters.subcategory) {
    return false
  }

  if (filters.search && !matchesCatalogQuery(product, filters.search)) {
    return false
  }

  return true
}

export function filterCatalogProducts(products: Product[], filters: ProductSelectionFilters) {
  return products.filter((product) => matchesCatalogSelection(product, filters))
}

export function getSeasonRangeLabel(months: number[]) {
  if (months.length === 0) {
    return "Year-round"
  }

  const start = MONTH_LABELS[months[0] - 1] ?? ""
  const end = MONTH_LABELS[months[months.length - 1] - 1] ?? ""

  if (!start || !end) {
    return "Year-round"
  }

  return `${start} - ${end}`
}

export function getProductCollectionHref(categorySlug?: string | null, subcategorySlug?: string | null) {
  const params = new URLSearchParams()

  if (categorySlug) {
    params.set("category", categorySlug)
  }

  if (subcategorySlug) {
    params.set("subcategory", subcategorySlug)
  }

  const query = params.toString()
  return query ? `/products?${query}` : "/products"
}
