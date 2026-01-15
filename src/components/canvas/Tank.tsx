import React, { useMemo } from 'react';
import { useTankStore } from '../../store/tankStore';
import * as THREE from 'three';

const Tank: React.FC = () => {
  const { config } = useTankStore();
  const { width, height, depth } = config.dimensions;

  // Convert cm to scene units (divide by 10 for reasonable scale)
  const scaleWidth = width / 10;
  const scaleHeight = height / 10;
  const scaleDepth = depth / 10;

  // Create glass material with transparency and refraction
  const glassMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.1,
      transmission: 0.95,
      thickness: 0.5,
      envMapIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
  }, []);

  // Create edge material for glass thickness visualization
  const edgeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: '#cccccc',
      metalness: 0.3,
      roughness: 0.6,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  const glassThickness = config.style.glassThickness / 100; // Convert mm to scene units

  return (
    <group position={[0, scaleHeight / 2, 0]}>
      {/* Front Panel */}
      <mesh position={[0, 0, scaleDepth / 2]} material={glassMaterial} castShadow receiveShadow>
        <boxGeometry args={[scaleWidth, scaleHeight, glassThickness]} />
      </mesh>

      {/* Back Panel */}
      <mesh position={[0, 0, -scaleDepth / 2]} material={glassMaterial} castShadow receiveShadow>
        <boxGeometry args={[scaleWidth, scaleHeight, glassThickness]} />
      </mesh>

      {/* Left Panel */}
      <mesh position={[-scaleWidth / 2, 0, 0]} material={glassMaterial} castShadow receiveShadow>
        <boxGeometry args={[glassThickness, scaleHeight, scaleDepth]} />
      </mesh>

      {/* Right Panel */}
      <mesh position={[scaleWidth / 2, 0, 0]} material={glassMaterial} castShadow receiveShadow>
        <boxGeometry args={[glassThickness, scaleHeight, scaleDepth]} />
      </mesh>

      {/* Bottom Panel */}
      <mesh position={[0, -scaleHeight / 2, 0]} material={glassMaterial} receiveShadow>
        <boxGeometry args={[scaleWidth, glassThickness, scaleDepth]} />
      </mesh>

      {/* Frame edges (if not rimless) */}
      {config.style.type === 'framed' && (
        <>
          {/* Top frame */}
          <mesh position={[0, scaleHeight / 2 + glassThickness / 2, 0]} material={edgeMaterial}>
            <boxGeometry args={[scaleWidth + glassThickness * 2, glassThickness * 2, scaleDepth + glassThickness * 2]} />
          </mesh>
          {/* Bottom frame */}
          <mesh position={[0, -scaleHeight / 2 - glassThickness / 2, 0]} material={edgeMaterial}>
            <boxGeometry args={[scaleWidth + glassThickness * 2, glassThickness * 2, scaleDepth + glassThickness * 2]} />
          </mesh>
        </>
      )}
    </group>
  );
};

export default Tank;
