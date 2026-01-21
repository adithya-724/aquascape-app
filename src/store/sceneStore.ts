import { create } from 'zustand';
import type { SceneObject, SubstrateConfig, LightingConfig, WaterConfig, CustomAsset, BackgroundConfig } from '../types/scene';

interface SceneStore {
  objects: SceneObject[];
  selectedObjectId: string | null;
  substrate: SubstrateConfig;
  lighting: LightingConfig;
  water: WaterConfig;
  background: BackgroundConfig;
  customAssets: CustomAsset[];

  // Object management
  addObject: (object: Omit<SceneObject, 'id' | 'zIndex'>) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  selectObject: (id: string | null) => void;
  getSelectedObject: () => SceneObject | null;

  // Layer ordering
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

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

  // Background
  setBackground: (background: Partial<BackgroundConfig>) => void;

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

const DEFAULT_BACKGROUND: BackgroundConfig = {
  preset: 'none',
};

export const useSceneStore = create<SceneStore>((set, get) => ({
  objects: [],
  selectedObjectId: null,
  substrate: DEFAULT_SUBSTRATE,
  lighting: DEFAULT_LIGHTING,
  water: DEFAULT_WATER,
  background: DEFAULT_BACKGROUND,
  customAssets: [],

  addObject: (object) =>
    set((state) => {
      // Calculate the next zIndex (highest + 1)
      const maxZIndex = state.objects.length > 0
        ? Math.max(...state.objects.map((o) => o.zIndex))
        : 0;
      return {
        objects: [
          ...state.objects,
          {
            ...object,
            id: `object-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            zIndex: maxZIndex + 1,
          },
        ],
      };
    }),

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

  bringToFront: (id) =>
    set((state) => {
      const maxZIndex = Math.max(...state.objects.map((o) => o.zIndex));
      return {
        objects: state.objects.map((obj) =>
          obj.id === id ? { ...obj, zIndex: maxZIndex + 1 } : obj
        ),
      };
    }),

  sendToBack: (id) =>
    set((state) => {
      const minZIndex = Math.min(...state.objects.map((o) => o.zIndex));
      return {
        objects: state.objects.map((obj) =>
          obj.id === id ? { ...obj, zIndex: minZIndex - 1 } : obj
        ),
      };
    }),

  bringForward: (id) =>
    set((state) => {
      const obj = state.objects.find((o) => o.id === id);
      if (!obj) return state;

      // Find the object directly above this one
      const objectsAbove = state.objects.filter((o) => o.zIndex > obj.zIndex);
      if (objectsAbove.length === 0) return state;

      const nextAbove = objectsAbove.reduce((closest, current) =>
        current.zIndex < closest.zIndex ? current : closest
      );

      // Swap zIndex values
      return {
        objects: state.objects.map((o) => {
          if (o.id === id) return { ...o, zIndex: nextAbove.zIndex };
          if (o.id === nextAbove.id) return { ...o, zIndex: obj.zIndex };
          return o;
        }),
      };
    }),

  sendBackward: (id) =>
    set((state) => {
      const obj = state.objects.find((o) => o.id === id);
      if (!obj) return state;

      // Find the object directly below this one
      const objectsBelow = state.objects.filter((o) => o.zIndex < obj.zIndex);
      if (objectsBelow.length === 0) return state;

      const nextBelow = objectsBelow.reduce((closest, current) =>
        current.zIndex > closest.zIndex ? current : closest
      );

      // Swap zIndex values
      return {
        objects: state.objects.map((o) => {
          if (o.id === id) return { ...o, zIndex: nextBelow.zIndex };
          if (o.id === nextBelow.id) return { ...o, zIndex: obj.zIndex };
          return o;
        }),
      };
    }),

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

  setBackground: (background) =>
    set((state) => ({
      background: {
        ...state.background,
        ...background,
      },
    })),

  clearScene: () =>
    set(() => ({
      objects: [],
      selectedObjectId: null,
      substrate: DEFAULT_SUBSTRATE,
      lighting: DEFAULT_LIGHTING,
      water: DEFAULT_WATER,
      background: DEFAULT_BACKGROUND,
      customAssets: [],
    })),
}));
