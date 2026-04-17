"use client";

import { Navigation } from "@/components/navigation";
import { siteConfig } from "@/template/config";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-foreground">Your {siteConfig.taxonomy.cartLabel}</h1>
          
          <div className="p-12 border-2 border-dashed border-border rounded-xl bg-card flex flex-col items-center justify-center space-y-4">
            <ShoppingCart className="w-16 h-16 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Add some {siteConfig.taxonomy.itemLabelPlural.toLowerCase()} to your cart to get started.
            </p>
            <Button asChild className="mt-4 bg-primary hover:bg-primary/90">
              <Link href="/cars">Browse Catalog</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
