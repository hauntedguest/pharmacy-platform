"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import CinematicScene from "./CinematicScene";

interface CinematicCanvasProps {
  scrollProgress: number;
}

function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900" />
  );
}

export default function CinematicCanvas({ scrollProgress }: CinematicCanvasProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [webglFailed, setWebglFailed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };
    checkMobile();

    // Check WebGL support
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl2") || testCanvas.getContext("webgl");
      if (!gl) {
        setWebglFailed(true);
      }
    } catch {
      setWebglFailed(true);
    }
  }, []);

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (animFrameRef.current) return;
      animFrameRef.current = requestAnimationFrame(() => {
        const x = (clientX / window.innerWidth) * 2 - 1;
        const y = -(clientY / window.innerHeight) * 2 + 1;
        setMousePosition({ x, y });
        animFrameRef.current = null;
      });
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handlePointerMove(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [handlePointerMove]);

  if (webglFailed) {
    return <WebGLFallback />;
  }

  // Mobile-optimized settings: lower DPR, fewer segments, simpler shaders
  const dprRange: [number, number] = isMobile ? [1, 1.5] : [1, 2];

  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: isMobile ? "default" : "high-performance",
          stencil: false,
          depth: true,
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={dprRange}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          // Limit pixel ratio on mobile to prevent GPU overload
          if (isMobile) {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          }
        }}
      >
        <Suspense fallback={null}>
          <CinematicScene
            scrollProgress={scrollProgress}
            mousePosition={mousePosition}
            isMobile={isMobile}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
