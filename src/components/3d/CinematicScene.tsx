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
}

export default function CinematicScene({ scrollProgress, mousePosition }: CinematicSceneProps) {
  const cameraGroupRef = useRef<THREE.Group>(null);
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  const { size } = useThree();

  // Determine viewport aspect ratio and mobile state
  const isPortraitMobile = size.width < 768 && size.height > size.width;
  const aspect = size.width / Math.max(1, size.height);
  // On portrait mobile, calculate responsive camera distance so 3D objects are never clipped
  const baseCameraZ = isPortraitMobile ? Math.min(7.2, 4.8 / Math.max(0.62, aspect * 1.25)) : 4.8;
  const verticalShift = isPortraitMobile ? 0.35 : 0;

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (cameraGroupRef.current) {
      // Act I (0-25%): Macro frontal view with interactive touch/mouse parallax
      if (scrollProgress < 0.25) {
        const targetX = mousePosition.x * (isPortraitMobile ? 0.15 : 0.25);
        const targetY = -mousePosition.y * (isPortraitMobile ? 0.15 : 0.25) + verticalShift;
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          targetX,
          3,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          targetY,
          3,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          baseCameraZ,
          3,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          mousePosition.x * 0.1,
          3,
          delta
        );
      }
      // Act II (25%-50%): Fly into the dispersed particle core
      else if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
        const p = (scrollProgress - 0.25) / 0.25;
        const pushDistance = isPortraitMobile ? 2.0 : 2.6;
        const targetZ = baseCameraZ - p * pushDistance;
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          targetZ,
          4,
          delta
        );
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          0,
          4,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          verticalShift * (1 - p),
          4,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          p * 0.35,
          4,
          delta
        );
      }
      // Act III (50%-75%): Pull back to view the whole synthesized crystal lattice
      else if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
        const p = (scrollProgress - 0.5) / 0.25;
        // Restrict horizontal offset on mobile so it stays centered
        const targetX = isPortraitMobile ? p * 0.25 : p * 1.8;
        const targetZ = baseCameraZ - (isPortraitMobile ? 2.0 : 2.6) + p * (isPortraitMobile ? 3.0 : 3.4);
        const targetY = isPortraitMobile ? 0 : p * 0.4;

        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          targetX,
          3.5,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          targetY,
          3.5,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          targetZ,
          3.5,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          0.35 - p * 0.7,
          3.5,
          delta
        );
      }
      // Act IV (75%-100%): Float peacefully into ambient background
      else {
        const p = (scrollProgress - 0.75) / 0.25;
        const targetX = isPortraitMobile ? 0.25 + p * 0.25 : 1.8 + p * 1.2;
        const targetZ = baseCameraZ + (isPortraitMobile ? 0.8 : 0.8) + p * 1.5;

        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          targetX,
          3,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          targetZ,
          3,
          delta
        );
      }
    }

    if (mainLightRef.current) {
      const targetIntensity = scrollProgress > 0.5 ? 2.0 : 1.6;
      mainLightRef.current.intensity = THREE.MathUtils.damp(
        mainLightRef.current.intensity,
        targetIntensity,
        2,
        delta
      );
    }
  });

  return (
    <>
      {/* Optimized Studio Lighting with Vibrant Ambient and Specular Fills */}
      <ambientLight intensity={0.85} />
      <directionalLight ref={mainLightRef} position={[5, 7, 5]} intensity={1.8} color="#FFFFFF" />
      <directionalLight position={[-5, -3, -4]} intensity={0.8} color="#0D9488" />
      <pointLight position={[0, 1.5, 3]} intensity={1.2} color="#60A5FA" distance={12} />
      <pointLight position={[0, -1.5, 2]} intensity={1.0} color="#2DD4BF" distance={10} />

      {/* Camera Rig & 3D Objects */}
      <group ref={cameraGroupRef}>
        <PharmaCapsule scrollProgress={scrollProgress} mousePosition={mousePosition} />
        <MicroPelletField scrollProgress={scrollProgress} count={120} />
        <MolecularDust count={60} />
      </group>
    </>
  );
}
