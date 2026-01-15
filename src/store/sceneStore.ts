import { create } from 'zustand';
import * as THREE from 'three';
import type { SceneObject, SubstrateConfig, LightingConfig, WaterConfig } from '../types/scene';

interface SceneStore {
  objects: SceneObject[];
  selectedObjectId: string | null;
  substrate: SubstrateConfig;
  lighting: LightingConfig;
  water: WaterConfig;

  // Object management
  addObject: (object: Omit<SceneObject, 'id'>) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObject: (id: string | null) => void;
  getSelectedObject: () => SceneObject | null;

  // Substrate
  setSubstrate: (substrate: Partial<SubstrateConfig>) => void;

  // Lighting
  setLighting: (lighting: Partial<LightingConfig>) => void;

  // Water
  setWater: (water: Partial<WaterConfig>) => void;

  // Scene management
  clearScene: () => void;
}

const DEFAULT_SUBSTRATE: SubstrateConfig = {
  type: 'soil',
  color: '#3d2817',
  height: 5,
  slope: {
    front: 3,
    back: 8,
  },
};

const DEFAULT_LIGHTING: LightingConfig = {
  intensity: 0.8,
  colorTemperature: 6500,
  color: '#ffffff',
  position: new THREE.Vector3(0, 50, 0),
  timeOfDay: 12,
};

const DEFAULT_WATER: WaterConfig = {
  clarity: 0.95,
  tint: '#e8f4f8',
  level: 95,
};

export const useSceneStore = create<SceneStore>((set, get) => ({
  objects: [],
  selectedObjectId: null,
  substrate: DEFAULT_SUBSTRATE,
  lighting: DEFAULT_LIGHTING,
  water: DEFAULT_WATER,

  addObject: (object) =>
    set((state) => ({
      objects: [
        ...state.objects,
        {
          ...object,
          id: `object-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
      selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
    })),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  selectObject: (id) =>
    set(() => ({
      selectedObjectId: id,
    })),

  getSelectedObject: () => {
    const state = get();
    return state.objects.find((obj) => obj.id === state.selectedObjectId) || null;
  },

  setSubstrate: (substrate) =>
    set((state) => ({
      substrate: {
        ...state.substrate,
        ...substrate,
      },
    })),

  setLighting: (lighting) =>
    set((state) => ({
      lighting: {
        ...state.lighting,
        ...lighting,
      },
    })),

  setWater: (water) =>
    set((state) => ({
      water: {
        ...state.water,
        ...water,
      },
    })),

  clearScene: () =>
    set(() => ({
      objects: [],
      selectedObjectId: null,
      substrate: DEFAULT_SUBSTRATE,
      lighting: DEFAULT_LIGHTING,
      water: DEFAULT_WATER,
    })),
}));
