export interface Component {
  id: string;
  name: string;
  category: 'substrate' | 'driftwood' | 'rock' | 'plant' | 'decoration' | 'equipment';
  thumbnail: string;
  modelPath: string;
  description?: string;
  price?: number;
  metadata?: {
    species?: string;
    size?: 'S' | 'M' | 'L' | 'XL';
    lightRequirement?: 'low' | 'medium' | 'high';
    co2Required?: boolean;
    growthRate?: 'slow' | 'medium' | 'fast';
    difficulty?: 'easy' | 'medium' | 'hard';
  };
}

export interface PlantComponent extends Component {
  category: 'plant';
  placement: 'foreground' | 'midground' | 'background' | 'floating';
  growthStages: {
    initial: string;
    threeMonths: string;
    sixMonths: string;
    mature: string;
  };
}

export interface DriftwoodComponent extends Component {
  category: 'driftwood';
  woodType: 'manzanita' | 'spider' | 'malaysian' | 'mopani' | 'redmoor';
}

export interface RockComponent extends Component {
  category: 'rock';
  rockType: 'dragon-stone' | 'seiryu' | 'lava' | 'river' | 'slate';
}
