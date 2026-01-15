import * as THREE from 'three';

export type ComponentCategory =
  | 'substrate'
  | 'driftwood'
  | 'rock'
  | 'plant'
  | 'decoration'
  | 'equipment';

export interface SceneObject {
  id: string;
  type: ComponentCategory;
  name: string;
  modelPath?: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  metadata?: Record<string, any>;
}

export interface SubstrateConfig {
  type: 'sand' | 'gravel' | 'soil';
  color: string;
  height: number; // in cm
  slope: {
    front: number;
    back: number;
  };
}

export interface LightingConfig {
  intensity: number; // 0-1
  colorTemperature: number; // Kelvin 2700-10000
  color: string; // hex
  position: THREE.Vector3;
  timeOfDay: number; // 0-24 hours
}

export interface WaterConfig {
  clarity: number; // 0-1, 0 = crystal clear, 1 = murky
  tint: string; // hex color
  level: number; // percentage 0-100
}

export interface CameraPreset {
  name: string;
  position: THREE.Vector3;
  target: THREE.Vector3;
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    name: 'Front',
    position: new THREE.Vector3(0, 0, 100),
    target: new THREE.Vector3(0, 0, 0),
  },
  {
    name: 'Side',
    position: new THREE.Vector3(100, 0, 0),
    target: new THREE.Vector3(0, 0, 0),
  },
  {
    name: 'Top',
    position: new THREE.Vector3(0, 100, 0),
    target: new THREE.Vector3(0, 0, 0),
  },
  {
    name: '3/4 View',
    position: new THREE.Vector3(70, 50, 70),
    target: new THREE.Vector3(0, 0, 0),
  },
];
