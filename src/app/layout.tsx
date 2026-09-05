import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { brandConfig } from "@/lib/config/brand";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: brandConfig.seo.defaultTitle,
    template: `%s | ${brandConfig.company.name}`,
  },
  description: brandConfig.seo.defaultDescription,
  keywords: [...brandConfig.seo.keywords],
  metadataBase: new URL(brandConfig.company.website),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brandConfig.company.website,
    siteName: brandConfig.company.name,
    title: brandConfig.seo.defaultTitle,
    description: brandConfig.seo.defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: brandConfig.seo.defaultTitle,
    description: brandConfig.seo.defaultDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
