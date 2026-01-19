import React from 'react';
import { useSceneStore } from '../../store/sceneStore';
import { Mountain, Trees, Box } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ComponentItem {
  id: string;
  name: string;
  type: 'rock' | 'driftwood' | 'plant';
  icon: React.ReactNode;
  description: string;
}

const components: ComponentItem[] = [
  {
    id: 'gray-rock',
    name: 'Gray Rock',
    type: 'rock',
    icon: <Mountain size={32} />,
    description: 'Natural gray stone'
  },
  {
    id: 'driftwood',
    name: 'Driftwood',
    type: 'driftwood',
    icon: <Box size={32} />,
    description: 'Natural driftwood piece'
  },
  {
    id: 'green-plant',
    name: 'Green Plant',
    type: 'plant',
    icon: <Trees size={32} />,
    description: 'Aquatic plant'
  },
];

const ComponentLibrary: React.FC = () => {
  const { addObject } = useSceneStore();

  const handleAddComponent = (component: ComponentItem) => {
    // Random position within tank bounds (in percentage)
    const randomX = Math.random() * 80 + 10; // 10% to 90%
    const randomY = Math.random() * 60 + 20; // 20% to 80%

    addObject({
      type: component.type,
      name: component.name,
      position: { x: randomX, y: randomY },
      rotation: Math.random() * 360, // Random rotation in degrees
      scale: 1,
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-1 text-card-foreground">Component Library</h3>
        <p className="text-xs text-muted-foreground">Click to add items to your aquarium</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {components.map((component) => (
          <button
            key={component.id}
            onClick={() => handleAddComponent(component)}
            className={cn(
              'group relative flex flex-col items-center gap-2 p-4 rounded-lg',
              'bg-card border-2 border-border hover:border-primary',
              'transition-all duration-200',
              'hover:shadow-lg hover:scale-105',
              'active:scale-95'
            )}
          >
            <div className={cn(
              'text-muted-foreground group-hover:text-primary transition-colors',
              component.type === 'rock' && 'text-slate-600',
              component.type === 'driftwood' && 'text-amber-700',
              component.type === 'plant' && 'text-green-600'
            )}>
              {component.icon}
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-card-foreground">{component.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{component.description}</p>
            </div>

            {/* Add indicator */}
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-primary font-bold">+</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-3 bg-accent/20 rounded-lg border border-accent/30">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-accent">Tip:</span> Click on an item to add it to your tank.
          Select objects in the 3D view to move or delete them.
        </p>
      </div>
    </div>
  );
};

export default ComponentLibrary;
