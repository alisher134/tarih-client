import { Container } from "@/shared/ui/container";

import { AnimatedSection } from "./animated-section";
import { CtaSection } from "./cta-section";
import { FaqSection } from "./faq-section";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { PricingSection } from "./pricing-section";

export function Home() {
  return (
    <Container className="py-8 md:py-12">
      <div className="space-y-24 md:space-y-32">
        <AnimatedSection>
          <HeroSection />
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          <PricingSection />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <HowItWorksSection />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <CtaSection />
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <FaqSection />
        </AnimatedSection>
      </div>
    </Container>
  );
}
