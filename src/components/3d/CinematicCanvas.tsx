"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import CinematicScene from "./CinematicScene";

interface CinematicCanvasProps {
  scrollProgress: number;
}

export default function CinematicCanvas({ scrollProgress }: CinematicCanvasProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]} // Crisp rendering up to 2x pixel ratio
      >
        <Suspense fallback={null}>
          <CinematicScene
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
