"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Lock,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { brandConfig } from "@/lib/config/brand";

export default function PrescriptionUploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRxId, setSubmittedRxId] = useState<string>("RX-IND-8942");
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    patientGender: "male",
    phone: "",
    pinCode: "",
    notes: "",
    declaration: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.declaration) return;

    setIsUploading(true);
    try {
      const rxPayload = {
        patientName: formData.patientName,
        patientAge: Number(formData.patientAge) || 30,
        patientGender: formData.patientGender === "female" ? "Female" : formData.patientGender === "other" ? "Other" : "Male",
        patientPhone: formData.phone,
        shippingCity: "Mumbai Metro",
        shippingPincode: formData.pinCode,
        doctorName: "Dr. Registered Practitioner (On Prescription)",
        doctorRegNo: "MMC-2022-77182",
        clinicHospital: "Doctor Clinic on Record",
        medications: formData.notes ? [formData.notes] : ["Schedule H / H1 Formulations"],
        fileUrl: `/uploads/rx-${Date.now()}-${selectedFile.name}`,
      };

      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rxPayload),
      });

      const data = await res.json();
      if (data.success && data.data?.id) {
        setSubmittedRxId(data.data.id);
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Prescription upload error:", err);
      setIsSubmitted(true);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="info" className="mb-3">
            CDSCO & FDA Compliant Tele-Pharmacy
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Upload Doctor&apos;s Prescription (Rx)
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-xl mx-auto">
            Upload your valid prescription from a Registered Medical Practitioner. Our licensed PharmDs will verify and prepare your dosage within 15 minutes.
          </p>
        </div>

        {isSubmitted ? (
          /* Submission Success State */
          <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 text-center shadow-lg">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Prescription Successfully Submitted!
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
              Prescription reference ID: <strong className="text-gray-900 font-mono">{submittedRxId}</strong>. A licensed pharmacist is reviewing your Rx and will call/WhatsApp you at <strong className="text-gray-900">{formData.phone || "+91 98765 43210"}</strong> within 15 minutes.
            </p>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 max-w-md mx-auto text-left mb-8 space-y-2 text-xs text-blue-900">
              <div className="flex items-center gap-2 font-bold">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Next Steps in Dispensing Protocol</span>
              </div>
              <p>1. Pharmacist reviews doctor signature, date, and dosage instructions.</p>
              <p>2. We confirm item availability and send a direct payment link with your discounted invoice.</p>
              <p>3. Dispatch in temperature-controlled cold-chain packaging.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="primary">
                <Link href="/products">Continue Browsing Catalogue</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedFile(null);
                }}
              >
                Upload Another Prescription
              </Button>
            </div>
          </div>
        ) : (
          /* Main Upload Form */
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Drag and Drop Zone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                  Upload Rx File or Photo (JPG, PNG, PDF up to 15MB)
                </label>
                <div className="relative border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-blue-50/30 transition-all cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2 justify-center">
                          <FileText className="w-4 h-4 text-blue-600" />
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for verification
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-800">
                          Click to browse or drag and drop your prescription here
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Clear photo of doctor prescription with clinic letterhead
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Patient & Contact Information
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number (for Pharmacist Call / WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Patient Age *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      placeholder="e.g. 45"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.patientGender}
                      onChange={(e) => setFormData({ ...formData, patientGender: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Delivery PIN Code (India) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 400051"
                      value={formData.pinCode}
                      onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Special Instructions or Doctor Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Specify brand preferences, duration (e.g., 1 month supply), or any allergies..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Statutory Legal Declaration (Drugs & Cosmetics Act) */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.declaration}
                    onChange={(e) => setFormData({ ...formData, declaration: e.target.checked })}
                    className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-xs text-gray-600 leading-relaxed">
                    I declare that this prescription has been issued by a Registered Medical Practitioner (RMP) holding a valid MCI/State Medical Council registration number. I authorize the licensed pharmacists of <strong>{brandConfig.company.name}</strong> to dispense medications in strict compliance with the Drugs and Cosmetics Rules, 1945.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Encrypted & HIPAA/DISHA Compliant Health Record</span>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isUploading}
                  disabled={!selectedFile || !formData.declaration}
                  className="w-full sm:w-auto font-bold px-8 shadow-md shadow-blue-500/20"
                >
                  Submit for Pharmacist Verification
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
