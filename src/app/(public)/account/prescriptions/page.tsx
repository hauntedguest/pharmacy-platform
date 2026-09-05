"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  Calendar,
  User,
  Plus,
  ArrowRight,
  ExternalLink,
  Download,
  Trash2,
  Pill,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";

interface PrescriptionRecord {
  id: string;
  doctorName: string;
  doctorRegNo: string;
  hospital: string;
  issueDate: string;
  validUntil: string;
  status: "Verified" | "Under Review" | "Expiring Soon" | "Expired";
  medications: string[];
  patientName: string;
  fileName: string;
  fileSize: string;
}

const initialPrescriptions: PrescriptionRecord[] = [
  {
    id: "RX-IND-2026-8942",
    doctorName: "Dr. K. S. Murthy, MD, DM (Cardiology)",
    doctorRegNo: "MMC-2004-49102",
    hospital: "Lilavati Hospital & Research Centre, Mumbai",
    issueDate: "2026-08-15",
    validUntil: "2027-02-15",
    status: "Verified",
    medications: ["MediCare Plus CardioGuard Telmisartan 40mg", "Pure Arctic Omega-3 1000mg"],
    patientName: "Pranav Gupta",
    fileName: "Dr_Murthy_Cardio_Prescription_Aug26.pdf",
    fileSize: "1.4 MB",
  },
  {
    id: "RX-IND-2026-7210",
    doctorName: "Dr. Ananya Sen, MD (Gastroenterology)",
    doctorRegNo: "WBMC-2012-38491",
    hospital: "Apollo Multispeciality Hospitals, Kolkata",
    issueDate: "2026-06-10",
    validUntil: "2026-12-10",
    status: "Verified",
    medications: ["MediCare Plus Pantoprazole 40mg Gastro-Resistant", "FloraMax Daily Probiotic"],
    patientName: "Pranav Gupta",
    fileName: "Apollo_Gastro_Sen_June26.jpg",
    fileSize: "2.8 MB",
  },
  {
    id: "RX-IND-2026-9501",
    doctorName: "Dr. Vikramaditya Joshi, MS (Orthopaedics)",
    doctorRegNo: "DMC-2010-58291",
    hospital: "Max Super Speciality Hospital, Saket, New Delhi",
    issueDate: "2026-09-02",
    validUntil: "2027-03-02",
    status: "Under Review",
    medications: ["MediCare Plus DeepRelief Diclofenac Active Gel 50g", "D3 Max 60,000 IU"],
    patientName: "Pranav Gupta",
    fileName: "Max_Ortho_Prescription_Sept.pdf",
    fileSize: "3.1 MB",
  },
];

