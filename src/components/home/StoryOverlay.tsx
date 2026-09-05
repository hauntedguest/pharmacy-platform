"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

interface StoryOverlayProps {
  scrollProgress: number;
}

export default function StoryOverlay({ scrollProgress }: StoryOverlayProps) {
  // Act I: 0-25%
  const act1Opacity = scrollProgress < 0.25 ? 1 : Math.max(0, 1 - (scrollProgress - 0.25) / 0.05);

  // Act II: 25-50%
  const act2Opacity =
    scrollProgress >= 0.2 && scrollProgress < 0.5
      ? Math.min(1, (scrollProgress - 0.2) / 0.05) * (1 - Math.max(0, (scrollProgress - 0.45) / 0.05))
      : 0;

  // Act III: 50-75%
  const act3Opacity =
    scrollProgress >= 0.45 && scrollProgress < 0.75
      ? Math.min(1, (scrollProgress - 0.45) / 0.05) * (1 - Math.max(0, (scrollProgress - 0.7) / 0.05))
      : 0;

  // Act IV: 75-100%
  const act4Opacity = scrollProgress >= 0.7 ? Math.min(1, (scrollProgress - 0.7) / 0.05) : 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6 md:px-12">
      {/* Act I: The Monolith (0-25%) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: act1Opacity }}
      >
        <Badge variant="info" className="mb-6 backdrop-blur-md">
          Pharmaceutical Grade Formulation
        </Badge>
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight mb-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: act1Opacity, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Precision Medicine.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-teal-400 to-blue-500">
            Engineered for Human Potential.
          </span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-blue-100 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: act1Opacity * 0.9, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Cellular-level formulation. Clinical validation. Human results.
        </motion.p>
      </motion.div>

      {/* Act II: The Deconstruction (25-50%) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: act2Opacity }}
      >
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8"
          style={{ opacity: act2Opacity }}
        >
          Formulated at the
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
            Cellular Level.
          </span>
        </motion.h2>
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20"
            style={{ opacity: act2Opacity }}
          >
            <div className="text-5xl md:text-6xl font-bold text-cyan-300 mb-2">99.8%</div>
            <div className="text-sm md:text-base text-blue-100">Bioavailability</div>
          </motion.div>
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20"
            style={{ opacity: act2Opacity }}
          >
            <div className="text-5xl md:text-6xl font-bold text-blue-300 mb-2">0.001µm</div>
            <div className="text-sm md:text-base text-blue-100">Micro-encapsulation</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Act III: The Purity Synthesis (50-75%) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: act3Opacity }}
      >
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          style={{ opacity: act3Opacity }}
        >
          Clinically Validated.
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Certified Purity.
          </span>
        </motion.h2>
        <div className="flex flex-wrap gap-4 justify-center max-w-3xl">
          {["FDA Registered", "GMP Certified", "Batch Tested", "Third-Party Verified"].map(
            (badge, i) => (
              <motion.div
                key={badge}
                className="backdrop-blur-sm bg-white/90 rounded-full px-6 py-3 border border-gray-200"
                style={{
                  opacity: act3Opacity,
                }}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-sm md:text-base font-semibold text-gray-900">
                  {badge}
                </span>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Act IV: The Ecosystem (75-100%) */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: act4Opacity }}
      >
        <motion.h2
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
          style={{ opacity: act4Opacity }}
        >
          Explore the
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
            Future of Pharmacy.
          </span>
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl"
          style={{ opacity: act4Opacity * 0.9 }}
        >
          Discover our complete range of precision-formulated pharmaceutical solutions.
        </motion.p>
      </motion.div>
    </div>
  );
}
