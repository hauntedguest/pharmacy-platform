import { mockProducts, type Product } from "@/lib/data/products";

// Domain Data Models
export interface OrderItemRecord {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  items: OrderItemRecord[];
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  status: "Verified" | "Dispensing" | "Dispatched" | "Out for Delivery" | "Delivered" | "Cancelled";
  isColdChain: boolean;
  currentPayloadTemp: string;
  deliveryOtp: string;
  trackingNumber: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionRecord {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  shippingCity: string;
  shippingPincode: string;
  doctorName: string;
  doctorRegNo: string;
  clinicHospital: string;
  dateIssued: string;
  validUntil: string;
  status: "pending" | "approved" | "rejected";
  urgency: "Normal" | "High";
  medications: string[];
  fileUrl?: string;
  pharmacistRemarks?: string;
  approvedBy?: string;
  createdAt: string;
}

export interface RefillRecord {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  intervalDays: number;
  nextRefillDate: string;
  status: "Active" | "Paused" | "Cancelled";
  whatsappReminder: boolean;
  rxValidityMonths: number;
  remainingPillsEstimate: number;
  createdAt: string;
}

export interface BatchRecord {
  batchId: string;
  productId: string;
  productName: string;
  manufacturer: string;
  manufacturingFacility: string;
  mfgDate: string;
  expiryDate: string;
  purityAssayPct: number;
  heavyMetalsScreen: string;
  microbialTest: string;
  dissolutionRate: string;
  storageVaultZone: string;
  currentVaultTemp: string;
  totalStockUnits: number;
  reorderLevel: number;
  releasePharmacist: string;
  releaseStatus: string;
}

export interface TelemetryPoint {
  time: string;
  temp: number;
  location: string;
  status: "optimal" | "warning";
}

// In-Memory Database Store Seeded with Proprietary MediCare Plus Data
class MemoryDatabase {
  private products: Map<string, Product> = new Map();
  private orders: Map<string, OrderRecord> = new Map();
  private prescriptions: Map<string, PrescriptionRecord> = new Map();
  private refills: Map<string, RefillRecord> = new Map();
  private batches: Map<string, BatchRecord> = new Map();
  private telemetry: Map<string, TelemetryPoint[]> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed Products
    mockProducts.forEach((p) => this.products.set(p.id, p));

    // Seed Orders
    const initialOrders: OrderRecord[] = [
      {
        id: "ORD-IND-9932",
        customerName: "Pranav Gupta",
        customerPhone: "+91 98765 43210",
        customerEmail: "pranav@medicareplus.in",
        shippingStreet: "402 Palm Crest, Turner Road",
        shippingCity: "Bandra West, Mumbai",
        shippingState: "Maharashtra",
        shippingPincode: "400050",
        items: [
          {
            productId: "prod_001",
            productName: "MediCare Plus CardioGuard Telmisartan 40mg",
            quantity: 2,
            unitPrice: 199,
            totalPrice: 398,
          },
          {
            productId: "prod_002",
            productName: "MediCare Plus Pure Arctic Omega-3 1000mg",
            quantity: 1,
            unitPrice: 799,
            totalPrice: 799,
          },
        ],
        totalAmount: 1197,
        paymentMethod: "UPI (Google Pay)",
        paymentStatus: "Paid",
        status: "Out for Delivery",
        isColdChain: true,
        currentPayloadTemp: "3.6°C",
        deliveryOtp: "6849",
        trackingNumber: "MCP-EXP-MUM-88491",
        prescriptionId: "RX-IND-9921",
        createdAt: "2026-09-05T09:40:00.000Z",
        updatedAt: "2026-09-05T10:15:00.000Z",
      },
      {
        id: "ORD-IND-98402",
        customerName: "Ananya Sharma",
        customerPhone: "+91 98234 56789",
        customerEmail: "ananya.sharma@gmail.com",
        shippingStreet: "12A Green Glen Layout, Bellandur",
        shippingCity: "Bengaluru",
        shippingState: "Karnataka",
        shippingPincode: "560103",
        items: [
          {
            productId: "prod_003",
            productName: "MediCare Plus D3 Max 60,000 IU",
            quantity: 2,
            unitPrice: 249,
            totalPrice: 498,
          },
        ],
        totalAmount: 498,
        paymentMethod: "Credit Card (RuPay)",
        paymentStatus: "Paid",
        status: "Dispensing",
        isColdChain: false,
        currentPayloadTemp: "Ambient",
        deliveryOtp: "4192",
        trackingNumber: "MCP-EXP-BLR-10928",
        createdAt: "2026-09-05T08:30:00.000Z",
        updatedAt: "2026-09-05T09:00:00.000Z",
      },
    ];

    initialOrders.forEach((ord) => this.orders.set(ord.id, ord));

