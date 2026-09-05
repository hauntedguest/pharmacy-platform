"use client";

import { useState } from "react";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  Clock,
  User,
  X,
} from "lucide-react";
import Button from "@/components/ui/Button";

interface PrescriptionItem {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  city: string;
  pinCode: string;
  doctorName: string;
  doctorRegNo: string;
  clinic: string;
  date: string;
  medications: string[];
  status: "pending" | "approved" | "rejected";
  urgency: "High" | "Normal";
}

const mockQueue: PrescriptionItem[] = [
  {
    id: "RX-IND-9921",
    patientName: "Sunita Deshmukh",
    age: 54,
    gender: "Female",
    phone: "+91 98201 54321",
    city: "Bandra West, Mumbai",
    pinCode: "400050",
    doctorName: "Dr. K. S. Murthy, MD (Cardiology)",
    doctorRegNo: "MMC-2004-49102",
    clinic: "Lilavati Hospital & Research Centre",
    date: "2026-09-05",
    medications: [
      "MediCare Plus CardioGuard Telmisartan 40mg (1 tablet OD x 30 days)",
      "MediCare Plus D3 Max 60,000 IU (1 weekly x 8 weeks)",
    ],
    status: "pending",
    urgency: "High",
  },
  {
    id: "RX-IND-9920",
    patientName: "Arjun Verma",
    age: 38,
    gender: "Male",
    phone: "+91 98110 87654",
    city: "Gurugram Phase 5, NCR",
    pinCode: "122002",
    doctorName: "Dr. R. K. Singhania, MD (Pulmonology)",
    doctorRegNo: "DMC-2011-88219",
    clinic: "Medanta - The Medicity",
    date: "2026-09-05",
    medications: [
      "MediCare Plus AllergyShield Levocetirizine (1 tablet HS x 15 days)",
    ],
    status: "pending",
    urgency: "Normal",
  },
  {
    id: "RX-IND-9918",
    patientName: "Priya Nair",
    age: 29,
    gender: "Female",
    phone: "+91 98450 12390",
    city: "Indiranagar, Bengaluru",
    pinCode: "560038",
    doctorName: "Dr. V. Menon, MS (Gastro)",
    doctorRegNo: "KMC-2016-10394",
    clinic: "Manipal Hospital Old Airport Rd",
    date: "2026-09-04",
    medications: [
      "MediCare Plus Pantoprazole 40mg Gastro-Resistant (1 tab AC before breakfast x 14 days)",
    ],
    status: "approved",
    urgency: "Normal",
  },
];

export default function AdminPrescriptionsPage() {
  const [queue, setQueue] = useState<PrescriptionItem[]>(mockQueue);
  const [selectedRx, setSelectedRx] = useState<PrescriptionItem | null>(null);

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" as const } : item))
    );
    if (selectedRx?.id === id) {
      setSelectedRx(null);
    }
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "rejected" as const } : item))
    );
    if (selectedRx?.id === id) {
      setSelectedRx(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
              Schedule H / H1 Tele-Verification Desk
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pharmacist Prescription Verification Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Validate Registered Medical Practitioner (RMP) credentials and approve regulated Indian pharmaceutical dispensing.
          </p>
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/50">
                <th className="py-3.5 px-6 font-semibold">Prescription ID</th>
                <th className="py-3.5 px-4 font-semibold">Patient Profile</th>
                <th className="py-3.5 px-4 font-semibold">Prescribing Doctor & Reg No.</th>
                <th className="py-3.5 px-4 font-semibold">Regulated Formulations</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {queue.map((rx) => (
                <tr key={rx.id} className="hover:bg-slate-900/40 transition-colors">
                  {/* ID */}
                  <td className="py-4 px-6">
                    <span className="font-mono font-bold text-blue-400">{rx.id}</span>
                    <p className="text-[10px] text-slate-500">{rx.date}</p>
                  </td>

                  {/* Patient */}
                  <td className="py-4 px-4">
                    <p className="font-bold text-white">
                      {rx.patientName} ({rx.age} {rx.gender.charAt(0)})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {rx.city} • PIN: {rx.pinCode}
                    </p>
                  </td>

                  {/* Doctor & Reg */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-200">{rx.doctorName}</p>
                    <p className="text-[11px] font-mono text-emerald-400">
                      RMP Reg: {rx.doctorRegNo}
                    </p>
                    <p className="text-[10px] text-slate-500">{rx.clinic}</p>
                  </td>

                  {/* Formulations */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      {rx.medications.map((med, idx) => (
                        <p key={idx} className="text-slate-300 font-medium truncate max-w-xs">
                          • {med}
                        </p>
                      ))}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {rx.status === "pending" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300">
                        <Clock className="w-3 h-3" />
                        Pending Review
                      </span>
                    ) : rx.status === "approved" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified & Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        <XCircle className="w-3 h-3" />
                        Rejected (Invalid Rx)
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedRx(rx)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Rx</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-lg text-white">
                  Clinical Review: {selectedRx.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedRx(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Details */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>Patient Profile</span>
                  </div>
                  <p className="text-white font-bold text-sm">{selectedRx.patientName}</p>
                  <p className="text-slate-300">
                    Age: {selectedRx.age} • Gender: {selectedRx.gender}
                  </p>
                  <p className="text-slate-400">Phone: {selectedRx.phone}</p>
                  <p className="text-slate-400">
                    Location: {selectedRx.city} (PIN {selectedRx.pinCode})
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Prescribing Practitioner (RMP)</span>
                  </div>
                  <p className="text-white font-bold text-sm">{selectedRx.doctorName}</p>
                  <p className="font-mono text-emerald-400 font-bold">
                    Medical Council Reg: {selectedRx.doctorRegNo}
                  </p>
                  <p className="text-slate-400">{selectedRx.clinic}</p>
                </div>
              </div>

              {/* Right Rx Document Mock Preview */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Prescribed Dosage & Schedule
                  </p>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 mb-4">
                    {selectedRx.medications.map((med, i) => (
                      <p key={i} className="text-white font-mono text-xs">
                        {med}
                      </p>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <p className="text-emerald-400 font-semibold">✓ Doctor signature verified</p>
                    <p className="text-emerald-400 font-semibold">✓ Prescription is within 6-month validity</p>
                    <p className="text-emerald-400 font-semibold">✓ Dosage falls within therapeutic safety window</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleReject(selectedRx.id)}
                    className="flex-1 font-bold text-xs"
                  >
                    Reject Rx
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApprove(selectedRx.id)}
                    className="flex-1 font-bold text-xs bg-emerald-600 hover:bg-emerald-500"
                  >
                    Approve & Dispense
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
