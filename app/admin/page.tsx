import { Navigation } from "@/components/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";
import { siteConfig } from "@/template/config";

export const metadata = {
    title: `Admin Dashboard | ${siteConfig.brand.name}`,
    description: `Manage users and bookings for ${siteConfig.brand.name}`,
};

export default function AdminPage() {
    return (
        <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-primary-foreground">
            <Navigation />
            <AdminDashboard />
        </main>
    );
}
