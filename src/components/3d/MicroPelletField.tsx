"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MicroPelletFieldProps {
  scrollProgress: number;
  count?: number;
}

export default function MicroPelletField({ scrollProgress, count = 120 }: MicroPelletFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-calculate all particle data to eliminate allocations inside the 60fps frame loop
  const particleData = useMemo(() => {
    const data = [];
    const gridSize = Math.ceil(Math.cbrt(count));

    for (let i = 0; i < count; i++) {
      // Act I initial position inside capsule core
      const initX = (Math.random() - 0.5) * 0.45;
      const initY = (Math.random() - 0.5) * 0.9;
      const initZ = (Math.random() - 0.5) * 0.45;

      // Burst velocity direction
      const vx = (Math.random() - 0.5) * 2.2;
      const vy = (Math.random() - 0.5) * 2.2;
      const vz = (Math.random() - 0.5) * 2.2;

      // Act III organized lattice grid target
      const ix = i % gridSize;
      const iy = Math.floor(i / gridSize) % gridSize;
      const iz = Math.floor(i / (gridSize * gridSize));
      const targetX = (ix - gridSize / 2) * 0.22;
      const targetY = (iy - gridSize / 2) * 0.22;
      const targetZ = (iz - gridSize / 2) * 0.22;

      data.push({
        initX,
        initY,
        initZ,
        vx,
        vy,
        vz,
        targetX,
        targetY,
        targetZ,
        scale: Math.random() * 0.022 + 0.015,
        speed: Math.random() * 0.8 + 0.6,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, [count]);

  useFrame((state, rawDelta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = state.clock.elapsedTime;
    const burstStart = 0.25;
    const burstEnd = 0.5;
    const condenseStart = 0.5;
    const condenseEnd = 0.75;

    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i];

      // Act I (0-25%): Contained inside capsule with ambient biological shimmer
      if (scrollProgress < burstStart) {
        const shimY = Math.sin(time * p.speed + p.phase) * 0.04;
        const shimX = Math.cos(time * p.speed * 0.8 + p.phase) * 0.02;
        dummy.position.set(p.initX + shimX, p.initY + shimY, p.initZ);
        dummy.scale.setScalar(p.scale);
      }
      // Act II (25%-50%): BURST - Bioavailable micro-particles disperse
      else if (scrollProgress >= burstStart && scrollProgress < burstEnd) {
        const progress = (scrollProgress - burstStart) / (burstEnd - burstStart);
        const radius = progress * 2.8;

        const posX = p.initX + p.vx * radius;
        const posY = p.initY + p.vy * radius;
        const posZ = p.initZ + p.vz * radius;

        dummy.position.set(posX, posY, posZ);
        dummy.scale.setScalar(p.scale * (1 + progress * 0.4));
      }
      // Act III (50%-75%): CONDENSE - Self-assemble into pharmaceutical crystal lattice
      else if (scrollProgress >= condenseStart && scrollProgress < condenseEnd) {
        const progress = (scrollProgress - condenseStart) / (condenseEnd - condenseStart);

        const burstPosX = p.initX + p.vx * 2.8;
        const burstPosY = p.initY + p.vy * 2.8;
        const burstPosZ = p.initZ + p.vz * 2.8;

        // Smooth interpolation without Vector3 allocation
        const posX = burstPosX + (p.targetX - burstPosX) * progress;
        const posY = burstPosY + (p.targetY - burstPosY) * progress;
        const posZ = burstPosZ + (p.targetZ - burstPosZ) * progress;

        dummy.position.set(posX, posY, posZ);
        dummy.scale.setScalar(p.scale);
      }
      // Act IV (75%-100%): Stabilized lattice slowly rotating
      else {
        const progress = (scrollProgress - condenseEnd) / (1 - condenseEnd);
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
      <sphereGeometry args={[1, 12, 12]} />
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
