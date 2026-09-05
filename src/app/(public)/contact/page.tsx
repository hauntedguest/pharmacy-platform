"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Send,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { brandConfig } from "@/lib/config/brand";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "Prescription Query",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "Prescription Query",
        message: "",
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            24x7 India Pharmacist Care
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Consult with Our Licensed Pharmacists
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Have questions about your prescription, dosage schedules, or cold-chain delivery? Our clinical team in Mumbai is here to help 24x7.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Contact Info & Headquarters (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channels */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="font-bold text-base text-gray-900 pb-3 border-b border-gray-100">
                Direct Indian Helplines
              </h2>

              <div className="space-y-4 text-xs">
                <a
                  href={`tel:${brandConfig.contact.phone}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{brandConfig.contact.phone}</p>
                    <p className="text-gray-500 text-[11px]">Toll-Free All-India Pharmacist Line (24x7)</p>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${brandConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{brandConfig.contact.whatsapp}</p>
                    <p className="text-gray-500 text-[11px]">WhatsApp Prescription Instant Desk</p>
                  </div>
                </a>

                <a
                  href={`mailto:${brandConfig.contact.email}`}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{brandConfig.contact.email}</p>
                    <p className="text-gray-500 text-[11px]">Official Support & Clinical Inquiries</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Corporate Location */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Central Pharmacy & Headquarters</span>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {brandConfig.company.name} Private Limited<br />
                {brandConfig.contact.address.street}<br />
                {brandConfig.contact.address.city}, {brandConfig.contact.address.state} - {brandConfig.contact.address.zip}, India
              </p>
              <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
                <p>Drug License: {brandConfig.legal.pharmacyLicense}</p>
                <p>FSSAI: {brandConfig.legal.fssaiLicense}</p>
              </div>
            </div>
          </div>

          {/* Right: Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs">
              <h2 className="font-bold text-lg text-gray-900 mb-1">
                Send a Clinical or Order Inquiry
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Our team of Registered Pharmacists will respond within 15 minutes.
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-bold text-base text-emerald-900">Message Received</h3>
                  <p className="text-xs text-emerald-800">
                    Thank you! A pharmacist has been assigned to your query and will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98201 XXXXX"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Inquiry Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Prescription Query">Doctor Prescription (Schedule H) Verification</option>
                      <option value="Cold-Chain Delivery">Cold-Chain Temperature Tracking</option>
                      <option value="Medicine Availability">Formulation Availability / Bulk Order</option>
                      <option value="Billing & Tax">GST Invoice / Payment Query</option>
                      <option value="Other">Other Pharmacist Inquiries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please mention your medicine requirements, doctor's prescription ID, or specific inquiry..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit to Dispensing Pharmacist
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
