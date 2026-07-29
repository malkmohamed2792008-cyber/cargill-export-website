"use client"

import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { FiArrowRight, FiCalendar } from "react-icons/fi"
import type { Product } from "@/lib/products"
import { getSeasonRangeLabel } from "@/lib/product-utils"

interface ProductCardProps {
  product: Product
  href?: string
  variant?: "featured" | "category"
  className?: string
  showBestSellerBadge?: boolean
  showSeasonalBadge?: boolean
  seasonalBadgeLabel?: string
  showSeasonRange?: boolean
  children?: ReactNode
}

export default function ProductCard({
  product,
  href = `/products/${product.slug}`,
  variant = "featured",
  className = "",
  showBestSellerBadge = false,
  showSeasonalBadge = false,
  seasonalBadgeLabel = "In Season",
  showSeasonRange = false,
  children,
}: ProductCardProps) {
  const isCategoryVariant = variant === "category"
  const wrapperClasses = isCategoryVariant
    ? "bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full"
    : "bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-primary/30"

  return (
    <Link href={href} className={`group block ${className}`}>
      <div className={wrapperClasses}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {!isCategoryVariant && (showBestSellerBadge || showSeasonalBadge) && (
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {showBestSellerBadge && (
                <span className="bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              {showSeasonalBadge && (
                <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  {seasonalBadgeLabel}
                </span>
              )}
            </div>
          )}

          {isCategoryVariant && showBestSellerBadge && (
            <div className="absolute top-3 right-3">
              <span className="bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                Best Seller
              </span>
            </div>
          )}

          {isCategoryVariant && showSeasonalBadge && (
            <div className="absolute top-3 left-3">
              <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                {seasonalBadgeLabel}
              </span>
            </div>
          )}

          {children}
        </div>

        <div className={isCategoryVariant ? "p-5" : "p-4"}>
          <h3
            className={`font-heading font-semibold text-primary-dark mb-1 group-hover:text-primary transition-colors ${
              isCategoryVariant ? "text-lg" : "text-lg"
            }`}
          >
            {product.name}
          </h3>
          <p className={`text-sm text-gray-500 line-clamp-2 ${isCategoryVariant ? "mb-4 text-gray-600" : "mb-3"}`}>
            {product.shortDescription}
          </p>

          {showSeasonRange && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <FiCalendar className="w-3 h-3" />
              <span>{getSeasonRangeLabel(product.exportSeason.availableMonths)}</span>
            </div>
          )}

          {isCategoryVariant && (
            <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors">
              <span>View Details</span>
              <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
