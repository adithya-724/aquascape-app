import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useSceneStore } from '../../store/sceneStore';
import { useTankStore } from '../../store/tankStore';
import { Layers, Mountain, Trees, Package, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarProps {
  side: 'left' | 'right';
}

const Sidebar: React.FC<SidebarProps> = ({ side }) => {
  const { activeTab, setActiveTab } = useUIStore();
  const { objects, selectedObjectId } = useSceneStore();
  const { config } = useTankStore();

  if (side === 'left') {
    const tabs = [
      { id: 'substrate' as const, label: 'Substrate', icon: <Layers size={18} /> },
      { id: 'hardscape' as const, label: 'Hardscape', icon: <Mountain size={18} /> },
      { id: 'plants' as const, label: 'Plants', icon: <Trees size={18} /> },
      { id: 'decor' as const, label: 'Decor', icon: <Package size={18} /> },
      { id: 'equipment' as const, label: 'Equipment', icon: <Settings size={18} /> },
    ];

    return (
      <div className="h-full flex flex-col">
        {/* Tab Headers */}
        <div className="border-b border-border flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-3 px-2 text-sm font-medium transition-colors flex items-center justify-center gap-2',
                activeTab === tab.id
                  ? 'bg-background text-foreground border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
              title={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold mb-3">{tabs.find(t => t.id === activeTab)?.label}</h3>
          <div className="text-sm text-muted-foreground">
            Component library coming soon...
          </div>
        </div>
      </div>
    );
  }

  // Right sidebar - Properties Panel
  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-4">Properties</h3>

      {/* Tank Settings */}
      <div className="mb-6">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Tank Settings</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Width:</span>
            <span>{config.dimensions.width} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height:</span>
            <span>{config.dimensions.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Depth:</span>
            <span>{config.dimensions.depth} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Volume:</span>
            <span>{config.volumeLiters.toFixed(1)} L ({config.volumeGallons.toFixed(1)} gal)</span>
          </div>
        </div>
      </div>

      {/* Selected Object */}
      {selectedObjectId ? (
        <div className="mb-6">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">Selected Object</h4>
          <div className="text-sm">
            <p>Object properties will appear here...</p>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          Select an object to view properties
        </div>
      )}

      {/* Scene Info */}
      <div className="mt-auto pt-4 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-2">Scene Info</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Objects:</span>
            <span>{objects.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
