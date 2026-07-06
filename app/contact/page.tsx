import { Metadata } from "next"
import { seoData, companyInfo, contactFields } from "@/lib/data"
import ContactForm from "@/components/contact/ContactForm"
import ContactInfo from "@/components/contact/ContactInfo"

export const metadata: Metadata = {
  title: seoData.contact.title,
  description: seoData.contact.description,
  keywords: seoData.contact.keywords,
}

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Get in touch with us for inquiries about our products and services. We&apos;re here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section bg-background">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Form */}
            <ContactForm fields={contactFields} />

            {/* Contact Info */}
            <ContactInfo companyInfo={companyInfo} />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] bg-background-alt">
        <div className="w-full h-full flex items-center justify-center bg-primary-dark/5">
          <div className="text-center">
            <p className="text-foreground-secondary mb-2">Cairo, Egypt</p>
            <p className="text-foreground-muted text-sm">Map integration available upon deployment</p>
          </div>
        </div>
      </section>
    </>
  )
}