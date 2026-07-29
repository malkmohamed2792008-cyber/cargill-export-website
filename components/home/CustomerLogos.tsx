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
    <section role="region" aria-label="Trusted customers" className="py-20 bg-background-alt">
      <div className="container-main">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">Trusted by Businesses Worldwide</h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            We proudly serve clients across continents, delivering premium Egyptian products to businesses that demand excellence.
          </p>
        </motion.div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
          {clientLogos.map((client, index) => (
            <motion.article
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group flex items-center justify-center"
              aria-labelledby={`client-${index}-name`}
            >
              <div
                className="relative w-32 h-16 md:w-40 md:h-20 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center p-4 border border-muted"
                tabIndex={0}
                aria-describedby={`client-${index}-country`}
              >
                {/* Logo Placeholder - Using company initial as placeholder */}
                <div className="text-center" aria-hidden>
                  <span className="text-2xl md:text-3xl font-bold text-muted group-hover:text-accent transition-colors duration-300">
                    {client.name.charAt(0)}
                  </span>
                  <p className="text-xs text-muted mt-1 hidden md:block">{client.name.slice(1, 6)}</p>
                </div>

                {/* Screen-reader name */}
                <span id={`client-${index}-name`} className="sr-only">{client.name}</span>

                {/* Company Name Tooltip (visual only) */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none" aria-hidden>
                  <span className="text-xs font-medium text-primary bg-white px-2 py-1 rounded shadow">
                    {client.name}
                  </span>
                </div>
              </div>
            </motion.article>
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
              <p className="text-sm text-foreground-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
