"use client";

import { User as UserIcon, Wallet, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserProfile, Payment } from "@/lib/types";
import { siteConfig } from "@/template/config";
import { formatPrice } from "@/lib/utils";

interface ProfileSidebarProps {
  user: UserProfile;
  payments: Payment[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export function ProfileSidebar({ user, payments, activeTab, setActiveTab, onLogout }: ProfileSidebarProps) {
  const totalSpent = payments
    .filter(p => p.status !== "refunded" && p.status !== "refunded_to_wallet" && p.status !== "failed")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <Card className="p-6 bg-card border-border space-y-6">
      {/* Profile Picture */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <UserIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">{user.fullName}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      {/* Member Stats */}
      <div className="space-y-3 pt-4 border-t border-border">
        <div>
          <p className="text-sm text-muted-foreground">Total Rentals</p>
          <p className="text-2xl font-bold text-primary">{payments.length}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Spent</p>
          <p className="text-2xl font-bold text-primary">{formatPrice(totalSpent)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Member Since</p>
          <p className="text-sm font-semibold text-foreground">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }) : "N/A"}
          </p>
        </div>
      </div>

      {/* {siteConfig.ui.walletName} Wallet */}
      <div className="pt-4 border-t border-border">
        <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-primary">{siteConfig.ui.walletName} Balance</h3>
          </div>
          <p className="text-3xl font-black text-foreground">
            {formatPrice((user.walletBalance || 0))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Available for instant booking use</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-2 pt-4 border-t border-border">
        {[
          { id: "overview", label: "Overview" },
          { id: "payments", label: "Payment History" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-primary/20 text-primary font-semibold"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Sign Out */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-destructive font-bold hover:bg-destructive/10 transition-colors border border-destructive/20"
        >
          <LogOut className="w-5 h-5" />
          SIGN OUT
        </button>
      </div>
    </Card>
  );
}
