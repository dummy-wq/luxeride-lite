import { Navigation } from "@/components/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/template/config";

export default function TermsAndPrivacyPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32">
        <Link
          href="/"
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth text-sm mb-12 w-fit"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Home</span>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8 tracking-tight">Terms and Privacy Policy</h1>
        
        <div className="space-y-12 text-muted-foreground leading-relaxed">
          {/* Terms of Service Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Terms of Service</h2>
            <p className="mb-4">
              Welcome to {siteConfig.brand.name}. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must be at least 21 years old and possess a valid driving license to rent a vehicle.</li>
              <li>All bookings are subject to availability and verification of user identity.</li>
              <li>The rental period begins at the scheduled pickup time and ends at the scheduled dropoff time. Late returns may incur additional charges.</li>
              <li>Users are responsible for any traffic violations, fines, or damage caused to the vehicle during the rental period.</li>
              <li>Fuel charges, tolls, and parking fees are the responsibility of the user unless explicitly stated otherwise.</li>
            </ul>
          </section>

          {/* Privacy Policy Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Privacy Policy</h2>
            <p className="mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Data Collection</h3>
                <p>
                  We collect information you provide directly to us, such as your name, email address, phone number, and driving license details when you create an account or book a car.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">How We Use Your Data</h3>
                <p>
                  We use your information to facilitate bookings, verify your identity, process payments, and improve our services. We do not sell your personal data to third parties.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Data Security</h3>
                <p>
                  We implement industry-standard security measures to protect your data from unauthorized access, loss, or theft. This includes encryption of sensitive information like passwords and payment details.
                </p>
              </div>
            </div>
          </section>

          {/* Cancellation Policy Section */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. Cancellation and Refund Policy</h2>
            <p className="mb-4">
              Cancellations made 24 hours prior to the booking start time are eligible for a full refund. Cancellations made within 24 hours may incur a cancellation fee.
            </p>
          </section>

          <section className="pt-8 border-t border-border">
            <p className="text-sm">
              Last updated: March 14, 2026. For any questions regarding these terms, please contact our support team at support@luxeride.com.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
