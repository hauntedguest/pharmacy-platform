/**
 * Mock Product Data for Indian Healthcare Market
 * Structured with INR (₹) pricing, MRP, Schedule H / OTC compliance, and pack sizes.
 */

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: "prescription" | "otc" | "supplement" | "medical-device" | "ayurvedic" | "personal-care";
  subCategory?: string;
  brand: string;
  manufacturer?: string;
  price: number; // Selling price in INR (₹)
  originalPrice?: number; // MRP in INR (₹)
  packSize: string; // e.g. "Strip of 10 Tablets", "Bottle of 60 Capsules"
  stock: number;
  requiresPrescription: boolean; // True for Schedule H / H1 / X drugs
  prescriptionType?: "Schedule H" | "Schedule H1" | "OTC" | "Ayurvedic";
  images: string[];
  description: string;
  dosage?: string;
  dosageForm: "Tablet" | "Capsule" | "Softgel" | "Syrup" | "Device" | "Ointment" | "Powder" | "Drops";
  activeIngredient?: string;
  composition?: string;
  sideEffects?: string[];
  usage: string;
  warnings?: string[];
  storage?: string;
  featured: boolean;
  bestseller?: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  discountPercent?: number;
}

export const mockProducts: Product[] = [
  {
    id: "prod_001",
    slug: "vitamin-d3-60k-iu-softgels",
    name: "MediCare Plus D3 Max 60,000 IU High Potency",
    category: "supplement",
    subCategory: "Vitamins & Minerals",
    brand: "MediCare Plus Clinical Labs",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 349,
    originalPrice: 460,
    packSize: "Box of 8 Softgels",
    stock: 180,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/vitamin-d3.jpg"],
    description:
      "Our proprietary clinical-strength Cholecalciferol (Vitamin D3) 60K softgels with nano-emulsion technology for rapid absorption, bone mineralization, and immunity boost.",
    dosage: "60,000 IU per softgel",
    dosageForm: "Softgel",
    activeIngredient: "Cholecalciferol (Vitamin D3) 60000 IU",
    composition: "Cholecalciferol IP 60,000 IU in gelatin capsule",
    usage: "Take 1 softgel weekly with whole milk or a meal high in dietary fat, or as prescribed by your physician.",
    warnings: [
      "Do not exceed recommended weekly dosage without consulting a doctor",
      "Store below 25°C in a dry place away from direct sunlight",
    ],
    storage: "Store protected from light and moisture at a temperature not exceeding 25°C.",
    featured: true,
    bestseller: true,
    tags: ["vitamin-d", "immunity", "bone-health", "weekly-dose", "bestseller", "medicare-plus"],
    rating: 4.9,
    reviewCount: 542,
  },
  {
    id: "prod_002",
    slug: "telmisartan-40mg-tablets",
    name: "MediCare Plus CardioGuard Telmisartan 40mg",
    category: "prescription",
    subCategory: "Cardiovascular Care",
    brand: "MediCare Plus Therapeutics",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 215,
    originalPrice: 285,
    packSize: "Strip of 15 Tablets",
    stock: 95,
    requiresPrescription: true,
    prescriptionType: "Schedule H",
    images: ["/products/telmisartan.jpg"],
    description:
      "Pharmaceutical-grade Angiotensin II Receptor Blocker (ARB) formulation for essential hypertension management and cardiovascular risk reduction.",
    dosage: "40mg per tablet",
    dosageForm: "Tablet",
    activeIngredient: "Telmisartan IP",
    composition: "Telmisartan IP 40mg",
    sideEffects: ["Dizziness", "Back pain", "Sinus inflammation"],
    usage: "Take 1 tablet once daily at the same time each day with or without food, as directed by your cardiologist.",
    warnings: [
      "SCHEDULE H PRESCRIPTION DRUG: Not to be sold by retail without the prescription of a Registered Medical Practitioner",
      "Contraindicated during pregnancy (Category D)",
      "Monitor serum potassium levels periodically",
    ],
    storage: "Store in a cool, dry place. Protect from light.",
    featured: true,
    bestseller: true,
    tags: ["hypertension", "blood-pressure", "heart-health", "schedule-h", "prescription", "medicare-plus"],
    rating: 4.8,
    reviewCount: 318,
  },
  {
    id: "prod_003",
    slug: "triple-strength-omega-3-fish-oil-1000mg",
    name: "MediCare Plus Pure Arctic Omega-3 1250mg",
    category: "supplement",
    subCategory: "Heart & Brain Health",
    brand: "MediCare Plus BioCeuticals",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 899,
    originalPrice: 1299,
    packSize: "Bottle of 60 Enteric Softgels",
    stock: 120,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/omega3.jpg"],
    description:
      "Our ultra-pure, molecularly distilled deep-sea fish oil providing 560mg EPA and 400mg DHA per serving. Heavy-metal certified with enteric coating for zero fishy burps.",
    dosage: "1250mg Fish Oil (560mg EPA + 400mg DHA)",
    dosageForm: "Softgel",
    activeIngredient: "Purified Omega-3 Triglycerides",
    composition: "Omega-3 Fatty Acids with natural mixed tocopherols",
    usage: "Take 1-2 softgels daily after breakfast or dinner with water.",
    warnings: ["People allergic to seafood should consult a doctor before use"],
    storage: "Keep tightly sealed in a cool, dry place away from sunlight.",
    featured: true,
    bestseller: true,
    tags: ["omega-3", "heart-health", "dha", "epa", "brain-health", "cholesterol", "medicare-plus"],
    rating: 4.9,
    reviewCount: 684,
  },
  {
    id: "prod_004",
    slug: "pantoprazole-40mg-gastro-resistant",
    name: "MediCare Plus GastroSoothe Pantoprazole 40mg",
    category: "prescription",
    subCategory: "Gastrointestinal Care",
    brand: "MediCare Plus Therapeutics",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 155,
    originalPrice: 195,
    packSize: "Strip of 15 Gastro-Resistant Tablets",
    stock: 240,
    requiresPrescription: true,
    prescriptionType: "Schedule H",
    images: ["/products/pantoprazole.jpg"],
    description:
      "Advanced Proton Pump Inhibitor (PPI) formulation providing 24-hour suppression of gastric acid for GERD, hyperacidity, and peptic ulcer relief.",
    dosage: "40mg per tablet",
    dosageForm: "Tablet",
    activeIngredient: "Pantoprazole Sodium IP",
    composition: "Pantoprazole Sodium IP equivalent to Pantoprazole 40mg",
    sideEffects: ["Headache", "Diarrhea", "Flatulence"],
    usage: "Take 1 tablet in the morning 30 minutes before breakfast with a glass of water. Swallow whole; do not crush or chew.",
    warnings: [
      "SCHEDULE H PRESCRIPTION DRUG: Requires valid doctor prescription",
      "Do not use continuously for more than 14 days without medical advice",
    ],
    storage: "Store protected from moisture at a temperature below 30°C.",
    featured: false,
    bestseller: true,
    tags: ["acidity", "gerd", "heartburn", "gastric-relief", "schedule-h", "medicare-plus"],
    rating: 4.7,
    reviewCount: 429,
  },
  {
    id: "prod_005",
    slug: "omron-hem-7120-bp-monitor",
    name: "MediCare Plus Precision Digital Upper-Arm BP Monitor",
    category: "medical-device",
    subCategory: "Diagnostic Devices",
    brand: "MediCare Plus Diagnostics",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 2199,
    originalPrice: 2840,
    packSize: "1 Unit (with Medium-Large Cuff & 4 AA Batteries)",
    stock: 45,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/bp-monitor.jpg"],
    description:
      "Clinically calibrated upper-arm blood pressure monitor featuring IntelliSense technology, irregular pulse detection, and WHO blood pressure grade indicators.",
    dosageForm: "Device",
    usage: "Rest 5 minutes before reading. Wrap cuff comfortably around upper arm 1-2 cm above elbow joint and press Start.",
    warnings: ["3 Years Official India Brand Warranty included", "Use only recommended AA batteries or DC adapter"],
    featured: true,
    bestseller: true,
    tags: ["bp-monitor", "medical-device", "medicare-plus", "heart-rate", "clinical-grade"],
    rating: 4.8,
    reviewCount: 892,
  },
  {
    id: "prod_006",
    slug: "ashwagandha-ksm66-500mg",
    name: "MediCare Plus KSM-66 Organic Ashwagandha 500mg",
    category: "ayurvedic",
    subCategory: "Ayurveda & Vitality",
    brand: "MediCare Plus Botanical Care",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 549,
    originalPrice: 799,
    packSize: "Bottle of 60 Vegetarian Capsules",
    stock: 110,
    requiresPrescription: false,
    prescriptionType: "Ayurvedic",
    images: ["/products/ashwagandha.jpg"],
    description:
      "Standardized full-spectrum root extract (5% withanolides) with BioPerine for enhanced bioavailability, clinical cortisol regulation, and endurance.",
    dosage: "500mg with 5% Withanolides",
    dosageForm: "Capsule",
    activeIngredient: "Withania Somnifera (KSM-66)",
    composition: "KSM-66 Ashwagandha Root Extract 500mg, BioPerine 5mg",
    usage: "Take 1 capsule twice daily with lukewarm milk or water after meals.",
    warnings: ["Consult an Ayurvedic physician if pregnant or undergoing thyroid treatment"],
    storage: "Store in a cool, dry place. Keep container tightly closed.",
    featured: true,
    tags: ["ayurveda", "stress-relief", "ashwagandha", "ksm-66", "cortisol", "vitality", "medicare-plus"],
    rating: 4.9,
    reviewCount: 520,
  },
  {
    id: "prod_007",
    slug: "probiotic-50-billion-cfu-16-strains",
    name: "MediCare Plus FloraMax 50 Billion Probiotic",
    category: "supplement",
    subCategory: "Gut & Digestive Care",
    brand: "MediCare Plus BioCeuticals",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 1199,
    originalPrice: 1599,
    packSize: "Bottle of 30 Delayed-Release Capsules",
    stock: 75,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/probiotic.jpg"],
    description:
      "Our in-house clinical probiotic formulated with 16 gut-resilient strains and prebiotic FOS in delayed-release acid-resistant vegetarian capsules.",
    dosage: "50 Billion CFU per capsule",
    dosageForm: "Capsule",
    activeIngredient: "16-Strain Probiotic Blend + Prebiotic FOS",
    usage: "Take 1 capsule daily on an empty stomach 30 minutes before breakfast with water.",
    warnings: ["Refrigeration recommended after opening for maximum potency"],
    storage: "Store in a cool dry place below 20°C.",
    featured: true,
    tags: ["gut-health", "probiotics", "digestive-enzyme", "microbiome", "immunity", "medicare-plus"],
    rating: 4.8,
    reviewCount: 276,
  },
  {
    id: "prod_008",
    slug: "montelukast-levocetirizine-tablets",
    name: "MediCare Plus RespiraPure Montelukast + Levocetirizine",
    category: "prescription",
    subCategory: "Respiratory & Allergy",
    brand: "MediCare Plus Therapeutics",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 248,
    originalPrice: 310,
    packSize: "Strip of 10 Tablets",
    stock: 140,
    requiresPrescription: true,
    prescriptionType: "Schedule H",
    images: ["/products/montair-lc.jpg"],
    description:
      "Targeted respiratory dual therapy combining Montelukast (10mg) and Levocetirizine (5mg) for relief from allergic rhinitis, bronchospasms, and chronic allergies.",
    dosage: "Montelukast 10mg + Levocetirizine 5mg",
    dosageForm: "Tablet",
    activeIngredient: "Montelukast Sodium IP & Levocetirizine Dihydrochloride IP",
    composition: "Montelukast Sodium IP eq. to Montelukast 10mg, Levocetirizine Dihydrochloride IP 5mg",
    sideEffects: ["Mild drowsiness", "Dry mouth", "Headache"],
    usage: "Take 1 tablet at night before sleeping, with or without food as prescribed by your physician.",
    warnings: [
      "SCHEDULE H PRESCRIPTION DRUG: Not to be sold without a valid doctor's prescription",
      "May cause drowsiness. Do not drive or operate heavy machinery immediately after intake.",
    ],
    storage: "Store below 25°C in a dry place. Protect from direct light.",
    featured: false,
    bestseller: true,
    tags: ["allergy", "cold", "asthma", "medicare-plus", "schedule-h", "prescription"],
    rating: 4.7,
    reviewCount: 395,
  },
  {
    id: "prod_009",
    slug: "accu-chek-active-glucometer-kit",
    name: "MediCare Plus GlucoSense Smart Blood Glucose Monitoring Kit",
    category: "medical-device",
    subCategory: "Diabetes Management",
    brand: "MediCare Plus Diagnostics",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 1349,
    originalPrice: 1699,
    packSize: "1 Glucometer + 25 Test Strips + Lancing Pen",
    stock: 60,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/glucometer.jpg"],
    description:
      "Gold-electrode sensor technology delivering accurate 5-second blood glucose measurements with meal markers and 500-test memory.",
    dosageForm: "Device",
    usage: "Insert strip into meter, apply small 1-2µL capillary blood drop. Result displayed in 5 seconds.",
    warnings: ["Keep test strip container tightly capped", "Use strips within 90 days of opening"],
    featured: false,
    bestseller: true,
    tags: ["diabetes", "glucometer", "medicare-plus", "blood-sugar", "medical-device"],
    rating: 4.7,
    reviewCount: 612,
  },
  {
    id: "prod_010",
    slug: "paracetamol-650mg-tablets",
    name: "MediCare Plus Paracetamol 650mg Fast-Action",
    category: "otc",
    subCategory: "Pain & Fever",
    brand: "MediCare Plus Clinical Labs",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 34,
    originalPrice: 42,
    packSize: "Strip of 15 Tablets",
    stock: 500,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/dolo650.jpg"],
    description:
      "Rapid-dissolution micronized Paracetamol 650mg for fast reduction of high fever, headaches, body aches, and post-viral fatigue.",
    dosage: "650mg per tablet",
    dosageForm: "Tablet",
    activeIngredient: "Paracetamol IP",
    composition: "Paracetamol IP 650mg",
    usage: "Adults: Take 1 tablet every 6 hours as needed. Do not exceed 4 tablets in 24 hours. Keep at least 4 hours gap between doses.",
    warnings: [
      "Overdose may be injurious to liver",
      "Do not consume with alcohol",
      "Do not take with other Paracetamol containing preparations",
    ],
    storage: "Store in a dry place at temperature not exceeding 30°C.",
    featured: false,
    bestseller: true,
    tags: ["fever", "paracetamol", "pain-relief", "medicare-plus", "otc", "headache"],
    rating: 4.9,
    reviewCount: 1420,
  },
  {
    id: "prod_011",
    slug: "vitamin-c-zinc-effervescent-tablets",
    name: "MediCare Plus Immunite-C 1000mg + Zinc Effervescent",
    category: "supplement",
    subCategory: "Immunity & Skin",
    brand: "MediCare Plus BioCeuticals",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 299,
    originalPrice: 425,
    packSize: "Tube of 20 Sugar-Free Effervescent Tablets (Tangy Orange)",
    stock: 160,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/vitaminc-fizz.jpg"],
    description:
      "Refreshing effervescent formulation combining 1000mg Amla-derived Vitamin C and 10mg Zinc for immediate cellular antioxidant defense.",
    dosage: "1000mg Vitamin C + 10mg Zinc",
    dosageForm: "Tablet",
    activeIngredient: "Ascorbic Acid IP + Zinc Sulphate",
    usage: "Drop 1 tablet into 200ml of water, wait until completely dissolved, drink immediately.",
    warnings: ["Do not swallow tablet directly without dissolving"],
    featured: false,
    tags: ["vitamin-c", "zinc", "immunity", "effervescent", "skin-glow", "medicare-plus"],
    rating: 4.6,
    reviewCount: 230,
  },
  {
    id: "prod_012",
    slug: "diclofenac-pain-relief-gel-50g",
    name: "MediCare Plus DeepRelief Diclofenac Active Gel 50g",
    category: "otc",
    subCategory: "Joint & Muscle Care",
    brand: "MediCare Plus Clinical Labs",
    manufacturer: "MediCare Plus Healthcare Labs, Mumbai BKC",
    price: 185,
    originalPrice: 220,
    packSize: "Lami Tube of 50g",
    stock: 130,
    requiresPrescription: false,
    prescriptionType: "OTC",
    images: ["/products/volini.jpg"],
    description:
      "Deep micro-penetration topical formula containing Diclofenac Diethylamine, Methyl Salicylate, and Menthol for fast alleviation of muscle spasms, sprains, and arthritis pain.",
    dosageForm: "Ointment",
    activeIngredient: "Diclofenac Diethylamine IP 1.16% w/w",
    usage: "Gently apply a thin layer over the affected area 3-4 times daily. Do not massage vigorously.",
    warnings: ["For external use only", "Do not apply on open wounds or broken skin"],
    featured: false,
    tags: ["pain-gel", "joint-pain", "medicare-plus", "backache", "otc"],
    rating: 4.8,
    reviewCount: 380,
  },
];

// Helper functions for Filtering, Searching, and Sorting
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
  const q = query.toLowerCase().trim();
  if (!q) return mockProducts;
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.activeIngredient && p.activeIngredient.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((tag) => tag.toLowerCase().includes(q))
  );
};

// Formats number into Indian Rupee format (e.g. ₹1,299 or ₹499)
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};
