"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PharmaCapsuleProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

export default function PharmaCapsule({ scrollProgress, mousePosition }: PharmaCapsuleProps) {
  const capsuleGroupRef = useRef<THREE.Group>(null);
  const topHalfRef = useRef<THREE.Group>(null);
  const bottomHalfRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state, rawDelta) => {
    // Clamp delta to prevent jerky jumps on lag spikes
    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;

    if (!capsuleGroupRef.current || !topHalfRef.current || !bottomHalfRef.current) return;

    // Smooth ambient floating idle rotation
    const ambientRotX = Math.sin(time * 0.8) * 0.08;
    const ambientRotY = time * 0.25;
    const ambientFloatY = Math.sin(time * 1.5) * 0.06;

    // Mouse parallax target
    const targetParallaxX = mousePosition.y * 0.25;
    const targetParallaxY = mousePosition.x * 0.25;

    // Apply base floating and rotation to overall capsule group
    capsuleGroupRef.current.position.y = THREE.MathUtils.damp(
      capsuleGroupRef.current.position.y,
      ambientFloatY,
      3,
      delta
    );

    // Global rotation combines ambient spin + mouse parallax
    capsuleGroupRef.current.rotation.x = THREE.MathUtils.damp(
      capsuleGroupRef.current.rotation.x,
      ambientRotX + targetParallaxX,
      3,
      delta
    );
    capsuleGroupRef.current.rotation.y = THREE.MathUtils.damp(
      capsuleGroupRef.current.rotation.y,
      ambientRotY + targetParallaxY,
      2,
      delta
    );

    // Act I: Unified Intact Capsule (0% - 25%)
    if (scrollProgress < 0.25) {
      topHalfRef.current.position.y = THREE.MathUtils.damp(
        topHalfRef.current.position.y,
        0.28,
        4,
        delta
      );
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(
        bottomHalfRef.current.position.y,
        -0.28,
        4,
        delta
      );
      topHalfRef.current.rotation.x = THREE.MathUtils.damp(topHalfRef.current.rotation.x, 0, 4, delta);
      bottomHalfRef.current.rotation.x = THREE.MathUtils.damp(bottomHalfRef.current.rotation.x, 0, 4, delta);
      topHalfRef.current.scale.setScalar(THREE.MathUtils.damp(topHalfRef.current.scale.x, 1, 4, delta));
      bottomHalfRef.current.scale.setScalar(THREE.MathUtils.damp(bottomHalfRef.current.scale.x, 1, 4, delta));
      if (coreRef.current) {
        coreRef.current.scale.setScalar(THREE.MathUtils.damp(coreRef.current.scale.x, 1, 4, delta));
      }
    }
    // Act II: Precision Molecular Deconstruction (25% - 50%)
    else if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
      const p = (scrollProgress - 0.25) / 0.25; // 0 to 1
      const separation = 0.28 + p * 1.35;

      topHalfRef.current.position.y = THREE.MathUtils.damp(
        topHalfRef.current.position.y,
        separation,
        4,
        delta
      );
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(
        bottomHalfRef.current.position.y,
        -separation,
        4,
        delta
      );

      topHalfRef.current.rotation.x = THREE.MathUtils.damp(
        topHalfRef.current.rotation.x,
        p * 0.45,
        4,
        delta
      );
      bottomHalfRef.current.rotation.x = THREE.MathUtils.damp(
        bottomHalfRef.current.rotation.x,
        -p * 0.45,
        4,
        delta
      );

      if (coreRef.current) {
        coreRef.current.scale.setScalar(
          THREE.MathUtils.damp(coreRef.current.scale.x, 1 + p * 0.4, 4, delta)
        );
      }
    }
    // Act III: Cellular Purity Reassembly & Alignment (50% - 75%)
    else if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
      const p = (scrollProgress - 0.5) / 0.25;
      const targetSep = 0.28 + (1 - p) * 1.35;

      topHalfRef.current.position.y = THREE.MathUtils.damp(
        topHalfRef.current.position.y,
        targetSep,
        4,
        delta
      );
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(
        bottomHalfRef.current.position.y,
        -targetSep,
        4,
        delta
      );

      topHalfRef.current.rotation.x = THREE.MathUtils.damp(
        topHalfRef.current.rotation.x,
        (1 - p) * 0.45,
        4,
        delta
      );
      bottomHalfRef.current.rotation.x = THREE.MathUtils.damp(
        bottomHalfRef.current.rotation.x,
        -(1 - p) * 0.45,
        4,
        delta
      );
    }
    // Act IV: Ecosystem Synthesis (75% - 100%)
    else {
      const p = (scrollProgress - 0.75) / 0.25;
      const targetScale = 1 - p * 0.35;

      topHalfRef.current.position.y = THREE.MathUtils.damp(topHalfRef.current.position.y, 0.28, 4, delta);
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(bottomHalfRef.current.position.y, -0.28, 4, delta);
      topHalfRef.current.scale.setScalar(
        THREE.MathUtils.damp(topHalfRef.current.scale.x, targetScale, 4, delta)
      );
      bottomHalfRef.current.scale.setScalar(
        THREE.MathUtils.damp(bottomHalfRef.current.scale.x, targetScale, 4, delta)
      );
    }
  });

  return (
    <group ref={capsuleGroupRef}>
      {/* Central Bio-Core / Luminescent Ring */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.395, 0.395, 0.12, 32]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.6}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Top Half - Precision Blue Optical Shell */}
      <group ref={topHalfRef} position={[0, 0.28, 0]}>
        <mesh position={[0, 0.32, 0]}>
          <capsuleGeometry args={[0.39, 0.65, 16, 32]} />
          <meshPhysicalMaterial
            color="#2563EB"
            emissive="#1E40AF"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transmission={0.85}
            thickness={0.5}
            ior={1.48}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* Bottom Half - Bioavailable Teal Optical Shell */}
      <group ref={bottomHalfRef} position={[0, -0.28, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.39, 0.65, 16, 32]} />
          <meshPhysicalMaterial
            color="#0D9488"
            emissive="#042F2E"
            emissiveIntensity={0.15}
            roughness={0.1}
            metalness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transmission={0.85}
            thickness={0.5}
            ior={1.48}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </group>
  );
}
