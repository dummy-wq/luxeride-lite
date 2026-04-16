/**
 * Site Configuration — LuxeRide Lite
 * ====================================
 * Edit this file to rebrand and customise copy.
 * For full theme customisation, upgrade to LuxeRide Premium.
 */

export const siteConfig = {
  // ── Brand ──────────────────────────────────────────────
  brand: {
    name: "LuxeRide",
    customLogo: null,
    logoLetter: "L",
    tagline: "Premium Car Rentals in India",
    description: "Experience luxury car rentals with premium vehicles across India",
    phone: "+91 800-LUXERIDE",
    email: "support@luxeride.in",
    foundedYear: 2020,
  },

  // ── UI Settings ────────────────────────────────────────
  ui: {
    currencySymbol: "₹",
    walletName: "LuxeCash",
  },

  // ── Template (locked to catalog-only in Lite) ──────────
  template: {
    mode: "service" as "service" | "shopping",
    showAvailability: false,
    enableBooking: false,  // Disabled in Lite — catalog browse only
    quantity: {
      min: 1,
      max: 99,
      default: 1,
    },
  },

  // ── Taxonomy & Copy ────────────────────────────────────
  taxonomy: {
    itemLabelSingular: "Car",
    itemLabelPlural: "Cars",
    categoryLabel: "Vehicle Type",
    actionLabel: "View Details",
    addToCartLabel: "Add to Cart",
    priceSuffix: "/hr",
    catalogHeading: "Our Fleet",
    catalogSubheading: "Handpicked premium vehicles for your next journey.",
    reservationRequiredLabel: "Reservation Required",
    ordersLabel: "Bookings",
    cartLabel: "Cart",
  },

  // ── Metadata & Icon Mapping ────────────────────────────
  metadataSchema: [
    { key: "mileage", label: "Mileage", icon: "Fuel" },
    { key: "seats", label: "Seats", icon: "Users" },
    { key: "transmission", label: "Gearbox", icon: "Gauge" },
    { key: "fuel", label: "Fuel", icon: "Droplet" },
  ],

  // ── Navigation ─────────────────────────────────────────
  navigation: {
    links: [
      { href: "/cars", label: "Fleet" },
      { href: "/about", label: "About" },
      { href: "/help-and-support", label: "Help & Support" },
    ],
  },

  // ── Hero Section ───────────────────────────────────────
  hero: {
    badge: "Premium Experience Awaits",
    headingLine1: "ELEVATE",
    headingLine2: "YOUR DRIVE",
    subheading:
      "Curating the world's most exclusive premium experiences. Luxury is no longer a choice, it's a standard.",
    ctaLabel: "Explore Catalog",
    stats: [
      { value: "500+", label: "Items" },
      { value: "24/7", label: "Support" },
      { value: "Premium", label: "Quality" },
    ],
    darkImage: "/hero-dark-premium.jpg",
    lightImage: "/hero-light-premium.png",
  },

  // ── Cars Page (Catalog) ────────────────────────────────
  carsPage: {
    heading: "Our Collection",
    subheading: "Browse through our handpicked selection of premium items.",
    categories: [
      { id: "all", label: "All Items" },
      { id: "SUV", label: "SUV" },
      { id: "Sedan", label: "Sedan" },
      { id: "Electric", label: "Electric" },
    ],
    searchPlaceholder: "Search our collection...",
    noResultsTitle: "Nothing found",
    noResultsSubtitle: "Try adjusting your filters or search keywords",
    stats: [
      { value: "Global", label: "Availability" },
      { value: "Verified", label: "Quality" },
      { value: "24/7", label: "Customer Care" },
    ],
  },

  // ── About Page ─────────────────────────────────────────
  about: {
    badge: "About LuxeRide",
    heading: "Luxury Car Rentals Reimagined",
    intro:
      "Since 2020, LuxeRide has been transforming the luxury car rental experience in India. We believe everyone deserves to experience the thrill of driving a premium vehicle.",
    story: [
      "LuxeRide was founded with a simple vision: to make luxury car rentals accessible, transparent, and hassle-free for everyone.",
      "Today, we operate across 50+ cities in India with a fleet of over 500 premium vehicles.",
      "Our commitment remains unchanged: provide the best luxury rental experience with unmatched customer service.",
    ],
    values: [
      { icon: "Zap", title: "Innovation", description: "Cutting-edge technology for seamless booking and vehicle management" },
      { icon: "Shield", title: "Safety First", description: "Rigorous maintenance and comprehensive insurance coverage" },
      { icon: "Users", title: "Customer Focus", description: "24/7 support and personalized service for every rental" },
      { icon: "Award", title: "Excellence", description: "Premium fleet of luxury vehicles with exceptional quality" },
    ],
    team: [
      { name: "Rajesh Kumar", role: "Founder & CEO", initials: "RK" },
      { name: "Priya Sharma", role: "Chief Operations Officer", initials: "PS" },
      { name: "Arjun Patel", role: "Head of Fleet Management", initials: "AP" },
      { name: "Ananya Gupta", role: "Customer Experience Lead", initials: "AG" },
    ],
    stats: [
      { value: "4+", label: "Years of Excellence" },
      { value: "500+", label: "Premium Vehicles" },
      { value: "10K+", label: "Happy Customers" },
      { value: "50+", label: "Cities Served" },
    ],
    ctaHeading: "Ready to Experience Luxury?",
    ctaSubheading: "Start your next adventure with LuxeRide today",
    ctaPrimary: "Browse Our Fleet",
    ctaSecondary: "Join Us Today",
  },

  // ── Help & Support Page ────────────────────────────────
  helpAndSupport: {
    heading: "Help & Support",
    subheading: "Everything you need to know about renting with LuxeRide.",
    policiesHeading: "Policies & Information",
    policiesSubheading: "Clear, transparent guidelines for a seamless luxury experience.",
  },

  // ── Contact Widget ─────────────────────────────────────
  contact: {
    heading: "Contact Us",
    successTitle: "Message sent!",
    successDescription: "Expect an email back within 24 hours.",
    sendLabel: "Send Message",
  },

  // ── Booking Info ───────────────────────────────────────
  booking: {
    freeCancellation: "Free Cancellation up to 24 hours",
    support: "24/7 Customer Support",
    insurance: "Comprehensive Insurance",
  },
} as const;

export type SiteConfig = typeof siteConfig;
