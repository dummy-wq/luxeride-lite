"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/template/config";

export function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: siteConfig.contact.successTitle,
      description: siteConfig.contact.successDescription,
    });
    setIsOpen(false);
  };

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isScrolled && !isOpen ? 'opacity-95' : 'opacity-100'
      }`}
    >
      {isOpen ? (
        <Card className="w-80 sm:w-96 shadow-2xl border-border bg-card overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              {siteConfig.contact.heading}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-primary-foreground hover:bg-primary/80 h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="text-sm text-foreground flex flex-col gap-2 mb-4 p-3 bg-secondary/50 rounded-lg">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> {siteConfig.brand.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> {siteConfig.brand.email}
              </p>
            </div>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-1">
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Email Address"
                />
              </div>
              <div className="space-y-1">
                <textarea
                  required
                  rows={3}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                {siteConfig.contact.sendLabel}
              </Button>
            </form>
          </div>
        </Card>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
