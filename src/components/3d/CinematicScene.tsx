"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (cameraGroupRef.current) {
      // Act I (0-25%): Macro frontal view with subtle mouse parallax
      if (scrollProgress < 0.25) {
        const targetX = mousePosition.x * 0.25;
        const targetY = -mousePosition.y * 0.25;
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
          4.8,
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
        const targetZ = 4.8 - p * 2.6; // Push closer to particles (z: 2.2)
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
          0,
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
      // Act III (50%-75%): Orbit 30° and pull back to view the whole synthesized crystal lattice
      else if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
        const p = (scrollProgress - 0.5) / 0.25;
        const targetX = p * 1.8;
        const targetZ = 2.2 + p * 3.4; // Pull back to z: 5.6
        const targetY = p * 0.4;

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
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          1.8 + p * 1.2,
          3,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          5.6 + p * 1.5,
          3,
          delta
        );
      }
    }

    if (mainLightRef.current) {
      const targetIntensity = scrollProgress > 0.5 ? 1.8 : 1.4;
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
      {/* Optimized Studio Lighting without expensive real-time shadow map generation */}
      <ambientLight intensity={0.7} />
      <directionalLight ref={mainLightRef} position={[5, 7, 5]} intensity={1.5} color="#FFFFFF" />
      <directionalLight position={[-5, -3, -4]} intensity={0.6} color="#0D9488" />
      <pointLight position={[0, 0, 3]} intensity={1.0} color="#60A5FA" distance={10} />
      <pointLight position={[0, -2, 1]} intensity={0.7} color="#2DD4BF" distance={8} />

      {/* Camera Rig & 3D Objects */}
      <group ref={cameraGroupRef}>
        <PharmaCapsule scrollProgress={scrollProgress} mousePosition={mousePosition} />
        <MicroPelletField scrollProgress={scrollProgress} count={120} />
        <MolecularDust count={60} />
      </group>
    </>
  );
}
