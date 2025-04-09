// app/(public)/page.tsx

import { BenefitsSection } from '@/components/pages/marketing/landing/benefits-section'
import { CTASection } from '@/components/pages/marketing/landing/cta-section'
import { FAQSection } from '@/components/pages/marketing/landing/faq-section'
import { FeaturesSection } from '@/components/pages/marketing/landing/feature-section'
import { HeroSection } from '@/components/pages/marketing/landing/hero-section'
import { PricingSection } from '@/components/pages/marketing/landing/pricing-section'

export default function Home() {
  return (
    <section>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </section>
  )
}
