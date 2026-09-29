"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface PharmaCapsuleProps {
  scrollProgress: number;
  mousePosition: { x: number; y: number };
  isMobile: boolean;
}

export default function PharmaCapsule({
  scrollProgress,
  mousePosition,
  isMobile,
}: PharmaCapsuleProps) {
  const capsuleGroupRef = useRef<THREE.Group>(null);
  const topHalfRef = useRef<THREE.Group>(null);
  const bottomHalfRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  // Geometry detail levels — lower on mobile for performance
  const segmentsRadial = isMobile ? 12 : 16;
  const segmentsHeight = isMobile ? 20 : 32;
  const sphereSegments = isMobile ? 16 : 24;

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const time = state.clock.elapsedTime;

    if (!capsuleGroupRef.current || !topHalfRef.current || !bottomHalfRef.current)
      return;

    const top = topHalfRef.current;
    const bot = bottomHalfRef.current;

    // Ambient idle rotation — gentler on mobile
    const rotSpeed = isMobile ? 0.6 : 0.8;
    const ambientRotX = Math.sin(time * rotSpeed) * 0.08;
    const ambientRotY = time * 0.2;
    const ambientFloat = Math.sin(time * 1.2) * 0.06;

    // Mouse/touch parallax — reduced on mobile
    const pScale = isMobile ? 0.1 : 0.25;

    capsuleGroupRef.current.position.y = THREE.MathUtils.damp(
      capsuleGroupRef.current.position.y,
      ambientFloat,
      3,
      delta
    );
    capsuleGroupRef.current.rotation.x = THREE.MathUtils.damp(
      capsuleGroupRef.current.rotation.x,
      ambientRotX + mousePosition.y * pScale,
      3,
      delta
    );
    capsuleGroupRef.current.rotation.y = THREE.MathUtils.damp(
      capsuleGroupRef.current.rotation.y,
      ambientRotY + mousePosition.x * pScale,
      2,
      delta
    );

    // ---- ACT I: Intact capsule (0–25%) ----
    if (scrollProgress < 0.25) {
      top.position.y = THREE.MathUtils.damp(top.position.y, 0.28, 4, delta);
      bot.position.y = THREE.MathUtils.damp(bot.position.y, -0.28, 4, delta);
      top.rotation.x = THREE.MathUtils.damp(top.rotation.x, 0, 4, delta);
      bot.rotation.x = THREE.MathUtils.damp(bot.rotation.x, 0, 4, delta);
      top.scale.setScalar(THREE.MathUtils.damp(top.scale.x, 1, 4, delta));
      bot.scale.setScalar(THREE.MathUtils.damp(bot.scale.x, 1, 4, delta));
      if (coreRef.current) {
        coreRef.current.scale.setScalar(
          THREE.MathUtils.damp(coreRef.current.scale.x, 1, 4, delta)
        );
      }
    }
    // ---- ACT II: Capsule splits open (25–50%) ----
    else if (scrollProgress < 0.5) {
      const p = (scrollProgress - 0.25) / 0.25;
      const separation = 0.28 + p * 1.35;

      top.position.y = THREE.MathUtils.damp(top.position.y, separation, 4, delta);
      bot.position.y = THREE.MathUtils.damp(bot.position.y, -separation, 4, delta);
      top.rotation.x = THREE.MathUtils.damp(top.rotation.x, p * 0.45, 4, delta);
      bot.rotation.x = THREE.MathUtils.damp(bot.rotation.x, -p * 0.45, 4, delta);

      if (coreRef.current) {
        coreRef.current.scale.setScalar(
          THREE.MathUtils.damp(coreRef.current.scale.x, 1 + p * 0.4, 4, delta)
        );
      }
    }
    // ---- ACT III: Capsule reassembles (50–75%) ----
    else if (scrollProgress < 0.75) {
      const p = (scrollProgress - 0.5) / 0.25;
      const sep = 0.28 + (1 - p) * 1.35;

      top.position.y = THREE.MathUtils.damp(top.position.y, sep, 4, delta);
      bot.position.y = THREE.MathUtils.damp(bot.position.y, -sep, 4, delta);
      top.rotation.x = THREE.MathUtils.damp(top.rotation.x, (1 - p) * 0.45, 4, delta);
      bot.rotation.x = THREE.MathUtils.damp(bot.rotation.x, -(1 - p) * 0.45, 4, delta);
    }
    // ---- ACT IV: Shrink into background (75–100%) ----
    else {
      const p = (scrollProgress - 0.75) / 0.25;
      const s = 1 - p * 0.35;

      top.position.y = THREE.MathUtils.damp(top.position.y, 0.28, 4, delta);
      bot.position.y = THREE.MathUtils.damp(bot.position.y, -0.28, 4, delta);
      top.scale.setScalar(THREE.MathUtils.damp(top.scale.x, s, 4, delta));
      bot.scale.setScalar(THREE.MathUtils.damp(bot.scale.x, s, 4, delta));
    }
  });

  return (
    <group ref={capsuleGroupRef}>
      {/* Central luminescent ring */}
      <mesh ref={coreRef}>
        <cylinderGeometry args={[0.395, 0.395, 0.12, segmentsHeight]} />
        <meshStandardMaterial
          color="#38BDF8"
          emissive="#0284C7"
          emissiveIntensity={0.8}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Top Half — Blue */}
      <group ref={topHalfRef} position={[0, 0.28, 0]}>
        {/* Inner glow core */}
        <mesh position={[0, 0.32, 0]}>
          <sphereGeometry args={[0.26, sphereSegments, sphereSegments]} />
          <meshStandardMaterial
            color="#60A5FA"
            emissive="#2563EB"
            emissiveIntensity={0.7}
            roughness={0.25}
            metalness={0.4}
          />
        </mesh>
        {/* Outer shell — meshStandardMaterial works universally on mobile */}
        <mesh position={[0, 0.32, 0]}>
          <capsuleGeometry args={[0.39, 0.65, segmentsRadial, segmentsHeight]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#1E40AF"
            emissiveIntensity={0.3}
            roughness={0.08}
            metalness={0.35}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* Bottom Half — Teal */}
      <group ref={bottomHalfRef} position={[0, -0.28, 0]}>
        {/* Inner glow core */}
        <mesh position={[0, -0.32, 0]}>
          <sphereGeometry args={[0.26, sphereSegments, sphereSegments]} />
          <meshStandardMaterial
            color="#2DD4BF"
            emissive="#0D9488"
            emissiveIntensity={0.7}
            roughness={0.25}
            metalness={0.4}
          />
        </mesh>
        {/* Outer shell */}
        <mesh position={[0, -0.32, 0]}>
          <capsuleGeometry args={[0.39, 0.65, segmentsRadial, segmentsHeight]} />
          <meshStandardMaterial
            color="#0D9488"
            emissive="#042F2E"
            emissiveIntensity={0.3}
            roughness={0.08}
            metalness={0.35}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>
    </group>
  );
}
