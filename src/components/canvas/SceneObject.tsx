import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '../../store/sceneStore';

interface SceneObjectProps {
  id: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  type: 'rock' | 'driftwood' | 'plant';
}

const SceneObject: React.FC<SceneObjectProps> = ({ id, position, rotation, scale, type }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedObjectId, selectObject } = useSceneStore();

  const isSelected = selectedObjectId === id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectObject(id);
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    selectObject(id);
  };

  useFrame(() => {
    if (meshRef.current && (hovered || isSelected)) {
      // Subtle pulse effect when hovered or selected
      const scale_factor = isSelected ? 1.05 : (hovered ? 1.02 : 1);
      meshRef.current.scale.setScalar(scale_factor);
    }
  });

  // Render different geometries based on type
  const renderGeometry = () => {
    switch (type) {
      case 'rock':
        return (
          <>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={isSelected ? '#4ade80' : (hovered ? '#94a3b8' : '#64748b')}
              roughness={0.8}
              metalness={0.2}
            />
          </>
        );
      case 'driftwood':
        return (
          <>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshStandardMaterial
              color={isSelected ? '#4ade80' : (hovered ? '#78350f' : '#6f4e37')}
              roughness={0.9}
              metalness={0.1}
            />
          </>
        );
      case 'plant':
        return (
          <>
            <coneGeometry args={[0.5, 1.5, 8]} />
            <meshStandardMaterial
              color={isSelected ? '#4ade80' : (hovered ? '#86efac' : '#22c55e')}
              roughness={0.7}
              metalness={0.1}
            />
          </>
        );
      default:
        return (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#888888" />
          </>
        );
    }
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {renderGeometry()}
      </mesh>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, -1.2, 0]}>
          <ringGeometry args={[1.2, 1.4, 32]} />
          <meshBasicMaterial color="#4ade80" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
};

export default SceneObject;
