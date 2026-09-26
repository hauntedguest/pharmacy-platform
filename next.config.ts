import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

// Automatically ensure no duplicate dynamic route folders conflict in Next.js router
const conflictingPaths = [
  path.join(process.cwd(), "src/app/api/batches/[id]"),
  path.join(process.cwd(), "src/app/api/pincode/[pincode]"),
  path.join(process.cwd(), "src/app/api/products/[id]"),
  path.join(process.cwd(), "src/app/(public)/products/[slug]/.page.tsx.swp"),
];

for (const p of conflictingPaths) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup error
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
