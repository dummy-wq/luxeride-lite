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
  ShoppingCart,
  CheckCircle,
  Package,
} from "lucide-react";

// Icon mapping for dynamic specs
const IconMap: Record<string, any> = {
  Fuel, Gauge, Users, Heart, Search, Shield, Zap, Droplet,
  Settings, Info, Layers, ShoppingBag, Calendar, Box, Truck,
  CreditCard, User, Activity, Award
};
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { carsDatabase } from "@/template/catalog";
import { useCart } from "@/lib/context/cart-context";
import { useToast } from "@/hooks/use-toast";

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

  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();
  const quantityCfg = siteConfig.template.quantity;
  const [selectedQty, setSelectedQty] = useState<number>(quantityCfg.default);
  const { toast } = useToast();
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    if (isInCart(id)) setCartAdded(true);
  }, [id, isInCart]);

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
              {/* Product Image */}
              <Card className="h-96 bg-muted rounded-2xl border-border overflow-hidden relative">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <Skeleton className="absolute inset-0 w-full h-full" style={{ animationDuration: "8s" }} />
                )}
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

              {/* Product Details */}
              <Card className="p-6 bg-card border-border space-y-4">
                <h3 className="text-xl font-bold text-foreground">Product Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  {siteConfig.metadataSchema.map((spec) => {
                    const IconComp = IconMap[spec.icon] || Info;
                    return (
                      <div key={spec.key}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <IconComp className="w-3.5 h-3.5 text-primary" />
                          <p className="text-sm text-muted-foreground">{spec.label}</p>
                        </div>
                        <p className="font-semibold text-foreground">{car[spec.key] || "N/A"}</p>
                      </div>
                    );
                  })}
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
                <h3 className="text-xl font-bold text-foreground">Purchase Assurance</h3>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Warranty</p>
                      <p className="text-sm text-muted-foreground">
                        {car.warranty || "5 Years International Warranty"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <Package className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        {car.shipping || "Free Insured Global Delivery"}
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
                    <p>✓ 5 Years International Warranty</p>
                    <p>✓ Free Insured Global Delivery</p>
                    <p>✓ Certificate of Authenticity Included</p>
                  </div>

                  {/* Action CTA */}
                  {siteConfig.template.mode === "shopping" ? (
                    <div className="space-y-4 pt-4 border-t border-border">
                      {/* Quantity Picker */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-foreground block">
                          Quantity
                        </label>
                        {isInCart(id) ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                const newQty = getQuantity(id) - 1;
                                if (newQty < 1) return;
                                updateQuantity(id, newQty);
                              }}
                              disabled={getQuantity(id) <= quantityCfg.min}
                              className="w-10 h-10 rounded-lg border border-border bg-secondary hover:bg-muted flex items-center justify-center text-lg font-bold disabled:opacity-40 transition-colors"
                            >
                              −
                            </button>
                            <span className="text-xl font-bold text-foreground w-8 text-center">
                              {getQuantity(id)}
                            </span>
                            <button
                              onClick={() => {
                                const newQty = getQuantity(id) + 1;
                                if (newQty > quantityCfg.max) return;
                                updateQuantity(id, newQty);
                              }}
                              disabled={getQuantity(id) >= quantityCfg.max}
                              className="w-10 h-10 rounded-lg border border-border bg-secondary hover:bg-muted flex items-center justify-center text-lg font-bold disabled:opacity-40 transition-colors"
                            >
                               +
                            </button>
                          </div>
                        ) : (
                          <select
                            value={selectedQty}
                            onChange={(e) => setSelectedQty(Number(e.target.value))}
                            className="w-full px-3 py-2.5 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                          >
                            {Array.from(
                              { length: quantityCfg.max - quantityCfg.min + 1 },
                              (_, i) => quantityCfg.min + i
                            ).map((qty) => (
                              <option key={qty} value={qty}>{qty}</option>
                            ))}
                          </select>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="flex justify-between text-sm py-2">
                        <span className="text-muted-foreground">
                          {isInCart(id) ? getQuantity(id) : selectedQty} × {formatPrice(car.price || car.pricePerHour || 0)}
                        </span>
                        <span className="font-semibold text-foreground">
                          {formatPrice((car.price || car.pricePerHour || 0) * (isInCart(id) ? getQuantity(id) : selectedQty))}
                        </span>
                      </div>

                      {isInCart(id) ? (
                        <>
                          <Button
                            onClick={() => router.push("/cart")}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg flex items-center gap-2"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            View Cart
                          </Button>
                          <p className="text-xs text-green-500 text-center bg-green-500/10 p-2 rounded border border-green-500/20 flex items-center justify-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Item is in your cart
                          </p>
                        </>
                      ) : (
                        <Button
                          onClick={() => {
                            addItem({
                              id: String(car.id || car._id),
                              name: car.name,
                              image: car.image,
                              price: car.price || car.pricePerHour || 0,
                              priceDisplay: formatPrice(car.price || car.pricePerHour || 0),
                              priceSuffix: siteConfig.taxonomy.priceSuffix,
                              category: car.category,
                            }, selectedQty);
                            setCartAdded(true);
                            toast({
                              title: "Added to cart!",
                              description: `${selectedQty}× ${car.name} added to your ${siteConfig.taxonomy.cartLabel}.`,
                            });
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 font-semibold text-lg gap-2"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {siteConfig.taxonomy.addToCartLabel}
                        </Button>
                      )}
                    </div>
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
