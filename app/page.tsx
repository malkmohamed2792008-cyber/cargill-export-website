import Hero from "@/components/home/Hero"
import AboutPreview from "@/components/home/AboutPreview"
import ServicesOverview from "@/components/home/ServicesOverview"
import WhyChooseUs from "@/components/home/WhyChooseUs"
import Statistics from "@/components/home/Statistics"
import ExportProcess from "@/components/home/ExportProcess"
import IndustriesWeServe from "@/components/home/IndustriesWeServe"
import Testimonials from "@/components/home/Testimonials"
import CTA from "@/components/home/CTA"

export default function Home() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ServicesOverview />
      <WhyChooseUs />
      <Statistics />
      <ExportProcess />
      <IndustriesWeServe />
      <Testimonials />
      <CTA />
    </>
  )
}
