import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useUIStore } from '../../store/uiStore';
import Tank from './Tank';
import Water from './Water';
import Substrate from './Substrate';

const Scene: React.FC = () => {
  const { showGrid } = useUIStore();

  return (
    <Canvas
      camera={{ position: [70, 50, 70], fov: 50 }}
      shadows
      gl={{ antialias: true, alpha: true }}
      className="bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800"
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />

      {/* Environment */}
      <Environment preset="apartment" background={false} />

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
      </Suspense>

      {/* Camera Controls */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={20}
        maxDistance={200}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  );
};

export default Scene;
