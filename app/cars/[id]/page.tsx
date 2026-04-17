"use client";

import { siteConfig } from "@/template/config";
import { formatPrice } from "@/lib/utils";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Fuel,
  Gauge,
  Users,
  Zap,
  Shield,
  Droplet,
  Heart,
  Search,
  Settings,
  Info,
  Layers,
  ShoppingBag,
  Calendar,
  Box,
  Truck,
  CreditCard,
  User,
  Activity,
  Award,
  ShoppingCart
} from "lucide-react";

// Icon mapping for dynamic specs
const IconMap: Record<string, any> = {
  Fuel, Gauge, Users, Heart, Search, Shield, Zap, Droplet,
  Settings, Info, Layers, ShoppingBag, Calendar, Box, Truck,
  CreditCard, User, Activity, Award
};
import Image from "next/image";
import Link from "next/link";

import { carsDatabase } from "@/template/catalog";

export default function CarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Attempt to load from static catalog first
  const staticCar = carsDatabase[id as keyof typeof carsDatabase];

  const [car, setCar] = useState<any>(staticCar || carsDatabase["1"]);
  const [loadingCar, setLoadingCar] = useState(!staticCar);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!staticCar) {
      // Fetch dynamic car from API if not found in static catalog
      fetch(`/api/cars`)
        .then(res => res.json())
        .then(data => {
          if (data.cars) {
            const found = data.cars.find((c: any) => String(c._id || c.id) === id);
            if (found) setCar(found);
          }
        })
        .finally(() => setLoadingCar(false));
    }
  }, [id, staticCar]);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-primary/80 font-semibold mb-6 inline-block transition-colors"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Image */}
              <Card className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border-border overflow-hidden relative">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className={`object-cover ${car.name === "Jaguar XE" ? "scale-x-[-1]" : ""}`}
                  priority
                />
              </Card>

              {/* Title and Category */}
              <div className="space-y-2">
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-semibold text-primary">
                  {car.category}
                </div>
                <h1 className="text-4xl font-bold text-foreground">
                  {car.name}
                </h1>
                {car.model && (
                  <p className="text-lg text-muted-foreground">
                    Model {car.model}
                  </p>
                )}
              </div>

              {/* Quick Specs - Dynamic from metadataSchema */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {siteConfig.metadataSchema.map((spec) => {
                  const Icon = IconMap[spec.icon] || Info;
                  return (
                    <Card key={spec.key} className="p-4 bg-card border-border text-center">
                      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{spec.label}</p>
                      <p className="font-bold text-foreground">
                        {car[spec.key] || "N/A"}
                      </p>
                    </Card>
                  );
                })}
              </div>

              {/* Performance Specs */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Performance
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Engine</p>
                    <p className="font-semibold text-foreground">
                      {car.engine || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Power</p>
                    <p className="font-semibold text-foreground">{car.power || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Torque</p>
                    <p className="font-semibold text-foreground">
                      {car.torque || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      0-100 km/h
                    </p>
                    <p className="font-semibold text-foreground">
                      {car.acceleration || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Top Speed
                    </p>
                    <p className="font-semibold text-foreground">
                      {car.topSpeed || "N/A"}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Features */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Key Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {car.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Policies */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  {siteConfig.taxonomy.itemLabelSingular} Policies
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Insurance</p>
                      <p className="text-sm text-muted-foreground">
                        {car.insurance || "Standard Coverage"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Cancellation
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {car.cancellation || "Free within 24h"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Sidebar — Pricing & Upgrade CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="p-6 bg-gradient-to-b from-card to-card border-border space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">Pricing</h3>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-2 bg-background/50 rounded-full hover:bg-secondary transition-colors"
                    >
                      <Heart
                        className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Starting at</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {formatPrice(car.price)}
                      </span>
                      <span className="text-sm text-muted-foreground">{siteConfig.taxonomy.priceSuffix}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✓ {siteConfig.booking.freeCancellation}</p>
                    <p>✓ {siteConfig.booking.support}</p>
                    <p>✓ {siteConfig.booking.insurance}</p>
                  </div>

                  {/* Action CTA */}
                  {siteConfig.template.mode === "shopping" ? (
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg gap-2"
                    >
                      <Link href="/cart">
                        <ShoppingCart className="w-5 h-5" />
                        {siteConfig.taxonomy.addToCartLabel}
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg"
                    >
                      <Link href={`mailto:${siteConfig.brand.email}?subject=Inquiry about ${car.name}`}>
                        Contact for Booking
                      </Link>
                    </Button>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    Call us at {siteConfig.brand.phone}
                  </p>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
