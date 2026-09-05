import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { brandConfig } from "@/lib/config/brand";

export const metadata: Metadata = {
  title: {
    default: brandConfig.seo.defaultTitle,
    template: `%s | ${brandConfig.company.name}`,
  },
  description: brandConfig.seo.defaultDescription,
  keywords: [...brandConfig.seo.keywords],
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
