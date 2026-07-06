import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton"
import ScrollToTop from "@/components/ui/ScrollToTop"
import { seoData } from "@/lib/data"

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: seoData.home.title,
  description: seoData.home.description,
  keywords: seoData.home.keywords,
  authors: [{ name: "CARGILL" }],
  creator: "CARGILL",
  publisher: "CARGILL",
  metadataBase: new URL("https://cargill-eg.com"),
  openGraph: {
    title: seoData.home.title,
    description: seoData.home.description,
    url: "https://cargill-eg.com",
    siteName: "CARGILL",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.home.title,
    description: seoData.home.description,
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
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollToTop />
      </body>
    </html>
  )
}