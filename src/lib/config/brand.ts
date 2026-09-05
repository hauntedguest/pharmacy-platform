/**
 * Centralized Brand Configuration
 * Single source of truth for branding, typography, colors, and contact info
 */

export const brandConfig = {
  // Company Identity
  company: {
    name: "MediCare Plus",
    tagline: "Your Health, Our Priority",
    description: "Premium pharmaceutical solutions delivered with care and precision",
    logo: "/logo.svg",
    favicon: "/favicon.ico",
  },

  // Contact Information
  contact: {
    phone: "+1 (555) 123-4567",
    email: "support@medicareplus.com",
    address: {
      street: "123 Healthcare Avenue",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      country: "United States",
    },
    hours: "Mon-Fri: 8am-8pm, Sat-Sun: 9am-6pm",
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/medicareplus",
    twitter: "https://twitter.com/medicareplus",
    instagram: "https://instagram.com/medicareplus",
    linkedin: "https://linkedin.com/company/medicareplus",
  },

  // Brand Colors (Tailwind CSS compatible)
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6", // Main brand color
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    accent: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6", // Accent color
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "sans-serif"],
      display: ["Poppins", "Inter", "sans-serif"],
      mono: ["Fira Code", "monospace"],
    },
    fontSize: {
      hero: "clamp(2.5rem, 5vw, 4rem)",
      h1: "clamp(2rem, 4vw, 3rem)",
      h2: "clamp(1.5rem, 3vw, 2rem)",
      h3: "clamp(1.25rem, 2.5vw, 1.5rem)",
      body: "1rem",
      small: "0.875rem",
    },
  },

  // Layout Constants
  layout: {
    maxWidth: "1280px",
    navHeight: "80px",
    footerHeight: "auto",
    sidebarWidth: "280px",
  },

  // Feature Flags
  features: {
    prescriptionUpload: true,
    liveChat: false, // Phase 3
    loyaltyProgram: false, // Phase 3
    subscriptions: false, // Phase 3
  },

  // Legal
  legal: {
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    pharmacyLicense: "PHM-CA-123456",
  },

  // SEO Defaults
  seo: {
    defaultTitle: "MediCare Plus - Premium Pharmaceutical Solutions",
    titleTemplate: "%s | MediCare Plus",
    defaultDescription:
      "Your trusted partner for quality medications, health supplements, and pharmaceutical care. Fast delivery, expert advice, prescription management.",
    keywords: [
      "pharmacy",
      "medications",
      "prescriptions",
      "health supplements",
      "medical supplies",
      "online pharmacy",
    ],
  },
} as const;

export type BrandConfig = typeof brandConfig;
