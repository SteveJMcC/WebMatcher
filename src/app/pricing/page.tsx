import { PricingPlans } from "@/components/features/pricing-plans";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - WebMatcher",
  description: "Explore token plans for designers to apply for jobs and enhance their visibility on WebMatcher.",
};

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PricingPlans />
    </div>
  );
}

