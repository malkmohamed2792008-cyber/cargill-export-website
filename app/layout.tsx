import type { Metadata } from "next"
import { Fraunces, Cairo, IBM_Plex_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WhatsAppButton from "@/components/ui/WhatsAppButton"
import ScrollToTop from "@/components/ui/ScrollToTop"
import { seoData } from "@/lib/data"

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
})

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "CARGILL | Egyptian Export & Import Company",
    template: "%s | CARGILL",
  },
  description: seoData.home.description,
  keywords: seoData.home.keywords,
  authors: [{ name: "CARGILL" }],
  creator: "CARGILL",
  publisher: "CARGILL",
  metadataBase: new URL("https://cargill-eg.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CARGILL | Egyptian Export & Import Company",
    description: seoData.home.description,
    url: "https://cargill-eg.com",
    siteName: "CARGILL",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "CARGILL export company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CARGILL | Egyptian Export & Import Company",
    description: seoData.home.description,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${cairo.variable} ${ibmPlexMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body className="min-h-screen flex flex-col bg-paper-husk text-ink">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  )
}
