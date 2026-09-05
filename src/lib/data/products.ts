/**
 * Mock Product Data
 * Realistic pharmaceutical product catalog for prototype
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "prescription" | "otc" | "supplement" | "medical-device" | "personal-care";
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  requiresPrescription: boolean;
  images: string[];
  description: string;
  dosage?: string;
  activeIngredient?: string;
  sideEffects?: string[];
  usage: string;
  warnings?: string[];
  featured: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
}

export const mockProducts: Product[] = [
  {
    id: "prod_001",
    slug: "vitamin-d3-5000iu",
    name: "Vitamin D3 5000 IU",
    category: "supplement",
    brand: "NaturePlus",
    price: 24.99,
    originalPrice: 34.99,
    stock: 150,
    requiresPrescription: false,
    images: ["/products/vitamin-d3.jpg"],
    description:
      "High-potency Vitamin D3 supplement for bone health, immune support, and overall wellness. Easy-to-swallow softgels.",
    dosage: "5000 IU per softgel",
    activeIngredient: "Cholecalciferol (Vitamin D3)",
    usage: "Take 1 softgel daily with a meal, or as directed by your healthcare provider.",
    warnings: [
      "Consult physician if pregnant or nursing",
      "Keep out of reach of children",
    ],
    featured: true,
    tags: ["immunity", "bone-health", "vitamin", "bestseller"],
    rating: 4.8,
    reviewCount: 324,
  },
  {
    id: "prod_002",
    slug: "ibuprofen-200mg",
    name: "Ibuprofen 200mg",
    category: "otc",
    brand: "PainRelief Pro",
    price: 12.99,
    stock: 200,
    requiresPrescription: false,
    images: ["/products/ibuprofen.jpg"],
    description:
      "Fast-acting pain reliever and fever reducer. Effective for headaches, muscle aches, arthritis, and menstrual cramps.",
    dosage: "200mg per tablet",
    activeIngredient: "Ibuprofen",
    sideEffects: ["Upset stomach", "Nausea", "Dizziness"],
    usage: "Adults: Take 1-2 tablets every 4-6 hours as needed. Do not exceed 6 tablets in 24 hours.",
    warnings: [
      "May cause stomach bleeding",
      "Do not use with other NSAIDs",
      "Consult doctor if symptoms persist",
    ],
    featured: false,
    tags: ["pain-relief", "fever", "otc", "anti-inflammatory"],
    rating: 4.5,
    reviewCount: 156,
  },
  {
    id: "prod_003",
    slug: "omega-3-fish-oil",
    name: "Omega-3 Fish Oil 1000mg",
    category: "supplement",
    brand: "OceanLife",
    price: 29.99,
    stock: 89,
    requiresPrescription: false,
    images: ["/products/omega3.jpg"],
    description:
      "Premium wild-caught fish oil rich in EPA and DHA for heart, brain, and joint health. Molecularly distilled for purity.",
    dosage: "1000mg per softgel (180mg EPA, 120mg DHA)",
    activeIngredient: "Omega-3 Fatty Acids (EPA & DHA)",
    usage: "Take 2 softgels daily with meals.",
    warnings: ["Consult physician if on blood thinners"],
    featured: true,
    tags: ["heart-health", "omega-3", "fish-oil", "brain-health"],
    rating: 4.7,
    reviewCount: 289,
  },
  {
    id: "prod_004",
    slug: "lisinopril-10mg",
    name: "Lisinopril 10mg",
    category: "prescription",
    brand: "CardioMed",
    price: 18.99,
    stock: 45,
    requiresPrescription: true,
    images: ["/products/lisinopril.jpg"],
    description:
      "ACE inhibitor used to treat high blood pressure and heart failure. Helps prevent strokes and kidney problems.",
    dosage: "10mg per tablet",
    activeIngredient: "Lisinopril",
    sideEffects: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
    usage: "Take once daily as prescribed by your doctor. May be taken with or without food.",
    warnings: [
      "Do not use if pregnant",
      "May cause low blood pressure",
      "Monitor kidney function regularly",
    ],
    featured: false,
    tags: ["prescription", "blood-pressure", "heart-health"],
    rating: 4.6,
    reviewCount: 78,
  },
  {
    id: "prod_005",
    slug: "digital-thermometer",
    name: "Digital Oral Thermometer",
    category: "medical-device",
    brand: "MediCheck",
    price: 14.99,
    stock: 120,
    requiresPrescription: false,
    images: ["/products/thermometer.jpg"],
    description:
      "Fast and accurate digital thermometer with 10-second reading. Large display, fever alert, and memory recall.",
    usage: "Place under tongue, wait for beep (approx 10 seconds). Clean with alcohol after each use.",
    warnings: ["For oral use only", "Not suitable for children under 3"],
    featured: false,
    tags: ["medical-device", "thermometer", "fever", "health-monitoring"],
    rating: 4.4,
    reviewCount: 201,
  },
  {
    id: "prod_006",
    slug: "probiotic-30-billion",
    name: "Probiotic 30 Billion CFU",
    category: "supplement",
    brand: "GutHealth Pro",
    price: 34.99,
    stock: 67,
    requiresPrescription: false,
    images: ["/products/probiotic.jpg"],
    description:
      "Advanced probiotic formula with 10 strains and 30 billion CFU for digestive health, immune support, and gut balance.",
    dosage: "30 billion CFU per capsule",
    activeIngredient: "10-Strain Probiotic Blend",
    usage: "Take 1 capsule daily on an empty stomach, preferably in the morning.",
    featured: true,
    tags: ["digestive-health", "probiotic", "gut-health", "immunity"],
    rating: 4.9,
    reviewCount: 412,
  },
  {
    id: "prod_007",
    slug: "blood-pressure-monitor",
    name: "Automatic Blood Pressure Monitor",
    category: "medical-device",
    brand: "VitalCheck",
    price: 49.99,
    originalPrice: 69.99,
    stock: 34,
    requiresPrescription: false,
    images: ["/products/bp-monitor.jpg"],
    description:
      "Clinically validated automatic blood pressure monitor with large cuff, irregular heartbeat detection, and 90-memory storage.",
    usage: "Wrap cuff around upper arm, press start. Remain still during measurement. Store up to 90 readings.",
    warnings: ["Not for diagnostic use", "Consult physician for medical decisions"],
    featured: true,
    tags: ["medical-device", "blood-pressure", "health-monitoring", "heart-health"],
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: "prod_008",
    slug: "antibiotic-cream",
    name: "Triple Antibiotic Ointment",
    category: "otc",
    brand: "WoundCare",
    price: 8.99,
    stock: 180,
    requiresPrescription: false,
    images: ["/products/antibiotic-cream.jpg"],
    description:
      "First-aid antibiotic ointment for minor cuts, scrapes, and burns. Helps prevent infection and promotes healing.",
    activeIngredient: "Bacitracin, Neomycin, Polymyxin B",
    usage: "Clean affected area, apply small amount 1-3 times daily. Cover with bandage if needed.",
    warnings: [
      "Do not use in eyes",
      "Stop use if rash develops",
      "For external use only",
    ],
    featured: false,
    tags: ["first-aid", "wound-care", "antibiotic", "otc"],
    rating: 4.6,
    reviewCount: 98,
  },
];

// Helper functions
export const getProductBySlug = (slug: string): Product | undefined => {
  return mockProducts.find((p) => p.slug === slug);
};

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter((p) => p.featured);
};

export const getProductsByCategory = (
  category: Product["category"]
): Product[] => {
  return mockProducts.filter((p) => p.category === category);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.description.toLowerCase().includes(lowercaseQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};
