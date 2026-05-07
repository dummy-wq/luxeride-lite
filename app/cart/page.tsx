"use client";

import { useCart } from "@/lib/context/cart-context";
import { useAuth } from "@/lib/context/auth-context";
import { siteConfig } from "@/template/config";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Shield,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, totalItems, totalCost, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "processing" | "success">("idle");

  useEffect(() => {
    setMounted(true);
  }, []);

  // SSR safety
  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </main>
    );
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push("/login?redirect=/cart");
      return;
    }
    setCheckoutStatus("processing");
    await new Promise((r) => setTimeout(r, 1800));
    setCheckoutStatus("success");
  };

  if (checkoutStatus === "success") {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-32 pb-16 px-4 max-w-3xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <CheckCircle2 className="w-24 h-24 text-primary relative animate-in zoom-in duration-500" />
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tight">ORDER PLACED!</h1>
            <p className="text-xl text-muted-foreground font-medium">
              Thank you for your purchase. Your items are being prepared.
            </p>
          </div>

          <Card className="p-8 bg-card border-primary/20 border-2 relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Customer</p>
                <p className="font-bold">{user?.fullName ?? "Guest"}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Items</p>
                <p className="font-bold">{totalItems}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Total Paid</p>
                <p className="text-2xl font-black text-primary">{formatPrice(Math.round(totalCost * 1.18))}</p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="rounded-full font-bold px-10 h-14"
              onClick={() => { clearCart(); router.push("/cars"); }}
            >
              Back to Shop
            </Button>
            <Button variant="outline" size="lg" className="rounded-full font-bold px-10 h-14" onClick={() => window.print()}>
              Print Receipt
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight uppercase">
              {siteConfig.taxonomy.cartLabel ?? "Your Cart"}
            </h1>
            <p className="text-muted-foreground font-medium mt-1">
              {totalItems === 0
                ? "Your cart is empty"
                : `${totalItems} item${totalItems > 1 ? "s" : ""} · ${formatPrice(totalCost)}`}
            </p>
          </div>
          <Link href="/cars" className="text-primary font-bold hover:underline flex items-center gap-2 shrink-0">
            ← Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-card border border-dashed border-border rounded-2xl">
            <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto" />
            <h3 className="text-2xl font-bold">Nothing here yet</h3>
            <p className="text-muted-foreground">Browse the catalog and add items to get started.</p>
            <Link href="/cars">
              <Button size="lg" className="font-bold px-10 h-14 rounded-full mt-2">
                Explore Catalog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT — Item List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 items-center p-4 bg-card border border-border rounded-2xl group transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Skeleton className="absolute inset-0 w-full h-full" style={{ animationDuration: "8s" }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate text-lg">{item.name}</h4>
                    {item.category && (
                      <p className="text-xs text-muted-foreground uppercase font-black tracking-widest">{item.category}</p>
                    )}
                    <p className="text-primary font-bold mt-1">{formatPrice(item.price)}{item.priceSuffix}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
                >
                  Clear all items
                </button>
              </div>
            </div>

            {/* RIGHT — Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="p-8 bg-card border-border shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />

                  <h2 className="text-2xl font-black text-foreground mb-8">ORDER SUMMARY</h2>

                  {user && (
                    <div className="mb-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Purchasing as</p>
                      <p className="font-bold text-foreground">{user.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="text-foreground">{formatPrice(totalCost)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Delivery</span>
                      <span className="text-green-500 font-black">FREE</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-semibold">
                      <span>Tax (18%)</span>
                      <span className="text-foreground">{formatPrice(Math.round(totalCost * 0.18))}</span>
                    </div>

                    <div className="pt-6 border-t border-border flex justify-between items-baseline">
                      <span className="text-lg font-black text-foreground">TOTAL</span>
                      <span className="text-4xl font-black text-primary">
                        {formatPrice(Math.round(totalCost * 1.18))}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full mt-10 h-16 rounded-2xl font-black text-xl flex items-center justify-center gap-2"
                    onClick={handleCheckout}
                    disabled={checkoutStatus === "processing"}
                  >
                    {checkoutStatus === "processing" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        {user ? "Confirm Order" : "Login to Checkout"}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>

                  <div className="mt-8 pt-6 border-t border-border/50 text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
                        Secure Checkout
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                      By confirming, you agree to our service terms and return policy.
                    </p>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
