"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import PharmaCapsule from "./PharmaCapsule";
import MicroPelletField from "./MicroPelletField";
import MolecularDust from "./MolecularDust";

interface CinematicSceneProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  isMobile: boolean;
}

export default function CinematicScene({
  scrollProgress,
  mousePosition,
  isMobile,
}: CinematicSceneProps) {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const { size } = useThree();

  const isPortrait = size.width < size.height;
  const aspect = size.width / Math.max(1, size.height);

  // Camera distance: pull further back on narrow portrait screens so the
  // capsule is never clipped. On wide desktops keep it closer for drama.
  const baseCameraZ = isPortrait
    ? Math.min(8, 5.5 / Math.max(0.45, aspect))
    : 5;

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (!cameraGroupRef.current) return;
    const cam = cameraGroupRef.current;

    // ---- ACT I: Hero frontal view (0–25%) ----
    if (scrollProgress < 0.25) {
      const parallaxScale = isMobile ? 0.08 : 0.2;
      const targetX = mousePosition.x * parallaxScale;
      const targetY = -mousePosition.y * parallaxScale;

      cam.position.x = THREE.MathUtils.damp(cam.position.x, targetX, 3, delta);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, targetY, 3, delta);
      cam.position.z = THREE.MathUtils.damp(cam.position.z, baseCameraZ, 3, delta);
      cam.rotation.y = THREE.MathUtils.damp(cam.rotation.y, mousePosition.x * 0.06, 3, delta);
    }
    // ---- ACT II: Fly into dispersed particles (25–50%) ----
    else if (scrollProgress < 0.5) {
      const p = (scrollProgress - 0.25) / 0.25;
      const pushZ = isMobile ? 1.5 : 2.2;

      cam.position.z = THREE.MathUtils.damp(cam.position.z, baseCameraZ - p * pushZ, 4, delta);
      cam.position.x = THREE.MathUtils.damp(cam.position.x, 0, 4, delta);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, 0, 4, delta);
      cam.rotation.y = THREE.MathUtils.damp(cam.rotation.y, p * 0.25, 4, delta);
    }
    // ---- ACT III: Pull back, view crystal lattice (50–75%) ----
    else if (scrollProgress < 0.75) {
      const p = (scrollProgress - 0.5) / 0.25;
      const pushZ = isMobile ? 1.5 : 2.2;
      const sideX = isMobile ? p * 0.2 : p * 1.2;
      const targetZ = baseCameraZ - pushZ + p * (isMobile ? 2.5 : 3);

      cam.position.x = THREE.MathUtils.damp(cam.position.x, sideX, 3.5, delta);
      cam.position.y = THREE.MathUtils.damp(cam.position.y, isMobile ? 0 : p * 0.3, 3.5, delta);
      cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 3.5, delta);
      cam.rotation.y = THREE.MathUtils.damp(cam.rotation.y, 0.25 - p * 0.5, 3.5, delta);
    }
    // ---- ACT IV: Float into ambient background (75–100%) ----
    else {
      const p = (scrollProgress - 0.75) / 0.25;
      const sideX = isMobile ? 0.2 + p * 0.15 : 1.2 + p * 0.8;

      cam.position.x = THREE.MathUtils.damp(cam.position.x, sideX, 3, delta);
      cam.position.z = THREE.MathUtils.damp(cam.position.z, baseCameraZ + 1 + p * 1.2, 3, delta);
    }

    // Animate main light intensity based on act
    if (mainLightRef.current) {
      const intensity = scrollProgress > 0.5 ? 2.0 : 1.6;
      mainLightRef.current.intensity = THREE.MathUtils.damp(
        mainLightRef.current.intensity,
        intensity,
        2,
        delta
      );
    }
  });

  // Mobile: fewer particles, fewer lights, reduced complexity
  const pelletCount = isMobile ? 50 : 120;
  const dustCount = isMobile ? 25 : 60;

  return (
    <>
      {/* Simplified lighting — 3 lights instead of 5 on mobile */}
      <ambientLight intensity={0.9} />
      <directionalLight
        ref={mainLightRef}
        position={[5, 7, 5]}
        intensity={1.8}
        color="#FFFFFF"
      />
      {!isMobile && (
        <directionalLight position={[-5, -3, -4]} intensity={0.8} color="#0D9488" />
      )}
      <pointLight position={[0, 1.5, 3]} intensity={1.2} color="#60A5FA" distance={12} />
      {!isMobile && (
        <pointLight position={[0, -1.5, 2]} intensity={1.0} color="#2DD4BF" distance={10} />
      )}

      <group ref={cameraGroupRef}>
        <PharmaCapsule
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
          isMobile={isMobile}
        />
        <MicroPelletField scrollProgress={scrollProgress} count={pelletCount} />
        <MolecularDust count={dustCount} />
      </group>
    </>
  );
}
