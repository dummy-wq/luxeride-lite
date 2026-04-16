import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { CarsShowcase } from "@/components/cars-showcase";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <CarsShowcase />
      <Contact />
    </main>
  );
}
