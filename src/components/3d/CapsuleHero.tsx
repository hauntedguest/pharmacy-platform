"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Floating Capsule Component
function FloatingCapsule() {
  const meshRef = useRef<THREE.Group>(null);

  return (
    <Float
      speed={2}
      rotationIntensity={1}
      floatIntensity={2}
      floatingRange={[-0.2, 0.2]}
    >
      <group ref={meshRef} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        {/* Top Half - Blue */}
        <mesh position={[0, 0.75, 0]}>
          <capsuleGeometry args={[0.8, 1, 16, 32]} />
          <meshStandardMaterial
            color="#3b82f6"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>

        {/* Bottom Half - Teal */}
        <mesh position={[0, -0.75, 0]}>
          <capsuleGeometry args={[0.8, 1, 16, 32]} />
          <meshStandardMaterial
            color="#14b8a6"
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Surrounding Floating Spheres (Molecules)
function MoleculeSpheres() {
  const spheres = [
    { position: [-2, 1, -1] as [number, number, number], color: "#93c5fd", scale: 0.3 },
    { position: [2, -1, 1] as [number, number, number], color: "#5eead4", scale: 0.25 },
    { position: [-1.5, -1.5, 0.5] as [number, number, number], color: "#60a5fa", scale: 0.2 },
    { position: [1.8, 1.5, -0.5] as [number, number, number], color: "#2dd4bf", scale: 0.35 },
  ];

  return (
    <>
      {spheres.map((sphere, index) => (
        <Float
          key={index}
          speed={1.5 + index * 0.2}
          rotationIntensity={0.5}
          floatIntensity={1.5}
        >
          <mesh position={sphere.position} scale={sphere.scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial
              color={sphere.color}
              roughness={0.3}
              metalness={0.2}
              transparent
              opacity={0.8}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function CapsuleHero() {
  return (
    <div className="w-full h-[400px] md:h-[500px] relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#93c5fd" />

        <FloatingCapsule />
        <MoleculeSpheres />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2 + 0.3}
          minPolarAngle={Math.PI / 2 - 0.3}
        />
      </Canvas>
    </div>
  );
}
