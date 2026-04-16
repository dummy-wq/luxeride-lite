import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/template/config";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap,
  Shield,
  Users,
  Award,
};

export default function AboutPage() {
  const { about } = siteConfig;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold text-sm">
              {about.badge}
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            {about.heading}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {about.intro}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground">Our Story</h2>
            <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
              {about.story.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-24 h-24 text-primary opacity-50" />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Our Values</h2>
            <p className="text-lg text-muted-foreground">
              What drives us every single day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.values.map((value, index) => {
              const Icon = iconMap[value.icon] || Zap;
              return (
                <Card
                  key={index}
                  className="p-6 bg-background border-border hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Meet Our Team
            </h2>
            <p className="text-lg text-muted-foreground">
              Passionate professionals dedicated to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {about.team.map((member, index) => (
              <Card
                key={index}
                className="text-center p-6 bg-card border-border hover:shadow-md transition-all duration-150 hover:-translate-y-1"
              >
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary mb-4">
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                <p className="text-muted-foreground text-sm">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {about.stats.map((stat, index) => (
            <div key={index} className="text-center text-primary-foreground">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <p className="text-lg opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              {about.ctaHeading}
            </h2>
            <p className="text-lg text-muted-foreground">
              {about.ctaSubheading}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base">
                {about.ctaPrimary}
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-secondary px-8 py-6 text-base"
              >
                {about.ctaSecondary}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