    // Seed Prescriptions
    const initialPrescriptions: PrescriptionRecord[] = [
      {
        id: "RX-IND-9921",
        patientName: "Pranav Gupta",
        patientAge: 46,
        patientGender: "Male",
        patientPhone: "+91 98765 43210",
        shippingCity: "Mumbai",
        shippingPincode: "400050",
        doctorName: "Dr. K. S. Murthy, MD (Cardiology)",
        doctorRegNo: "MMC-2004-49102",
        clinicHospital: "Lilavati Hospital, Bandra, Mumbai",
        dateIssued: "2026-09-05",
        validUntil: "2027-03-05",
        status: "approved",
        urgency: "Normal",
        medications: ["CardioGuard Telmisartan 40mg (OD)", "D3 Max 60K Softgels (Weekly)"],
        fileUrl: "/docs/prescriptions/sample-rx-9921.pdf",
        pharmacistRemarks: "Signature and Maharashtra Medical Council registration MMC-2004-49102 verified.",
        approvedBy: "Chief Pharmacist Rajesh Deshmukh (Reg: MH-PH-88910)",
        createdAt: "2026-09-05T09:15:00.000Z",
      },
      {
        id: "RX-IND-9922",
        patientName: "Sunita Deshmukh",
        patientAge: 58,
        patientGender: "Female",
        patientPhone: "+91 97112 34567",
        shippingCity: "Pune",
        shippingPincode: "411004",
        doctorName: "Dr. Arvind Joshi, MD (Endocrinology)",
        doctorRegNo: "MMC-2011-88219",
        clinicHospital: "Jehangir Hospital, Pune",
        dateIssued: "2026-09-05",
        validUntil: "2027-03-05",
        status: "pending",
        urgency: "High",
        medications: ["Glucofine Metformin SR 500mg (BD)"],
        fileUrl: "/docs/prescriptions/sample-rx-9922.pdf",
        createdAt: "2026-09-05T10:00:00.000Z",
      },
    ];

    initialPrescriptions.forEach((rx) => this.prescriptions.set(rx.id, rx));

    // Seed Refills
    const initialRefills: RefillRecord[] = [
      {
        id: "SUB-IND-881",
        productId: "prod_001",
        productName: "MediCare Plus CardioGuard Telmisartan 40mg",
        customerName: "Pranav Gupta",
        customerPhone: "+91 98765 43210",
        quantity: 2,
        intervalDays: 30,
        nextRefillDate: "2026-09-18",
        status: "Active",
        whatsappReminder: true,
        rxValidityMonths: 6,
        remainingPillsEstimate: 12,
        createdAt: "2026-08-18T10:00:00.000Z",
      },
      {
        id: "SUB-IND-882",
        productId: "prod_002",
        productName: "MediCare Plus Pure Arctic Omega-3 1000mg",
        customerName: "Pranav Gupta",
        customerPhone: "+91 98765 43210",
        quantity: 1,
        intervalDays: 60,
        nextRefillDate: "2026-10-05",
        status: "Active",
        whatsappReminder: true,
        rxValidityMonths: 12,
        remainingPillsEstimate: 28,
        createdAt: "2026-08-05T10:00:00.000Z",
      },
    ];

    initialRefills.forEach((rf) => this.refills.set(rf.id, rf));

    // Seed Batch Records
    const initialBatches: BatchRecord[] = [
      {
        batchId: "BAT-MCP-99201",
        productId: "prod_001",
        productName: "MediCare Plus CardioGuard Telmisartan 40mg",
        manufacturer: "MediCare Plus Cleanroom Labs",
        manufacturingFacility: "Facility Alpha, Kurla Pharma Estate, Mumbai (CDSCO Licensed)",
        mfgDate: "2026-08-01",
        expiryDate: "2028-07-31",
        purityAssayPct: 99.85,
        heavyMetalsScreen: "Nil (Compliant with IP/USP)",
        microbialTest: "Zero Colony (Sterile)",
        dissolutionRate: "98.4% in 15 mins",
        storageVaultZone: "Zone B (Controlled Ambient 18°C)",
        currentVaultTemp: "18.2°C",
        totalStockUnits: 450,
        reorderLevel: 50,
        releasePharmacist: "R. Deshmukh (MH-PH-88910)",
        releaseStatus: "Passed 100% Quality Assurance",
      },
      {
        batchId: "BAT-MCP-77109",
        productId: "prod_002",
        productName: "MediCare Plus Pure Arctic Omega-3 1000mg",
        manufacturer: "MediCare Plus Cleanroom Labs",
        manufacturingFacility: "Bio-Extraction Facility 2, Navi Mumbai",
        mfgDate: "2026-07-15",
        expiryDate: "2028-07-14",
        purityAssayPct: 99.4,
        heavyMetalsScreen: "Nil (Inductively Coupled Plasma Mass Spectrometry Clean)",
        microbialTest: "Sterile Grade A",
        dissolutionRate: "Gelatin Enteric Coating < 10 mins",
        storageVaultZone: "Zone A (Refrigerated 4°C-8°C)",
        currentVaultTemp: "4.8°C",
        totalStockUnits: 320,
        reorderLevel: 40,
        releasePharmacist: "S. Kulkarni (MH-PH-77210)",
        releaseStatus: "Passed 100% Quality Assurance",
      },
    ];

