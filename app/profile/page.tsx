import { Navigation } from "@/components/navigation";
import { ProfileContent } from "@/components/profile-content";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProfileContent />
    </main>
  );
}
