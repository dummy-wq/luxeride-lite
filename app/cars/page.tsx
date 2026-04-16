import { Navigation } from "@/components/navigation";
import { CarsShowcase } from "@/components/cars-showcase";
import { Contact } from "@/components/contact";
import { siteConfig } from "@/template/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${siteConfig.carsPage.heading} | ${siteConfig.brand.name}`,
  description: siteConfig.carsPage.subheading,
  openGraph: {
    title: `${siteConfig.carsPage.heading} | ${siteConfig.brand.name}`,
    description: siteConfig.carsPage.subheading,
    type: "website",
  },
};

export default function CarsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-20">
        <CarsShowcase />
      </div>
      <Contact />
    </main>
  );
}
