/**
 * Centralized Brand Configuration
 * Single source of truth for branding, typography, colors, and contact info
 */

export const brandConfig = {
  // Company Identity
  company: {
    name: "MediCare Plus",
    tagline: "Proprietary Formulations, Delivered Nationwide with Cold-Chain Precision",
    description: "India's premier direct-to-consumer healthcare & wellness brand, formulating and delivering pharmaceutical-grade medicines, supplements, and diagnostic devices directly to your doorstep.",
    logo: "/logo.svg",
    favicon: "/favicon.ico",
    website: "https://medicareplus.in",
  },

  // Localization & Currency
  locale: {
    country: "India",
    countryCode: "IN",
    currency: {
      symbol: "₹",
      code: "INR",
      name: "Indian Rupee",
    },
    serviceablePinCodes: "19,000+",
  },

  // Contact Information
  contact: {
    phone: "+91 1800 209 8888",
    whatsapp: "+91 98765 43210",
    email: "care@medicareplus.in",
    address: {
      street: "Tower B, 8th Floor, BKC Innovation Hub, G Block",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400051",
      country: "India",
    },
    hours: "24x7 Customer & Pharmacist Support",
  },

  // Social Media
  social: {
    facebook: "https://facebook.com/medicareplusindia",
    twitter: "https://twitter.com/medicareplusin",
    instagram: "https://instagram.com/medicareplusindia",
    linkedin: "https://linkedin.com/company/medicareplus-india",
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

  // Legal & Regulatory (India)
  legal: {
    termsUrl: "/terms",
    privacyUrl: "/privacy",
    pharmacyLicense: "DL-MH-MZ1-204912 / DL-MH-MZ1-204913",
    fssaiLicense: "FSSAI Lic. 10022022000542",
    gstNumber: "27AABCM1234F1Z8",
  },

  // SEO Defaults
  seo: {
    defaultTitle: "MediCare Plus - India's Premier Digital Pharmacy",
    titleTemplate: "%s | MediCare Plus India",
    defaultDescription:
      "Buy 100% genuine prescription medicines, vitamins, and healthcare devices online in India. Express 2-hour delivery across Mumbai, Delhi, Bangalore & 19,000+ PIN codes.",
    keywords: [
      "online pharmacy India",
      "buy medicine online",
      "prescription delivery",
      "health supplements India",
      "Schedule H medicines",
      "genuine medicines Mumbai Delhi Bangalore",
    ],
  },
} as const;

export type BrandConfig = typeof brandConfig;
