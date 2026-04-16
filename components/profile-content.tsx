"use client";

import { useState, useEffect } from "react";
import { Zap, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Sub-components
import { ProfileSidebar } from "./profile/profile-sidebar";
import { PersonalInfo } from "./profile/personal-info";
import { PaymentHistory } from "./profile/payment-history";

import { Booking, Payment, UserProfile } from "@/lib/types";
import { siteConfig } from "@/template/config";

export function ProfileContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUser, logout, isLoading: authLoading } = useAuth();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserActivity();
    }
  }, [user]);

  const fetchUserActivity = async () => {
    try {
      setIsDataLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) return;

      const [paymentsRes, bookingsRes] = await Promise.all([
        fetch("/api/payments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/bookings", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }

      if (bookingsRes.ok) {
        const data = await bookingsRes.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Error fetching activity:", err);
      setError("Failed to load your history. Connection might be unstable.");
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSaveProfile = async (updates: Partial<UserProfile>) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("auth_token");

      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const data = await response.json();
        updateUser(data.user);
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved successfully.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
    } catch (err: unknown) {
      toast({
        title: "Update Failed",
        description: err instanceof Error ? err.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (user && isDataLoading)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Retrieving your luxury profile...
        </p>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="p-8 text-center max-w-md shadow-2xl border-primary/10">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold mb-2">Session Expired</h2>
          <p className="text-muted-foreground mb-6">
            Your secure session has ended. Please log in again to access your {siteConfig.brand.name} dashboard.
          </p>
          <Button 
            className="w-full bg-primary hover:bg-primary/90" 
            onClick={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-card/50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">MY PROFILE</h1>
            <p className="text-muted-foreground mt-2 font-medium">
              Manage your fleet rentals and personal credentials
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {user && (
            <ProfileSidebar 
              user={user} 
              payments={payments} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              onLogout={logout}
            />
          )}

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "overview" && user && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PersonalInfo user={user} isSaving={isSaving} onSave={handleSaveProfile} />
              </div>
            )}

            {activeTab === "payments" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PaymentHistory payments={payments} />
              </div>
            )}

            {activeTab === "settings" && (
              <Card className="p-12 text-center bg-card border-dashed border-2 border-border animate-in zoom-in-95 duration-300">
                <Loader2 className="w-8 h-8 text-primary/40 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Preferences Syncing...</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  We are optimizing your cloud settings for the new Atlas infrastructure. Check back in a few moments.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
