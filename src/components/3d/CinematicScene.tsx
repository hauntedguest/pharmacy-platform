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

  useFrame((state, delta) => {
    // Camera Choreography across Acts
    if (cameraGroupRef.current) {
      // Act I (0-25%): Macro frontal view with subtle mouse parallax
      if (scrollProgress < 0.25) {
        const targetX = mousePosition.x * 0.3;
        const targetY = -mousePosition.y * 0.3;
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          targetX,
          4,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          targetY,
          4,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          5,
          4,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          mousePosition.x * 0.1,
          4,
          delta
        );
      }

      // Act II (25%-50%): Fly directly into the particle vortex
      else if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
        const p = (scrollProgress - 0.25) / 0.25;
        const targetZ = 5 - p * 3.2; // Push in close to particles (z: 1.8)
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          targetZ,
          5,
          delta
        );
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          0,
          5,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          0,
          5,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          p * 0.4,
          5,
          delta
        );
      }

      // Act III (50%-75%): Orbit 45° and pull back to view the whole synthesized lattice
      else if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
        const p = (scrollProgress - 0.5) / 0.25;
        const targetX = p * 2.5;
        const targetZ = 1.8 + p * 4.2; // Pull back to z: 6.0
        const targetY = p * 0.6;

        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          targetX,
          4,
          delta
        );
        cameraGroupRef.current.position.y = THREE.MathUtils.damp(
          cameraGroupRef.current.position.y,
          targetY,
          4,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          targetZ,
          4,
          delta
        );
        cameraGroupRef.current.rotation.y = THREE.MathUtils.damp(
          cameraGroupRef.current.rotation.y,
          0.4 - p * 0.8,
          4,
          delta
        );
      }

      // Act IV (75%-100%): Float peacefully into ambient background
      else {
        const p = (scrollProgress - 0.75) / 0.25;
        cameraGroupRef.current.position.x = THREE.MathUtils.damp(
          cameraGroupRef.current.position.x,
          2.5 + p * 1.5,
          3,
          delta
        );
        cameraGroupRef.current.position.z = THREE.MathUtils.damp(
          cameraGroupRef.current.position.z,
          6.0 + p * 2.0,
          3,
          delta
        );
      }
    }

    // Dynamic light color/intensity across acts
    if (mainLightRef.current) {
      if (scrollProgress > 0.5) {
        // Warmer/brighter for trust & medical purity
        mainLightRef.current.intensity = THREE.MathUtils.damp(
          mainLightRef.current.intensity,
          2.0,
          2,
          delta
        );
      } else {
        mainLightRef.current.intensity = THREE.MathUtils.damp(
          mainLightRef.current.intensity,
          1.4,
          2,
          delta
        );
      }
    }
  });

  return (
    <>
      {/* Studio Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight
        ref={mainLightRef}
        position={[6, 8, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-6, -4, -4]} intensity={0.6} color="#0D9488" />
      <pointLight position={[0, 0, 2]} intensity={1.2} color="#60A5FA" distance={8} />
      <pointLight position={[0, -2, 0]} intensity={0.8} color="#2DD4BF" distance={6} />

      {/* Camera Rig */}
      <group ref={cameraGroupRef}>
        {/* The 3D Objects */}
        <PharmaCapsule
          scrollProgress={scrollProgress}
          mousePosition={mousePosition}
        />
        <MicroPelletField scrollProgress={scrollProgress} count={160} />
        <MolecularDust count={100} />
      </group>
    </>
  );
}
