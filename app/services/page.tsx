import { Metadata } from "next"
import { seoData, services } from "@/lib/data"
import ServicesList from "@/components/services/ServicesList"

export const metadata: Metadata = {
  title: seoData.services.title,
  description: seoData.services.description,
  keywords: seoData.services.keywords,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: seoData.services.title,
    description: seoData.services.description,
    url: "/services",
    siteName: "CARGILL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.services.title,
    description: seoData.services.description,
  },
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/85 to-primary/60" />
        </div>

        <div className="container-main relative z-10 pt-32 pb-20">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Comprehensive trading solutions for fresh produce and frozen foods, connecting Egyptian excellence with global markets.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <ServicesList services={services} />

      {/* CTA Section */}
      <section className="section bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container-main relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Contact us to discuss your specific requirements. We tailor our services to meet your unique needs.
            </p>
            <a
              href="/contact"
              className="btn btn-accent inline-block"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
