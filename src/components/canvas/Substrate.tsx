import React, { useMemo } from 'react';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import * as THREE from 'three';

const Substrate: React.FC = () => {
  const { config } = useTankStore();
  const { substrate } = useSceneStore();

  const { width, height, depth } = config.dimensions;

  // Convert cm to scene units (divide by 10 for reasonable scale)
  const scaleWidth = width / 10;
  const scaleHeight = height / 10;
  const scaleDepth = depth / 10;

  // Calculate substrate height based on percentage of tank height
  const substrateHeight = (scaleHeight * substrate.height) / 100;

  // Get glass thickness to position substrate inside the tank walls
  const glassThickness = config.style.glassThickness / 100;

  // Inner dimensions (inside the glass walls)
  const innerWidth = scaleWidth - glassThickness * 2;
  const innerDepth = scaleDepth - glassThickness * 2;

  // Create procedural noise texture for grainy sand appearance
  const noiseTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Base color from substrate
    const baseColor = new THREE.Color(substrate.color);

    // Create grainy noise pattern
    const imageData = ctx.createImageData(size, size);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Random variation for grain effect
      const variation = (Math.random() - 0.5) * 0.3;
      const r = Math.min(255, Math.max(0, (baseColor.r + variation) * 255));
      const g = Math.min(255, Math.max(0, (baseColor.g + variation) * 255));
      const b = Math.min(255, Math.max(0, (baseColor.b + variation) * 255));

      imageData.data[i] = r;
      imageData.data[i + 1] = g;
      imageData.data[i + 2] = b;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    return texture;
  }, [substrate.color]);

  // Create substrate material with grainy texture
  const substrateMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: noiseTexture,
      roughness: 0.95,
      metalness: 0,
      bumpMap: noiseTexture,
      bumpScale: 0.02,
    });
  }, [noiseTexture]);

  // Position: match the Tank's coordinate system
  // Tank group is positioned at [0, scaleHeight/2, 0]
  // Tank's bottom interior surface is at local Y = -scaleHeight/2 + glassThickness/2
  // Substrate center should be at: -scaleHeight/2 + glassThickness/2 + substrateHeight/2
  // But substrate is not inside the Tank group, so we need world coordinates:
  // World Y = (scaleHeight/2) + (-scaleHeight/2 + glassThickness/2 + substrateHeight/2)
  //         = glassThickness/2 + substrateHeight/2
  const positionY = glassThickness / 2 + substrateHeight / 2;

  return (
    <mesh
      material={substrateMaterial}
      position={[0, positionY, 0]}
      receiveShadow
      castShadow
    >
      <boxGeometry args={[scaleWidth, substrateHeight, scaleDepth]} />
    </mesh>
  );
};

export default Substrate;
