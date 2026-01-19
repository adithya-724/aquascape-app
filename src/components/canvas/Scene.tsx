import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useUIStore } from '../../store/uiStore';
import { useSceneStore } from '../../store/sceneStore';
import Tank from './Tank';
import Water from './Water';
import Substrate from './Substrate';
import SceneObject from './SceneObject';

const Scene: React.FC = () => {
  const { showGrid } = useUIStore();
  const { objects } = useSceneStore();

  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 45 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-cyan-950 dark:to-slate-900"
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.4} color="#60a5fa" />
      <pointLight position={[10, 5, -10]} intensity={0.3} color="#22d3ee" />

      {/* Environment */}
      <Environment preset="city" background={false} />

      {/* Grid Helper */}
      {showGrid && (
        <Grid
          args={[200, 200]}
          cellSize={5}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={10}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={150}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* Main Scene Components */}
      <Suspense fallback={null}>
        <Tank />
        <Substrate />
        <Water />

        {/* Scene Objects */}
        {objects.map((obj) => (
          <SceneObject
            key={obj.id}
            id={obj.id}
            position={obj.position}
            rotation={obj.rotation}
            scale={obj.scale}
            type={obj.type as 'rock' | 'driftwood' | 'plant'}
          />
        ))}
      </Suspense>

      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={300}
        maxPolarAngle={Math.PI / 2}
        target={[0, 1.5, 0]}
      />
    </Canvas>
  );
};

export default Scene;
