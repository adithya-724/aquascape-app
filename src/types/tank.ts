export interface TankDimensions {
  width: number; // in cm
  height: number; // in cm
  depth: number; // in cm
  unit: 'cm' | 'inches';
}

export interface TankStyle {
  type: 'rimless' | 'framed' | 'curved';
  glassThickness: number; // in mm
}

export interface TankConfig {
  dimensions: TankDimensions;
  style: TankStyle;
  waterLevel: number; // percentage 0-100
  volumeGallons: number;
  volumeLiters: number;
}

export interface TankPreset {
  name: string;
  gallons: number;
  dimensions: TankDimensions;
  common: boolean;
}

export const TANK_PRESETS: TankPreset[] = [
  {
    name: '10 Gallon',
    gallons: 10,
    dimensions: { width: 50.8, height: 30.5, depth: 25.4, unit: 'cm' },
    common: true,
  },
  {
    name: '20 Gallon Long',
    gallons: 20,
    dimensions: { width: 76.2, height: 30.5, depth: 30.5, unit: 'cm' },
    common: true,
  },
  {
    name: '40 Gallon Breeder',
    gallons: 40,
    dimensions: { width: 91.4, height: 40.6, depth: 45.7, unit: 'cm' },
    common: true,
  },
  {
    name: '75 Gallon',
    gallons: 75,
    dimensions: { width: 121.9, height: 53.3, depth: 45.7, unit: 'cm' },
    common: true,
  },
  {
    name: '120 Gallon',
    gallons: 120,
    dimensions: { width: 152.4, height: 61, depth: 61, unit: 'cm' },
    common: true,
  },
];
