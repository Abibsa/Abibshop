import HeroSection from "@/components/home/HeroSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import GiftPromoSection from "@/components/home/GiftPromoSection"
import ProductsSection from "@/components/home/ProductsSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import CTASection from "@/components/home/CTASection"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <GiftPromoSection />
      <ProductsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}
