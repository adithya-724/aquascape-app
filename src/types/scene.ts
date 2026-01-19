export type ComponentCategory =
  | 'substrate'
  | 'driftwood'
  | 'rock'
  | 'plant'
  | 'decoration'
  | 'equipment'
  | 'custom';

// Custom asset uploaded by user with background removed
export interface CustomAsset {
  id: string;
  name: string;
  originalImage: string; // Base64 data URL of original image
  processedImage: string; // Base64 data URL with background removed
  thumbnail: string; // Smaller thumbnail for the library
  createdAt: number;
}

export interface Position2D {
  x: number;
  y: number;
}

export interface SceneObject {
  id: string;
  type: ComponentCategory;
  name: string;
  imagePath?: string;
  position: Position2D; // x, y coordinates in pixels or percentage
  scale: number; // Single scale value for 2D
  rotation: number; // Rotation in degrees
  metadata?: Record<string, any>;
}

export interface SubstrateConfig {
  type: 'sand' | 'gravel' | 'soil';
  color: string;
  height: number; // Height as percentage of tank height
}

export interface LightingConfig {
  intensity: number; // 0-1
  colorTemperature: number; // Kelvin 2700-10000
  color: string; // hex
  timeOfDay: number; // 0-24 hours
}

export interface WaterConfig {
  clarity: number; // 0-1, 0 = crystal clear, 1 = murky
  tint: string; // hex color
  level: number; // percentage 0-100
}
