import { View } from "react-native";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ServicesGrid } from "@/components/marketing/ServicesGrid";
import { DietitianCarousel } from "@/components/marketing/DietitianCarousel";
import { AppFeatureSection } from "@/components/marketing/AppFeatureSection";
import { InsuranceChecker } from "@/components/marketing/InsuranceChecker";
import { TestimonialsRow } from "@/components/marketing/TestimonialsRow";
import { BlogPreview } from "@/components/marketing/BlogPreview";
import { CTABand } from "@/components/marketing/CTABand";

export default function MarketingHomepage() {
  return (
    <View>
      <HeroSection />
      <ServicesGrid />
      <DietitianCarousel />
      <AppFeatureSection />
      <InsuranceChecker />
      <TestimonialsRow />
      <BlogPreview />
      <CTABand />
    </View>
  );
}
