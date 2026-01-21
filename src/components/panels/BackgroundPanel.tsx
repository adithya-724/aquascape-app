import React from 'react';
import { useSceneStore } from '../../store/sceneStore';
import type { BackgroundPreset } from '../../types/scene';
import { Check } from 'lucide-react';

interface BackgroundOption {
  id: BackgroundPreset;
  name: string;
  description: string;
  preview: React.ReactNode;
}

const BackgroundPanel: React.FC = () => {
  const { background, setBackground } = useSceneStore();

  const backgroundOptions: BackgroundOption[] = [
    {
      id: 'none',
      name: 'None',
      description: 'Default light panel background',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200 rounded" />
      ),
    },
    {
      id: 'black',
      name: 'Solid Black',
      description: 'Clean black background for contrast',
      preview: (
        <div className="w-full h-full bg-black rounded" />
      ),
    },
    {
      id: 'stone-3d',
      name: '3D Stone Wall',
      description: 'Embedded stones with 3D depth effect',
      preview: (
        <div className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded relative overflow-hidden">
          {/* Mini stone preview */}
          <div className="absolute top-1 left-2 w-4 h-3 rounded-full bg-gray-500 shadow-inner" />
          <div className="absolute top-2 right-3 w-3 h-2 rounded-full bg-gray-600 shadow-inner" />
          <div className="absolute bottom-2 left-3 w-5 h-3 rounded-full bg-gray-500 shadow-inner" />
          <div className="absolute bottom-1 right-2 w-3 h-3 rounded-full bg-gray-600 shadow-inner" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-2 rounded-full bg-gray-500 shadow-inner" />
        </div>
      ),
    },
  ];

  const handleSelectBackground = (preset: BackgroundPreset) => {
    setBackground({ preset });
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold mb-3">Tank Background</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Choose a background style for your aquarium tank.
      </p>

      <div className="space-y-3">
        {backgroundOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelectBackground(option.id)}
            className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
              background.preset === option.id
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
                  {background.preset === option.id && (
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

      {/* Current selection info */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">Current:</span>{' '}
          {backgroundOptions.find((o) => o.id === background.preset)?.name}
        </p>
      </div>
    </div>
  );
};

export default BackgroundPanel;
