import { create } from 'zustand';
import type { SceneObject, SubstrateConfig, LightingConfig, WaterConfig, CustomAsset } from '../types/scene';

interface SceneStore {
  objects: SceneObject[];
  selectedObjectId: string | null;
  substrate: SubstrateConfig;
  lighting: LightingConfig;
  water: WaterConfig;
  customAssets: CustomAsset[];

  // Object management
  addObject: (object: Omit<SceneObject, 'id'>) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObject: (id: string | null) => void;
  getSelectedObject: () => SceneObject | null;

  // Custom assets management
  addCustomAsset: (asset: Omit<CustomAsset, 'id' | 'createdAt'>) => void;
  removeCustomAsset: (id: string) => void;
  getCustomAsset: (id: string) => CustomAsset | undefined;

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
  color: '#1a1a1a', // Dark black/charcoal to match reference
  height: 20, // 20% of tank height
};

const DEFAULT_LIGHTING: LightingConfig = {
  intensity: 0.8,
  colorTemperature: 6500,
  color: '#ffffff',
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
  customAssets: [],

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

  addCustomAsset: (asset) =>
    set((state) => ({
      customAssets: [
        ...state.customAssets,
        {
          ...asset,
          id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        },
      ],
    })),

  removeCustomAsset: (id) =>
    set((state) => ({
      customAssets: state.customAssets.filter((asset) => asset.id !== id),
      // Also remove any objects that use this custom asset
      objects: state.objects.filter((obj) => obj.metadata?.customAssetId !== id),
    })),

  getCustomAsset: (id) => {
    const state = get();
    return state.customAssets.find((asset) => asset.id === id);
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
      customAssets: [],
    })),
}));
