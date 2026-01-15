import React, { useMemo } from 'react';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import * as THREE from 'three';

const Substrate: React.FC = () => {
  const { config } = useTankStore();
  const { substrate } = useSceneStore();

  const { width, depth } = config.dimensions;
  const scaleWidth = width / 10;
  const scaleDepth = depth / 10;

  // Create substrate material
  const substrateMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(substrate.color),
      roughness: 0.9,
      metalness: 0,
    });
  }, [substrate.color]);

  // Create sloped substrate geometry
  const substrateGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    const frontHeight = substrate.slope.front / 10;
    const backHeight = substrate.slope.back / 10;

    // Create vertices for a sloped box
    const vertices = new Float32Array([
      // Front face (lower)
      -scaleWidth / 2, 0, scaleDepth / 2,
      scaleWidth / 2, 0, scaleDepth / 2,
      scaleWidth / 2, frontHeight, scaleDepth / 2,
      -scaleWidth / 2, frontHeight, scaleDepth / 2,

      // Back face (higher)
      -scaleWidth / 2, 0, -scaleDepth / 2,
      scaleWidth / 2, 0, -scaleDepth / 2,
      scaleWidth / 2, backHeight, -scaleDepth / 2,
      -scaleWidth / 2, backHeight, -scaleDepth / 2,
    ]);

    const indices = [
      // Top face (sloped)
      3, 2, 6,
      3, 6, 7,
      // Bottom face
      0, 5, 1,
      0, 4, 5,
      // Front face
      0, 1, 2,
      0, 2, 3,
      // Back face
      5, 4, 7,
      5, 7, 6,
      // Left face
      4, 0, 3,
      4, 3, 7,
      // Right face
      1, 5, 6,
      1, 6, 2,
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }, [scaleWidth, scaleDepth, substrate.slope.front, substrate.slope.back]);

  return (
    <mesh
      geometry={substrateGeometry}
      material={substrateMaterial}
      position={[0, -(config.dimensions.height / 10) / 2, 0]}
      receiveShadow
      castShadow
    />
  );
};

export default Substrate;
