import { Metadata } from "next"
import { seoData } from "@/lib/data"
import CompanyStory from "@/components/about/CompanyStory"
import VisionMission from "@/components/about/VisionMission"
import CoreValues from "@/components/about/CoreValues"
import Certifications from "@/components/about/Certifications"
import Partners from "@/components/about/Partners"

export const metadata: Metadata = {
  title: seoData.about.title,
  description: seoData.about.description,
  keywords: seoData.about.keywords,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: seoData.about.title,
    description: seoData.about.description,
    url: "/about",
    siteName: "CARGILL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seoData.about.title,
    description: seoData.about.description,
  },
}

export default function AboutPage() {
  return (
    <>
      <CompanyStory />
      <VisionMission />
      <CoreValues />
      <Certifications />
      <Partners />
    </>
  )
}
