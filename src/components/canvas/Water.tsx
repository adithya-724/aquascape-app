import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import * as THREE from 'three';

const Water: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { config } = useTankStore();
  const { water } = useSceneStore();

  const { width, height, depth } = config.dimensions;
  const scaleWidth = width / 10;
  const scaleHeight = height / 10;
  const scaleDepth = depth / 10;

  // Calculate water height based on water level percentage
  const waterHeight = (scaleHeight * water.level) / 100;
  const waterYPosition = waterHeight / 2 - scaleHeight / 2;

  // Custom water shader material
  const waterMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(water.tint),
      metalness: 0,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1,
      envMapIntensity: 1.5,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: water.clarity,
      side: THREE.DoubleSide,
    });
  }, [water.tint, water.clarity]);

  // Animate water surface with subtle ripples
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Very subtle bobbing motion
      meshRef.current.position.y = waterYPosition + Math.sin(time * 0.5) * 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, waterYPosition, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      material={waterMaterial}
      receiveShadow
    >
      <planeGeometry args={[scaleWidth - 0.1, scaleDepth - 0.1, 32, 32]} />
    </mesh>
  );
};

export default Water;
