"use client";

import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Fuel, 
  Gauge, 
  Users, 
  Heart, 
  Search, 
  Shield, 
  Zap, 
  Droplet,
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
  Award
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { siteConfig } from "@/template/config";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, CheckCircle, Plus, Minus } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/lib/context/cart-context";

// Icon mapping for dynamic specs
const IconMap: Record<string, any> = {
  Fuel, Gauge, Users, Heart, Search, Shield, Zap, Droplet, 
  Settings, Info, Layers, ShoppingBag, Calendar, Box, Truck, 
  CreditCard, User, Activity, Award
};

import { cars, carsDatabase } from "@/template/catalog";

export function CarsShowcase() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const { addItem, isInCart, getQuantity, updateQuantity } = useCart();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [cityHash, setCityHash] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [carsList, setCarsList] = useState<any[]>([]);
  const quantityCfg = siteConfig.template.quantity;
  const [selectedQty, setSelectedQty] = useState<number>(quantityCfg.default);
  const isShoppingMode = siteConfig.template.mode === "shopping";

  const handleAddToCart = (car: any) => {
    addItem({
      id: String(car._id || car.id),
      name: car.name,
      image: car.image || "",
      price: car.price || car.pricePerHour || 0,
      priceDisplay: formatPrice(car.price || car.pricePerHour || 0),
      priceSuffix: siteConfig.taxonomy.priceSuffix,
      category: car.category,
    });
    toast({
      title: isInCart(String(car._id || car.id)) ? "Quantity Updated" : "Added to Cart",
      description: `${car.name} is in your cart.`,
    });
  };

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/cars");
        if (!response.ok) throw new Error("Failed to fetch cars");
        const data = await response.json();
        setCarsList(data.cars || []);
      } catch (error) {
        console.error("Failed to load cars:", error);
        // Fallback to static data if API fails (useful for dev)
        setCarsList(cars);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Price range
  const allPrices = useMemo(() => {
    const source = carsList.length > 0 ? carsList : cars;
    return source.map((c) => c.pricePerHour);
  }, [carsList]);

  const minPrice = useMemo(() => (allPrices.length > 0 ? Math.min(...allPrices) : 0), [allPrices]);
  const maxPrice = useMemo(() => (allPrices.length > 0 ? Math.max(...allPrices) : 10000), [allPrices]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Update price range when data loads
  useEffect(() => {
    if (allPrices.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [allPrices, minPrice, maxPrice]);

  // Read user's city on mount and compute a numeric hash for seeding
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateHash = () => {
        try {
          setIsLoading(true);
          const stored = localStorage.getItem("user");
          if (stored) {
            const usr = JSON.parse(stored);
            const city = (usr.city || "").toLowerCase();
            if (city) {
              let hash = 0;
              for (let i = 0; i < city.length; i++) {
                hash = ((hash << 5) - hash + city.charCodeAt(i)) | 0;
              }
              setCityHash(Math.abs(hash));
              setTimeout(() => setIsLoading(false), 800);
              return;
            }
          }
          setCityHash(0);
          setTimeout(() => setIsLoading(false), 800);
        } catch {
          setCityHash(0);
          setIsLoading(false);
        }
      };

      updateHash();
      window.addEventListener("storage", updateHash);
      return () => window.removeEventListener("storage", updateHash);
    }
  }, []);

  // Handle Incremental Navigation (URL ?car=id sync)
  // 12-hour time cycle for periodic rotation
  const getCycle = () => Math.floor(Date.now() / (12 * 60 * 60 * 1000));

  const getHash = (id: string | number) => {
    if (typeof id === "number") return id;
    let hash = 0;
    const s = String(id);
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash + s.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
  };

  const isShadedOut = (carId: string | number) => {
    const cycle = getCycle();
    const hash = getHash(carId);
    return (hash * 13 + cycle * 7 + cityHash) % 7 === 0;
  };

  const getAvailability = (carId: string | number) => {
    const cycle = getCycle();
    const hash = getHash(carId);
    const states = ["Available", "Available", "Booked", "Maintenance"];
    return states[(hash * 3 + cycle + cityHash) % states.length];
  };

  const toggleFavorite = (e: React.MouseEvent, carId: string | number) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev: any) =>
      prev.includes(carId)
        ? prev.filter((id: any) => id !== carId)
        : [...prev, carId],
    );
  };

  const { carsPage } = siteConfig;

  const filteredCars = useMemo(() => {
    const source = carsList.length > 0 ? carsList : cars;
    return source.filter((car) => {
      const matchesCategory =
        selectedCategory === "all" || car.category === selectedCategory;
      const matchesSearch =
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        car.pricePerHour >= priceRange[0] && car.pricePerHour <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [selectedCategory, searchQuery, priceRange, carsList]); // Added carsList to dependencies

  // ── Booking handler removed — users go to /cars/[id] for booking ──

  // ── Card animation variants ──
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <section id="cars" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {siteConfig.taxonomy.catalogHeading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {siteConfig.taxonomy.catalogSubheading}
          </p>
        </div>


          <div className="flex flex-col gap-6 mb-12">
            {/* Category + Search Row */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center">
                {carsPage.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground shadow-lg scale-105"
                        : "bg-secondary text-foreground hover:bg-muted"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={carsPage.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col sm:flex-row items-center gap-4 px-2">
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                Price Range:
              </span>
              <div className="flex-1 w-full sm:max-w-md">
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  step={10}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="w-full"
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}{siteConfig.taxonomy.priceSuffix}
              </span>
            </div>
          </div>



        {/* ── Cars Grid ── */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Card
                      key={`skeleton-${i}`}
                      className="overflow-hidden bg-card border-border p-0 space-y-4"
                    >
                      <Skeleton className="h-48 w-full" />
                      <div className="p-5 space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </Card>
                  ))
                : filteredCars.length > 0
                  ? filteredCars.map((car) => {
                      const carId = String(car._id || car.id);
                      const availability = getAvailability(carId);
                      const shaded =
                        isShadedOut(carId) || availability !== "Available";
                      const hasDetail = true;

                      return (
                        <motion.div
                          key={carId}
                          layout
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 35,
                            mass: 0.8,
                          }}
                        >
                          <Card
                            className={`group overflow-hidden hover:shadow-lg transition-all duration-100 ease-out hover:-translate-y-1 bg-card border-border relative h-full ${shaded ? "grayscale opacity-60" : ""}`}
                          >
                            {/* Availability Badge */}
                            <div
                              className={`absolute top-4 left-4 z-20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${
                                availability === "Available"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : availability === "Booked"
                                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                              }`}
                            >
                              {siteConfig.template.showAvailability ? availability : siteConfig.taxonomy.itemLabelSingular}
                            </div>

                            {/* Product Image */}
                            <div className="relative h-48 bg-muted overflow-hidden group">
                              {car.image ? (
                                <img
                                  src={car.image}
                                  alt={car.name}
                                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <Skeleton
                                  className="absolute inset-0 w-full h-full"
                                  style={{ animationDuration: "8s" }}
                                />
                              )}
                              {shaded && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                                  <span className="text-white font-black text-xs uppercase tracking-tighter border-2 border-white/50 px-3 py-1 rotate-12">
                                    {availability === "Available"
                                      ? siteConfig.taxonomy.reservationRequiredLabel
                                      : availability}
                                  </span>
                                </div>
                              )}
                              <button
                                onClick={(e) => toggleFavorite(e, car.id)}
                                className="absolute top-4 right-4 p-2.5 bg-background/80 backdrop-blur-md rounded-full text-muted-foreground hover:text-red-500 hover:bg-background transition-all duration-100 ease-out hover:scale-110 z-10"
                              >
                                <Heart
                                  className={`w-5 h-5 transition-colors ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : ""}`}
                                />
                              </button>
                            </div>

                            {/* Car Info */}
                            <div className="p-5 space-y-4">
                              <div>
                                <h3 className="font-bold text-lg text-foreground">
                                  {car.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {car.category}
                                </p>
                              </div>

                              {/* Specs - Dynamic from metadataSchema */}
                              <div className="space-y-2">
                                {siteConfig.metadataSchema.slice(0, 3).map((spec) => {
                                  const Icon = IconMap[spec.icon] || Info;
                                  return (
                                    <div key={spec.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Icon className="w-4 h-4 text-primary" />
                                      <span>{car[spec.key] || "N/A"}</span>
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Price */}
                              <div className="pt-2 border-t border-border">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-primary">
                                    {formatPrice(car.price)}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {siteConfig.taxonomy.priceSuffix}
                                  </span>
                                </div>
                              </div>

                              {/* CTA */}
                              <div className="flex flex-col gap-2">
                                {!shaded ? (
                                  isInCart(carId) ? (
                                    <div className="flex items-center justify-between bg-green-50/50 border border-green-200 dark:bg-green-950/30 dark:border-green-900 rounded-md p-1 h-10">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50"
                                        onClick={() => updateQuantity(carId, getQuantity(carId) - 1)}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                      <span className="font-semibold text-green-800 dark:text-green-400 w-8 text-center">
                                        {getQuantity(carId)}
                                      </span>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50"
                                        onClick={() => updateQuantity(carId, getQuantity(carId) + 1)}
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button
                                      onClick={() => handleAddToCart(car)}
                                      className="w-full transition-all duration-100 ease-out bg-primary hover:bg-primary/90 text-primary-foreground h-10"
                                    >
                                      <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Add to Cart</span>
                                    </Button>
                                  )
                                ) : (
                                  <Button disabled className="w-full h-10 bg-muted text-muted-foreground cursor-not-allowed">Unavailable</Button>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })
                  : null}
            </AnimatePresence>

          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border">
            {carsPage.stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
