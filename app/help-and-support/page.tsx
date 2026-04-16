"use client";

import { Navigation } from "@/components/navigation";
import { Contact } from "@/components/contact";
import { Card } from "@/components/ui/card";
import { Shield, CreditCard, FileText, AlertTriangle, Car } from "lucide-react";
import { siteConfig } from "@/template/config";

export default function HelpAndSupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {siteConfig.helpAndSupport.heading}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {siteConfig.helpAndSupport.subheading}
          </p>
        </div>

        {/* Policies Section */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {siteConfig.helpAndSupport.policiesHeading}
            </h2>
            <p className="text-muted-foreground mt-2">
              {siteConfig.helpAndSupport.policiesSubheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 bg-card border-border space-y-4">
              <Shield className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Insurance & Cover</h3>
              <p className="text-muted-foreground">
                All {siteConfig.brand.name} vehicles come with comprehensive insurance
                standard. This covers third-party damage, collision, and theft.
                However, a deductible applies in case of an accident where you
                are at fault.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border space-y-4">
              <CreditCard className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Payments & Deposits</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards and UPI. A pre-authorization
                security deposit (varying by vehicle class) is required at the
                time of pick-up and is fully refunded within 5-7 business days
                post drop-off.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border space-y-4">
              <AlertTriangle className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Risk & Damages</h3>
              <p className="text-muted-foreground">
                Renters are liable for damages not covered by insurance, such as
                interior damage, undercarriage damage, or tire blowouts due to
                negligence. Please review the vehicle thoroughly before driving
                off.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border space-y-4">
              <FileText className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Cancellation Policy</h3>
              <p className="text-muted-foreground">
                Free cancellation up to 24 hours before your booking start time.
                Cancellations made within 24 hours will incur a 1-day rental
                charge penalty. No-shows will be charged the full booking
                amount.
              </p>
            </Card>

            <Card className="p-6 bg-card border-border space-y-4">
              <Car className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">Rental Process</h3>
              <p className="text-muted-foreground">
                1. Browse & Book
                <br />
                2. Upload KYC Docs
                <br />
                3. Instant Verification
                <br />
                4. Pick up your luxury car or opt for home delivery.
                <br />
                5. Enjoy the ride and drop it off when done!
              </p>
            </Card>
          </div>
        </div>

        {/* Contact Us Widget */}
        <Contact />
      </div>
    </main>
  );
}
