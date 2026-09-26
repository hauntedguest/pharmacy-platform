"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import CinematicScene from "./CinematicScene";

interface CinematicCanvasProps {
  scrollProgress: number;
}

export default function CinematicCanvas({ scrollProgress }: CinematicCanvasProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (animFrameRef.current) return;

      animFrameRef.current = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
        animFrameRef.current = null;
      });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (animFrameRef.current || !e.touches[0]) return;

      animFrameRef.current = requestAnimationFrame(() => {
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
        animFrameRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full relative pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.6 }}
      >
        <Suspense fallback={null}>
          <CinematicScene scrollProgress={scrollProgress} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
}

