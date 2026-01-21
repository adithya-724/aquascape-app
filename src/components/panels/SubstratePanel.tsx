import React from 'react';
import { useSceneStore } from '../../store/sceneStore';
import type { SubstrateConfig } from '../../types/scene';
import { Check } from 'lucide-react';

interface SubstrateOption {
  id: SubstrateConfig['type'];
  name: string;
  description: string;
  color: string;
  preview: React.ReactNode;
}

const SubstratePanel: React.FC = () => {
  const { substrate, setSubstrate } = useSceneStore();

  const substrateOptions: SubstrateOption[] = [
    {
      id: 'sand',
      name: 'Clear White Sand',
      description: 'Fine white aquarium sand for a clean, bright look',
      color: '#f5f5dc',
      preview: (
        <div className="w-full h-full rounded relative overflow-hidden">
          {/* White sand base */}
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(180deg, #f5f5dc 0%, #e8e4c9 50%, #d9d4b8 100%)',
            }}
          />
          {/* Sand texture dots */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gray-400"
                style={{
                  width: `${1 + Math.random()}px`,
                  height: `${1 + Math.random()}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'gravel',
      name: 'Natural Gravel',
      description: 'Mixed pebbles and gravel for a natural riverbed effect',
      color: '#6b7280',
      preview: (
        <div className="w-full h-full rounded relative overflow-hidden bg-gray-500">
          {/* Gravel stones */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${4 + Math.random() * 4}px`,
                  height: `${3 + Math.random() * 3}px`,
                  backgroundColor: ['#5a5a5a', '#6b6b6b', '#7a7a7a', '#4a4a4a'][i % 4],
                  left: `${5 + (i % 4) * 25}%`,
                  top: `${10 + Math.floor(i / 4) * 30}%`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'soil',
      name: 'River Sand (Muddy Brown)',
      description: 'Natural muddy brown river sand for planted tanks',
      color: '#5c4033',
      preview: (
        <div className="w-full h-full rounded relative overflow-hidden">
          {/* Muddy brown sand base */}
          <div
            className="w-full h-full"
            style={{
              background: 'linear-gradient(180deg, #6b5344 0%, #5c4033 50%, #4a3428 100%)',
            }}
          />
          {/* Darker spots for texture */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 2}px`,
                  height: `${2 + Math.random() * 2}px`,
                  backgroundColor: i % 2 === 0 ? '#3d2817' : '#7a6555',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        </div>
      ),
    },
  ];

  const handleSelectSubstrate = (option: SubstrateOption) => {
    setSubstrate({ type: option.id, color: option.color });
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Substrate</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Choose a substrate type for the bottom of your aquarium.
      </p>

      <div className="space-y-3">
        {substrateOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectSubstrate(option)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              substrate.type === option.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-accent/50'
            }`}
          >
            <div className="flex gap-3">
              {/* Preview thumbnail */}
              <div className="w-16 h-12 rounded border border-border overflow-hidden flex-shrink-0">
                {option.preview}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{option.name}</span>
                  {substrate.type === option.id && (
                    <Check size={14} className="text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {option.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Substrate height control */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Substrate Height</span>
          <span className="text-xs text-muted-foreground">{substrate.height}%</span>
        </div>
        <input
          type="range"
          min="5"
          max="40"
          value={substrate.height}
          onChange={(e) => setSubstrate({ height: Number(e.target.value) })}
          className="w-full h-2 bg-accent rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-muted-foreground">
          Adjust the height of the substrate layer in the tank.
        </p>
      </div>

      {/* Current selection info */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Current:</span>{' '}
          {substrateOptions.find((o) => o.id === substrate.type)?.name}
        </p>
      </div>
    </div>
  );
};

export default SubstratePanel;
