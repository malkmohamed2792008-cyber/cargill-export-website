"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import type { ProductCategory } from "@/lib/products"
import { FiArrowRight } from "react-icons/fi"

interface ProductsCategoriesProps {
  categories: ProductCategory[]
}

export default function ProductsCategories({ categories }: ProductsCategoriesProps) {
  return (
    <section id="categories" className="py-20 bg-gray-50">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Product Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of premium Egyptian agricultural products, carefully sourced and quality-controlled for international export.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/products/${category.slug}`} className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                    </div>
                  </div>

                  {/* Category Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{category.description}</p>

                    {/* Subcategories */}
                    {category.subcategories && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {category.subcategories.slice(0, 3).map((sub) => (
                          <span
                            key={sub.id}
                            className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full"
                          >
                            {sub.name}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{category.subcategories.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* View Button */}
                    <div className="flex items-center text-primary font-medium group-hover:text-accent transition-colors">
                      <span>View Products</span>
                      <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
