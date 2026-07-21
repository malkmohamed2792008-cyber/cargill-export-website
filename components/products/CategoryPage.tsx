"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ProductCategory, Product } from "@/lib/products"
import { FiArrowRight, FiArrowLeft } from "react-icons/fi"

interface CategoryPageProps {
  category: ProductCategory
  products: Product[]
}

export default function CategoryPage({ category, products }: CategoryPageProps) {
  return (
    <>
      {/* Category Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-primary-dark/50" />
        </div>

        {/* Content */}
        <div className="container-main relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            {/* Breadcrumb */}
            <div className="flex items-center text-white/80 text-sm mb-4">
              <Link href="/products" className="hover:text-white transition-colors">
                Products
              </Link>
              <FiArrowRight className="mx-2" />
              <span className="text-white">{category.name}</span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {category.name}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              {category.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-2xl font-bold text-white">{products.length}</span>
                <span className="text-white/80 ml-2">Products</span>
              </div>
              {category.subcategories && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-2xl font-bold text-white">{category.subcategories.length}</span>
                  <span className="text-white/80 ml-2">Subcategories</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subcategories Section */}
      {category.subcategories && category.subcategories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
                Subcategories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our product range by subcategory
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {category.subcategories.map((subcategory, index) => (
                <motion.div
                  key={subcategory.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/products?category=${category.slug}&subcategory=${subcategory.slug}`}
                    className="block bg-white rounded-xl p-4 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <h3 className="font-semibold text-primary-dark">{subcategory.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {subcategory.products.length} items
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our premium {category.name.toLowerCase()} available for export
            </p>
          </motion.div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/products/${product.slug}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                      {/* Product Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {product.isBestSelling && (
                          <div className="absolute top-3 right-3 bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
                            Best Seller
                          </div>
                        )}
                        {product.isSeasonal && (
                          <div className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                            In Season
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="font-heading text-lg font-semibold text-primary-dark mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {product.shortDescription}
                        </p>

                        {/* View Details Button */}
                        <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors">
                          <span>View Details</span>
                          <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available in this category yet.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center text-primary font-medium mt-4 hover:text-accent transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-main text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Interested in {category.name}?
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Contact our sales team for detailed information, quotes, and customized export solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-accent text-primary-dark font-semibold px-8 py-3 rounded-lg hover:bg-white transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                className="bg-white/10 text-white font-semibold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}