export default function AccountPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(initialPrescriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [patientName, setPatientName] = useState("Pranav Gupta");
  const [doctorName, setDoctorName] = useState("");
  const [doctorRegNo, setDoctorRegNo] = useState("");
  const [hospital, setHospital] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medications.some((m) => m.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || rx.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const newRx: PrescriptionRecord = {
      id: `RX-IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorName: doctorName || "Dr. S. Nair, MD (Internal Medicine)",
      doctorRegNo: doctorRegNo || "KMC-2015-89124",
      hospital: hospital || "Manipal Hospital, Bangalore",
      issueDate: new Date().toISOString().split("T")[0],
      validUntil: "2027-03-05",
      status: "Under Review",
      medications: ["MediCare Plus Active Formulations"],
      patientName: patientName || "Pranav Gupta",
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
    };

    setPrescriptions([newRx, ...prescriptions]);
    setShowUploadModal(false);
    setSelectedFile(null);
    setDoctorName("");
    setDoctorRegNo("");
    setHospital("");
    setUploadSuccess(`✓ Prescription ${newRx.id} uploaded! Assigned to Duty Pharmacist for verification.`);
    setTimeout(() => setUploadSuccess(null), 6000);
  };

  const handleDelete = (id: string) => {
    setPrescriptions(prescriptions.filter((rx) => rx.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              CDSCO &amp; Drugs and Cosmetics Rules 1945 Compliant
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Patient Prescription Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Securely store, manage, and rollover your statutory medical prescriptions issued by Registered Medical Practitioners (RMPs) across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Upload New Prescription
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-xs bg-white/10 hover:bg-white/20 border-white/20 text-white font-bold rounded-2xl"
            >
              <Link href="/account/refills">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Refill Schedules
              </Link>
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {uploadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <button
              onClick={() => setUploadSuccess(null)}
              className="text-xs text-emerald-900 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-3xl border border-gray-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search by Doctor, Hospital, Rx ID, or Medication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-gray-500 font-semibold shrink-0">Filter Status:</span>
            {["all", "Verified", "Under Review", "Expiring Soon"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {status === "all" ? "All Prescriptions" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Prescription Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Verified Clinical Prescriptions ({filteredPrescriptions.length})
            </h2>
            <span className="text-xs text-gray-500">
              Valid for repeat dispensing under CDSCO Form 20/21
            </span>
          </div>

          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center space-y-4 shadow-xs">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <h3 className="font-bold text-gray-800 text-base">No Prescriptions Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No active doctor prescriptions matched your search criteria.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                variant="outline"
                className="text-xs font-bold"
              >
                Reset Search Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-3xl border border-gray-200 hover:border-blue-300 transition-all p-6 shadow-xs flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    {/* Top Row: Rx ID & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        {rx.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          rx.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : rx.status === "Under Review"
                            ? "bg-blue-50 text-blue-700 border-blue-200 animate-pulse"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>

                    {/* Doctor Details */}
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight">
                        {rx.doctorName}
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {rx.hospital}
                      </p>
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">
                        RMP Reg: {rx.doctorRegNo}
                      </p>
                    </div>

                    {/* Prescribed Medicines */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Prescribed MediCare Plus Formulations
                      </p>
                      <ul className="space-y-1">
                        {rx.medications.map((med, i) => (
                          <li
                            key={i}
                            className="text-xs font-semibold text-gray-800 flex items-center gap-1.5"
                          >
                            <Pill className="w-3 h-3 text-blue-600 shrink-0" />
                            <span className="truncate">{med}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Validity Strip */}
                    <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-600" /> Issued: {rx.issueDate}
                      </span>
                      <span className="font-bold text-emerald-700">
                        Valid Until: {rx.validUntil}
                      </span>
                    </div>

                    {/* File Attachment */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                      <div className="flex items-center gap-2 truncate max-w-[80%]">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate font-medium text-gray-700">{rx.fileName}</span>
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">{rx.fileSize}</span>
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-xl"
                    >
                      <Link href="/account/refills">
                        Refill Formulation <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>

                    <button
                      onClick={() => handleDelete(rx.id)}
                      className="p-2 rounded-xl border border-gray-200 hover:bg-rose-50 hover:text-rose-600 text-gray-400 transition-colors"
                      title="Delete Prescription Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Prescription Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-gray-900">Add Doctor Prescription to Vault</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Upload Rx Slip (JPG, PNG, PDF up to 15MB) *
                </label>
                <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-gray-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    required
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <UploadCloud className="w-8 h-8 text-blue-600 mb-2" />
                    {selectedFile ? (
                      <p className="font-bold text-gray-900">{selectedFile.name}</p>
                    ) : (
                      <p className="font-semibold text-gray-700">
                        Click or drag doctor prescription here
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. S. Murthy"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">RMP Registration No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MMC-2004-49102"
                    value={doctorRegNo}
                    onChange={(e) => setDoctorRegNo(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hospital / Clinic Name &amp; City</label>
                <input
                  type="text"
                  placeholder="e.g. Lilavati Hospital, Mumbai"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-[11px] leading-relaxed">
                Our registered pharmacists will review this document under Drugs &amp; Cosmetics Rules 1945 and activate your automated repeat refill privileges.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!selectedFile}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save to Prescription Vault
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
