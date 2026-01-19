import { create } from 'zustand';
import type { TankConfig, TankDimensions, TankStyle } from '../types/tank';

interface TankStore {
  config: TankConfig;
  setDimensions: (dimensions: TankDimensions) => void;
  setStyle: (style: TankStyle) => void;
  setWaterLevel: (level: number) => void;
  calculateVolume: () => void;
}

const DEFAULT_DIMENSIONS: TankDimensions = {
  width: 60,
  height: 40,
  depth: 30,
  unit: 'cm',
};

const DEFAULT_STYLE: TankStyle = {
  type: 'rimless',
  glassThickness: 6,
};

const calculateVolumeInLiters = (dimensions: TankDimensions): number => {
  const { width, height, depth } = dimensions;
  return (width * height * depth) / 1000; // cm³ to liters
};

const litersToGallons = (liters: number): number => {
  return liters * 0.264172;
};

export const useTankStore = create<TankStore>((set) => ({
  config: {
    dimensions: DEFAULT_DIMENSIONS,
    style: DEFAULT_STYLE,
    waterLevel: 95,
    volumeGallons: 0,
    volumeLiters: 0,
  },

  setDimensions: (dimensions) =>
    set((state) => {
      const volumeLiters = calculateVolumeInLiters(dimensions);
      const volumeGallons = litersToGallons(volumeLiters);
      return {
        config: {
          ...state.config,
          dimensions,
          volumeLiters,
          volumeGallons,
        },
      };
    }),

  setStyle: (style) =>
    set((state) => ({
      config: {
        ...state.config,
        style,
      },
    })),

  setWaterLevel: (level) =>
    set((state) => ({
      config: {
        ...state.config,
        waterLevel: Math.max(0, Math.min(100, level)),
      },
    })),

  calculateVolume: () =>
    set((state) => {
      const volumeLiters = calculateVolumeInLiters(state.config.dimensions);
      const volumeGallons = litersToGallons(volumeLiters);
      return {
        config: {
          ...state.config,
          volumeLiters,
          volumeGallons,
        },
      };
    }),
}));

// Initialize volume calculation on load
useTankStore.getState().calculateVolume();
