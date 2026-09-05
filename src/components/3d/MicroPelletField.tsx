"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface MicroPelletFieldProps {
  scrollProgress: number;
  count?: number;
}

export default function MicroPelletField({ scrollProgress, count = 150 }: MicroPelletFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummyRef = useRef(new THREE.Object3D());

  // Generate initial positions for particles inside the capsule
  const particles = useMemo(() => {
    return Array.from({ length: count }, () => ({
      initialPos: new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.6
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ),
      scale: Math.random() * 0.02 + 0.01,
      speed: Math.random() * 0.5 + 0.5,
    }));
  }, [count]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const burstStart = 0.25;
    const burstEnd = 0.5;
    const condenseStart = 0.5;
    const condenseEnd = 0.75;

    particles.forEach((particle, i) => {
      // Act I (0-25%): Contained inside capsule, subtle shimmer
      if (scrollProgress < burstStart) {
        dummyRef.current.position.copy(particle.initialPos);
        dummyRef.current.position.y += Math.sin(state.clock.elapsedTime * particle.speed + i) * 0.02;
        dummyRef.current.scale.setScalar(particle.scale);
      }

      // Act II (25%-50%): BURST - Particles explode outward
      else if (scrollProgress >= burstStart && scrollProgress < burstEnd) {
        const burstProgress = (scrollProgress - burstStart) / (burstEnd - burstStart);
        const explosionRadius = burstProgress * 3;

        dummyRef.current.position.copy(particle.initialPos);
        dummyRef.current.position.add(
          particle.velocity.clone().multiplyScalar(explosionRadius)
        );
        dummyRef.current.scale.setScalar(particle.scale * (1 + burstProgress * 0.5));
      }

      // Act III (50%-75%): CONDENSE - Organize into molecular lattice
      else if (scrollProgress >= condenseStart && scrollProgress < condenseEnd) {
        const condenseProgress = (scrollProgress - condenseStart) / (condenseEnd - condenseStart);

        // Create organized grid positions
        const gridSize = Math.ceil(Math.cbrt(count));
        const ix = i % gridSize;
        const iy = Math.floor(i / gridSize) % gridSize;
        const iz = Math.floor(i / (gridSize * gridSize));

        const targetPos = new THREE.Vector3(
          (ix - gridSize / 2) * 0.15,
          (iy - gridSize / 2) * 0.15,
          (iz - gridSize / 2) * 0.15
        );

        // Interpolate from burst position to organized position
        const currentExplosion = particle.initialPos
          .clone()
          .add(particle.velocity.clone().multiplyScalar(3));

        dummyRef.current.position.lerpVectors(currentExplosion, targetPos, condenseProgress);
        dummyRef.current.scale.setScalar(particle.scale);
      }

      // Act IV (75%-100%): Fade & scale down
      else {
        const fadeProgress = (scrollProgress - condenseEnd) / (1 - condenseEnd);
        const gridSize = Math.ceil(Math.cbrt(count));
        const ix = i % gridSize;
        const iy = Math.floor(i / gridSize) % gridSize;
        const iz = Math.floor(i / (gridSize * gridSize));

        dummyRef.current.position.set(
          (ix - gridSize / 2) * 0.15,
          (iy - gridSize / 2) * 0.15,
          (iz - gridSize / 2) * 0.15
        );
        dummyRef.current.scale.setScalar(particle.scale * (1 - fadeProgress * 0.7));
      }

      dummyRef.current.updateMatrix();
      meshRef.current.setMatrixAt(i, dummyRef.current.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <meshPhysicalMaterial
        color="#93C5FD"
        metalness={0.2}
        roughness={0.3}
        transparent
        opacity={0.8}
        emissive="#60A5FA"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}