    initialBatches.forEach((b) => this.batches.set(b.batchId, b));

    // Seed Telemetry for Order ORD-IND-9932
    this.telemetry.set("ORD-IND-9932", [
      { time: "09:00 AM", temp: 3.4, location: "BKC Cold-Vault Dispatch Gate 2", status: "optimal" },
      { time: "09:20 AM", temp: 3.5, location: "Western Express Highway Reefer Van", status: "optimal" },
      { time: "09:40 AM", temp: 3.8, location: "Bandra Kurla Flyover Transit Pod", status: "optimal" },
      { time: "10:05 AM", temp: 3.6, location: "Turner Road Sector 4 Courier Handover", status: "optimal" },
    ]);
  }

  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    for (const p of this.products.values()) {
      if (p.slug === slug) return p;
    }
    return null;
  }

  async updateProductStock(id: string, delta: number): Promise<Product | null> {
    const p = this.products.get(id);
    if (!p) return null;
    p.stock = Math.max(0, p.stock + delta);
    this.products.set(id, p);
    return p;
  }

  // --- ORDERS ---
  async getOrders(): Promise<OrderRecord[]> {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<OrderRecord | null> {
    return this.orders.get(id) || null;
  }

  async createOrder(order: Omit<OrderRecord, "id" | "createdAt" | "updatedAt">): Promise<OrderRecord> {
    const id = `ORD-IND-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newOrder: OrderRecord = {
      ...order,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, newOrder);

    // If cold chain, initialize telemetry
    if (newOrder.isColdChain) {
      this.telemetry.set(id, [
        {
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
          temp: 3.5,
          location: "Central Cold Vault Hub, BKC Mumbai",
          status: "optimal",
        },
      ]);
    }

    return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderRecord["status"]): Promise<OrderRecord | null> {
    const order = this.orders.get(id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    this.orders.set(id, order);
    return order;
  }

  // --- PRESCRIPTIONS ---
  async getPrescriptions(): Promise<PrescriptionRecord[]> {
    return Array.from(this.prescriptions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getPrescriptionById(id: string): Promise<PrescriptionRecord | null> {
    return this.prescriptions.get(id) || null;
  }

  async createPrescription(
    rx: Omit<PrescriptionRecord, "id" | "createdAt">
  ): Promise<PrescriptionRecord> {
    const id = `RX-IND-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: PrescriptionRecord = {
      ...rx,
      id,
      createdAt: new Date().toISOString(),
    };
    this.prescriptions.set(id, newRx);
    return newRx;
  }

  async updatePrescriptionStatus(
    id: string,
    status: PrescriptionRecord["status"],
    remarks?: string,
    approvedBy?: string
  ): Promise<PrescriptionRecord | null> {
    const rx = this.prescriptions.get(id);
    if (!rx) return null;
    rx.status = status;
    if (remarks) rx.pharmacistRemarks = remarks;
    if (approvedBy) rx.approvedBy = approvedBy;
    this.prescriptions.set(id, rx);
    return rx;
  }

  // --- REFILLS ---
  async getRefills(): Promise<RefillRecord[]> {
    return Array.from(this.refills.values());
  }

  async getRefillById(id: string): Promise<RefillRecord | null> {
    return this.refills.get(id) || null;
  }

  async createRefill(refill: Omit<RefillRecord, "id" | "createdAt">): Promise<RefillRecord> {
    const id = `SUB-IND-${Math.floor(100 + Math.random() * 900)}`;
    const newRefill: RefillRecord = {
      ...refill,
      id,
      createdAt: new Date().toISOString(),
    };
    this.refills.set(id, newRefill);
    return newRefill;
  }

  async updateRefillStatus(id: string, status: RefillRecord["status"]): Promise<RefillRecord | null> {
    const refill = this.refills.get(id);
    if (!refill) return null;
    refill.status = status;
    this.refills.set(id, refill);
    return refill;
  }

  // --- BATCHES ---
  async getBatches(): Promise<BatchRecord[]> {
    return Array.from(this.batches.values());
  }

  async getBatchById(batchId: string): Promise<BatchRecord | null> {
    return this.batches.get(batchId) || null;
  }

  // --- TELEMETRY ---
  async getOrderTelemetry(orderId: string): Promise<TelemetryPoint[]> {
    return this.telemetry.get(orderId) || [];
  }

  async addTelemetryPoint(orderId: string, point: TelemetryPoint): Promise<void> {
    const list = this.telemetry.get(orderId) || [];
    list.push(point);
    this.telemetry.set(orderId, list);
  }
}

// Global Singleton for in-process memory caching across Next.js API calls
const globalForDb = globalThis as unknown as { __medicareDb?: MemoryDatabase };
export const db = globalForDb.__medicareDb ?? new MemoryDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.__medicareDb = db;
