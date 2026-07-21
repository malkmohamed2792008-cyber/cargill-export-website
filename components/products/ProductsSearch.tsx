"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiSearch, FiX } from "react-icons/fi"
const Search = FiSearch
const X = FiX
import Link from "next/link"
import Image from "next/image"
import { searchProducts } from "@/lib/products"
import { Product } from "@/lib/products"

export default function ProductsSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length >= 2) {
      const results = searchProducts(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearchFocused(false)
  }

  return (
    <section className="relative bg-white py-8 border-b">
      <div className="container-main">
        <div className="max-w-2xl mx-auto">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors text-lg"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto z-50"
                >
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2">
                      {searchResults.length} product{searchResults.length !== 1 ? "s" : ""} found
                    </p>
                    {searchResults.slice(0, 6).map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          setIsSearchFocused(false)
                          setSearchQuery("")
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.shortDescription}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.length > 6 && (
                      <Link
                        href={`/products?search=${encodeURIComponent(searchQuery)}`}
                        onClick={() => {
                          setIsSearchFocused(false)
                        }}
                        className="block p-3 text-center text-primary font-medium hover:bg-gray-50 rounded-lg"
                      >
                        View all {searchResults.length} results
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results */}
            <AnimatePresence>
              {isSearchFocused && searchQuery.length >= 2 && searchResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-6 text-center z-50"
                >
                  <p className="text-gray-500">No products found for &quot;{searchQuery}&quot;</p>
                  <p className="text-sm text-gray-400 mt-1">Try searching for different keywords</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="text-sm text-gray-500">Popular:</span>
            {["Orange", "Potato", "Rice", "Tomato"].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="text-sm text-primary hover:text-accent transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}