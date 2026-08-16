import { NextResponse } from "next/server"
import { getPrismaClient } from "@/lib/prisma"
import { ADMIN_ONLY_ROLES, ALL_ADMIN_ROLES, CONTENT_WRITE_ROLES, requireAdminAuth } from "@/lib/admin-auth"

export async function GET(request: Request) {
  const gate = await requireAdminAuth(ALL_ADMIN_ROLES)
  if (gate.error) return gate.error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type") // "category" or "subcategory"

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    // Get single category
    if (id && type === "category") {
      const category = await prisma.productCategory.findUnique({
        where: { id },
        include: {
          subcategories: {
            orderBy: { name: "asc" },
          },
          _count: {
            select: { products: true },
          },
        },
      })
      if (!category) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }
      return NextResponse.json({ category })
    }

    // Get single subcategory
    if (id && type === "subcategory") {
      const subcategory = await prisma.productSubcategory.findUnique({
        where: { id },
        include: {
          category: true,
          _count: {
            select: { products: true },
          },
        },
      })
      if (!subcategory) {
        return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
      }
      return NextResponse.json({ subcategory })
    }

    // Get all categories with subcategories and product counts
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

    // Get all subcategories
    const subcategories = await prisma.productSubcategory.findMany({
      include: {
        category: true,
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json({ categories, subcategories })
  } catch (error) {
    console.error("Error fetching data:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}

// Create category or subcategory
export async function POST(request: Request) {
  const gate = await requireAdminAuth(CONTENT_WRITE_ROLES)
  if (gate.error) return gate.error

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { type, name, slug, description, imageUrl, categoryId } = body

    if (type === "category") {
      // Check for duplicate slug
      const existing = await prisma.productCategory.findUnique({ where: { slug } })
      if (existing) {
        return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
      }

      const category = await prisma.productCategory.create({
        data: {
          id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          slug,
          description: description || "",
          imageUrl: imageUrl || "",
        },
      })

      return NextResponse.json({ category }, { status: 201 })
    }

    if (type === "subcategory") {
      // Check for duplicate slug
      const existing = await prisma.productSubcategory.findUnique({ where: { slug } })
      if (existing) {
        return NextResponse.json({ error: "A subcategory with this slug already exists" }, { status: 400 })
      }

      // Check if parent category exists
      const parentCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } })
      if (!parentCategory) {
        return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
      }

      const subcategory = await prisma.productSubcategory.create({
        data: {
          id: `subcat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name,
          slug,
          categoryId,
        },
      })

      return NextResponse.json({ subcategory }, { status: 201 })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error creating:", error)
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}

// Update category or subcategory
export async function PUT(request: Request) {
  const gate = await requireAdminAuth(CONTENT_WRITE_ROLES)
  if (gate.error) return gate.error

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  try {
    const body = await request.json()
    const { id, type, name, slug, description, imageUrl, categoryId } = body

    if (type === "category") {
      // Check if category exists
      const existing = await prisma.productCategory.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }

      // Check for duplicate slug (excluding current)
      const duplicate = await prisma.productCategory.findFirst({
        where: { slug, NOT: { id } },
      })
      if (duplicate) {
        return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
      }

      const category = await prisma.productCategory.update({
        where: { id },
        data: {
          name,
          slug,
          description: description || "",
          imageUrl: imageUrl || "",
        },
      })

      return NextResponse.json({ category })
    }

    if (type === "subcategory") {
      // Check if subcategory exists
      const existing = await prisma.productSubcategory.findUnique({ where: { id } })
      if (!existing) {
        return NextResponse.json({ error: "Subcategory not found" }, { status: 404 })
      }

      // Check for duplicate slug (excluding current)
      const duplicate = await prisma.productSubcategory.findFirst({
        where: { slug, NOT: { id } },
      })
      if (duplicate) {
        return NextResponse.json({ error: "A subcategory with this slug already exists" }, { status: 400 })
      }

      // Check if parent category exists (if changing)
      if (categoryId && categoryId !== existing.categoryId) {
        const parentCategory = await prisma.productCategory.findUnique({ where: { id: categoryId } })
        if (!parentCategory) {
          return NextResponse.json({ error: "Parent category not found" }, { status: 404 })
        }
      }

      const subcategory = await prisma.productSubcategory.update({
        where: { id },
        data: {
          name,
          slug,
          categoryId: categoryId || existing.categoryId,
        },
      })

      return NextResponse.json({ subcategory })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error updating:", error)
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}

// Delete category or subcategory
export async function DELETE(request: Request) {
  const gate = await requireAdminAuth(ADMIN_ONLY_ROLES)
  if (gate.error) return gate.error

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")

  const prisma = getPrismaClient()

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 500 })
  }

  if (!id || !type) {
    return NextResponse.json({ error: "ID and type required" }, { status: 400 })
  }

  try {
    if (type === "category") {
      // Check if category has products
      const productCount = await prisma.product.count({
        where: { categoryId: id },
      })
      if (productCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete category with ${productCount} associated products` },
          { status: 400 }
        )
      }

      // Check if category has subcategories
      const subcategoryCount = await prisma.productSubcategory.count({
        where: { categoryId: id },
      })
      if (subcategoryCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete category with ${subcategoryCount} associated subcategories` },
          { status: 400 }
        )
      }

      await prisma.productCategory.delete({ where: { id } })
      return NextResponse.json({ success: true })
    }

    if (type === "subcategory") {
      // Check if subcategory has products
      const productCount = await prisma.product.count({
        where: { subcategoryId: id },
      })
      if (productCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete subcategory with ${productCount} associated products` },
          { status: 400 }
        )
      }

      await prisma.productSubcategory.delete({ where: { id } })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch (error) {
    console.error("Error deleting:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
