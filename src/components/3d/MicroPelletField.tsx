"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MicroPelletFieldProps {
  scrollProgress: number;
  count?: number;
}

export default function MicroPelletField({
  scrollProgress,
  count = 120,
}: MicroPelletFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const data = [];
    const gridSize = Math.ceil(Math.cbrt(count));

    for (let i = 0; i < count; i++) {
      const initX = (Math.random() - 0.5) * 0.45;
      const initY = (Math.random() - 0.5) * 0.9;
      const initZ = (Math.random() - 0.5) * 0.45;

      const vx = (Math.random() - 0.5) * 2.2;
      const vy = (Math.random() - 0.5) * 2.2;
      const vz = (Math.random() - 0.5) * 2.2;

      const ix = i % gridSize;
      const iy = Math.floor(i / gridSize) % gridSize;
      const iz = Math.floor(i / (gridSize * gridSize));
      const targetX = (ix - gridSize / 2) * 0.22;
      const targetY = (iy - gridSize / 2) * 0.22;
      const targetZ = (iz - gridSize / 2) * 0.22;

      data.push({
        initX, initY, initZ,
        vx, vy, vz,
        targetX, targetY, targetZ,
        scale: Math.random() * 0.022 + 0.015,
        speed: Math.random() * 0.8 + 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i];

      if (scrollProgress < 0.25) {
        // Act I: shimmer inside capsule
        const shimY = Math.sin(time * p.speed + p.phase) * 0.04;
        const shimX = Math.cos(time * p.speed * 0.8 + p.phase) * 0.02;
        dummy.position.set(p.initX + shimX, p.initY + shimY, p.initZ);
        dummy.scale.setScalar(p.scale);
      } else if (scrollProgress < 0.5) {
        // Act II: burst outward
        const progress = (scrollProgress - 0.25) / 0.25;
        const radius = progress * 2.8;
        dummy.position.set(
          p.initX + p.vx * radius,
          p.initY + p.vy * radius,
          p.initZ + p.vz * radius
        );
        dummy.scale.setScalar(p.scale * (1 + progress * 0.4));
      } else if (scrollProgress < 0.75) {
        // Act III: condense into crystal lattice
        const progress = (scrollProgress - 0.5) / 0.25;
        const bx = p.initX + p.vx * 2.8;
        const by = p.initY + p.vy * 2.8;
        const bz = p.initZ + p.vz * 2.8;
        dummy.position.set(
          bx + (p.targetX - bx) * progress,
          by + (p.targetY - by) * progress,
          bz + (p.targetZ - bz) * progress
        );
        dummy.scale.setScalar(p.scale);
      } else {
        // Act IV: stable lattice, fade
        const progress = (scrollProgress - 0.75) / 0.25;
        dummy.position.set(p.targetX, p.targetY, p.targetZ);
        dummy.scale.setScalar(p.scale * (1 - progress * 0.4));
      }

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#67E8F9"
        emissive="#06B6D4"
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.4}
        transparent
        opacity={0.88}
      />
    </instancedMesh>
  );
}
