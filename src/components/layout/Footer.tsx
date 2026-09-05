import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { brandConfig } from "@/lib/config/brand";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { label: "Prescription Medications", href: "/products?category=prescription" },
      { label: "Over-the-Counter", href: "/products?category=otc" },
      { label: "Supplements & Immunity", href: "/products?category=supplement" },
      { label: "Diagnostic Devices", href: "/products?category=medical-device" },
      { label: "Drug Interaction Analyzer", href: "/interaction-checker" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
    support: [
      { label: "Pill Subscriptions & Refills", href: "/account/refills" },
      { label: "Prescription Vault", href: "/account/prescriptions" },
      { label: "Shipping & Cold-Chain Info", href: "/about" },
      { label: "Help Center & WhatsApp", href: "/contact" },
      { label: "FAQ", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: brandConfig.legal.privacyUrl },
      { label: "Terms of Service", href: brandConfig.legal.termsUrl },
      { label: "Pharmacy License", href: "/license" },
    ],
  };

  const socialLinks = [
    { href: brandConfig.social.facebook, label: "Facebook" },
    { href: brandConfig.social.twitter, label: "Twitter" },
    { href: brandConfig.social.instagram, label: "Instagram" },
    { href: brandConfig.social.linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#14b8a6] flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <p className="font-bold text-lg text-white leading-tight">
                  {brandConfig.company.name}
                </p>
                <p className="text-xs text-gray-400 leading-tight">
                  {brandConfig.company.tagline}
                </p>
              </div>
            </div>
            <p className="text-sm mb-4 text-gray-400">
              {brandConfig.company.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#14b8a6]" />
                <span>
                  {brandConfig.contact.address.street},{" "}
                  {brandConfig.contact.address.city},{" "}
                  {brandConfig.contact.address.state}{" "}
                  {brandConfig.contact.address.zip}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#14b8a6]" />
                <a
                  href={`tel:${brandConfig.contact.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {brandConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#14b8a6]" />
                <a
                  href={`mailto:${brandConfig.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  {brandConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0 text-[#14b8a6]" />
                <span>{brandConfig.contact.hours}</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-white mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="font-semibold text-white mb-2">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Get health tips, product updates, and exclusive offers.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6]"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} {brandConfig.company.name}. All rights reserved.
              {" | "}
              License: {brandConfig.legal.pharmacyLicense}
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#3b82f6] hover:text-white transition-colors text-sm font-medium"
                  aria-label={label}
                >
                  {label.charAt(0)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
