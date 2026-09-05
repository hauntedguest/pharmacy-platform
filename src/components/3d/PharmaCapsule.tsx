"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface PharmaCapsuleProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
}

export default function PharmaCapsule({ scrollProgress, mousePosition }: PharmaCapsuleProps) {
  const topHalfRef = useRef<THREE.Group>(null);
  const bottomHalfRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!topHalfRef.current || !bottomHalfRef.current) return;

    // Parallax tilt based on mouse position (Act I)
    const targetRotationX = mousePosition.y * 0.2;
    const targetRotationY = mousePosition.x * 0.2;

    if (scrollProgress < 0.25) {
      topHalfRef.current.rotation.x = THREE.MathUtils.damp(
        topHalfRef.current.rotation.x,
        targetRotationX,
        3,
        delta
      );
      topHalfRef.current.rotation.y = THREE.MathUtils.damp(
        topHalfRef.current.rotation.y,
        targetRotationY,
        3,
        delta
      );
      bottomHalfRef.current.rotation.x = topHalfRef.current.rotation.x;
      bottomHalfRef.current.rotation.y = topHalfRef.current.rotation.y;
    }

    // Act II: Capsule Deconstruction (25% - 50%)
    if (scrollProgress >= 0.25 && scrollProgress < 0.5) {
      const deconstructProgress = (scrollProgress - 0.25) / 0.25; // 0 to 1

      // Separate the halves
      const separation = deconstructProgress * 1.5;
      topHalfRef.current.position.y = THREE.MathUtils.damp(
        topHalfRef.current.position.y,
        separation,
        5,
        delta
      );
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(
        bottomHalfRef.current.position.y,
        -separation,
        5,
        delta
      );

      // Rotate halves during separation
      topHalfRef.current.rotation.x = deconstructProgress * Math.PI * 0.3;
      bottomHalfRef.current.rotation.x = -deconstructProgress * Math.PI * 0.3;
    }

    // Act III: Reassemble & Position (50% - 75%)
    if (scrollProgress >= 0.5 && scrollProgress < 0.75) {
      const assembleProgress = (scrollProgress - 0.5) / 0.25;

      // Bring halves back together
      const targetY = 1.5 - assembleProgress * 1.5;
      topHalfRef.current.position.y = THREE.MathUtils.damp(
        topHalfRef.current.position.y,
        targetY,
        5,
        delta
      );
      bottomHalfRef.current.position.y = THREE.MathUtils.damp(
        bottomHalfRef.current.position.y,
        -targetY,
        5,
        delta
      );
    }

    // Act IV: Scale down & position to corner (75% - 100%)
    if (scrollProgress >= 0.75) {
      const scaleProgress = (scrollProgress - 0.75) / 0.25;
      const targetScale = 1 - scaleProgress * 0.4;

      topHalfRef.current.scale.setScalar(
        THREE.MathUtils.damp(topHalfRef.current.scale.x, targetScale, 5, delta)
      );
      bottomHalfRef.current.scale.setScalar(
        THREE.MathUtils.damp(bottomHalfRef.current.scale.x, targetScale, 5, delta)
      );
    }
  });

  return (
    <group>
      {/* Top Half - Blue */}
      <group ref={topHalfRef} position={[0, 0, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.8, 32, 64]} />
          <MeshTransmissionMaterial
            color="#2563EB"
            thickness={0.3}
            roughness={0.1}
            transmission={0.95}
            ior={1.45}
            chromaticAberration={0.02}
            backside
          />
        </mesh>
      </group>

      {/* Bottom Half - Teal */}
      <group ref={bottomHalfRef} position={[0, 0, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.8, 32, 64]} />
          <MeshTransmissionMaterial
            color="#0D9488"
            thickness={0.3}
            roughness={0.1}
            transmission={0.95}
            ior={1.45}
            chromaticAberration={0.02}
            backside
          />
        </mesh>
      </group>
    </group>
  );
}
