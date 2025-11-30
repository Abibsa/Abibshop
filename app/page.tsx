import HeroSection from "@/components/home/HeroSection"
import PromoSection from "@/components/home/PromoSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import ProductsSection from "@/components/home/ProductsSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import CTASection from "@/components/home/CTASection"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <PromoSection />
      <FeaturesSection />
      <ProductsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
