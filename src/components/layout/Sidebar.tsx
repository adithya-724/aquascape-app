import React from 'react';
import { useUIStore } from '../../store/uiStore';
import { useSceneStore } from '../../store/sceneStore';
import { useTankStore } from '../../store/tankStore';
import { Layers, Mountain, Trees, Package, Settings, Trash2, ImagePlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import ComponentLibrary from '../panels/ComponentLibrary';
import CustomComponentsPanel from '../panels/CustomComponentsPanel';

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
      { id: 'custom' as const, label: 'Custom', icon: <ImagePlus size={18} /> },
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
        <div className="flex-1 overflow-y-auto">
          {(activeTab === 'hardscape' || activeTab === 'plants' || activeTab === 'decor') && (
            <ComponentLibrary />
          )}
          {activeTab === 'substrate' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3">Substrate</h3>
              <div className="text-sm text-muted-foreground">
                Substrate customization coming soon...
              </div>
            </div>
          )}
          {activeTab === 'equipment' && (
            <div className="p-4">
              <h3 className="text-sm font-semibold mb-3">Equipment</h3>
              <div className="text-sm text-muted-foreground">
                Equipment library coming soon...
              </div>
            </div>
          )}
          {activeTab === 'custom' && (
            <CustomComponentsPanel />
          )}
        </div>
      </div>
    );
  }

  // Right sidebar - Properties Panel
  const { removeObject, getSelectedObject } = useSceneStore();
  const selectedObject = getSelectedObject();

  const handleDeleteObject = () => {
    if (selectedObjectId) {
      removeObject(selectedObjectId);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-4">Properties</h3>

      {/* Tank Settings */}
      <div className="mb-6 p-3 bg-accent/10 rounded-lg border border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Tank Settings</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Width:</span>
            <span className="font-medium">{config.dimensions.width} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Height:</span>
            <span className="font-medium">{config.dimensions.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Depth:</span>
            <span className="font-medium">{config.dimensions.depth} cm</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{config.volumeLiters.toFixed(1)} L ({config.volumeGallons.toFixed(1)} gal)</span>
          </div>
        </div>
      </div>

      {/* Selected Object */}
      {selectedObject ? (
        <div className="mb-6 p-3 bg-primary/10 rounded-lg border-2 border-primary/30">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-medium text-primary">Selected Object</h4>
            <button
              onClick={handleDeleteObject}
              className="p-1.5 hover:bg-destructive/20 text-destructive rounded transition-colors"
              title="Delete object"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-medium capitalize">{selectedObject.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{selectedObject.name}</span>
            </div>
            <div className="pt-2 border-t border-primary/20">
              <p className="text-xs text-muted-foreground">
                Position: ({selectedObject.position.x.toFixed(1)}%, {selectedObject.position.y.toFixed(1)}%)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Rotation: {selectedObject.rotation.toFixed(0)}° | Scale: {selectedObject.scale.toFixed(2)}x
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 text-center text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border">
          Click an object in the tank to select it
        </div>
      )}

      {/* Scene Info */}
      <div className="mt-auto pt-4 border-t border-border">
        <h4 className="text-xs font-medium text-muted-foreground mb-3">Scene Info</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Objects:</span>
            <span className="font-medium text-primary">{objects.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
