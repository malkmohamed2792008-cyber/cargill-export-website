"use client"

import { motion } from "framer-motion"

// Client logos data - using placeholder company names
const clientLogos = [
  { name: "EuroFresh", country: "Germany" },
  { name: "Gulf Foods", country: "UAE" },
  { name: "Asia Trade", country: "China" },
  { name: "Mediterranean Co", country: "Italy" },
  { name: "Atlantic Imports", country: "UK" },
  { name: "Nordic Foods", country: "Sweden" },
  { name: "African Trade", country: "South Africa" },
  { name: "Baltic Exports", country: "Russia" },
]

export default function CustomerLogos() {
  return (
    <section className="py-20 bg-gray-50">
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
            Trusted by Businesses Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We proudly serve clients across continents, delivering premium Egyptian products to businesses that demand excellence.
          </p>
        </motion.div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {clientLogos.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex items-center justify-center"
            >
              <div className="relative w-32 h-16 md:w-40 md:h-20 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center p-4 border border-gray-100 group-hover:border-accent/30">
                {/* Logo Placeholder - Using company initial as placeholder */}
                <div className="text-center">
                  <span className="text-2xl md:text-3xl font-bold text-gray-300 group-hover:text-accent transition-colors duration-300">
                    {client.name.charAt(0)}
                  </span>
                  <p className="text-xs text-gray-400 mt-1 hidden md:block">
                    {client.name.slice(1, 6)}
                  </p>
                </div>

                {/* Company Name Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  <span className="text-xs font-medium text-primary-dark bg-white px-2 py-1 rounded shadow">
                    {client.name}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: "50+", label: "Countries Served" },
            { value: "500+", label: "Business Clients" },
            { value: "10K+", label: "Successful Shipments" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}