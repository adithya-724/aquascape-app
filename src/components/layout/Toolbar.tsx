import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Grid3x3,
  Ruler,
  Camera,
  Download,
  RotateCcw,
  Undo2,
  Redo2
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { cn } from '../../lib/utils';

const Toolbar: React.FC = () => {
  const {
    leftSidebarOpen,
    rightSidebarOpen,
    showGrid,
    showRuler,
    toggleLeftSidebar,
    toggleRightSidebar,
    toggleGrid,
    toggleRuler,
  } = useUIStore();

  const ToolButton: React.FC<{
    icon: React.ReactNode;
    onClick: () => void;
    active?: boolean;
    title: string;
  }> = ({ icon, onClick, active = false, title }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-2 rounded hover:bg-accent transition-colors',
        active && 'bg-accent text-accent-foreground'
      )}
    >
      {icon}
    </button>
  );

  return (
    <div className="h-14 bg-card border-b border-border px-4 flex items-center justify-between">
      {/* Left Section - Sidebar Toggles */}
      <div className="flex items-center gap-2">
        <ToolButton
          icon={leftSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          onClick={toggleLeftSidebar}
          active={leftSidebarOpen}
          title="Toggle Component Library"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <h1 className="text-lg font-semibold text-foreground">Aquascape Designer</h1>
      </div>

      {/* Center Section - View Controls */}
      <div className="flex items-center gap-2">
        <ToolButton
          icon={<Undo2 size={20} />}
          onClick={() => console.log('Undo')}
          title="Undo"
        />
        <ToolButton
          icon={<Redo2 size={20} />}
          onClick={() => console.log('Redo')}
          title="Redo"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <ToolButton
          icon={<Grid3x3 size={20} />}
          onClick={toggleGrid}
          active={showGrid}
          title="Toggle Grid"
        />
        <ToolButton
          icon={<Ruler size={20} />}
          onClick={toggleRuler}
          active={showRuler}
          title="Toggle Ruler"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <ToolButton
          icon={<Camera size={20} />}
          onClick={() => console.log('Camera presets')}
          title="Camera Presets"
        />
        <ToolButton
          icon={<RotateCcw size={20} />}
          onClick={() => console.log('Reset view')}
          title="Reset View"
        />
      </div>

      {/* Right Section - Export & Sidebar Toggle */}
      <div className="flex items-center gap-2">
        <ToolButton
          icon={<Download size={20} />}
          onClick={() => console.log('Export')}
          title="Export Design"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <ToolButton
          icon={rightSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
          onClick={toggleRightSidebar}
          active={rightSidebarOpen}
          title="Toggle Properties Panel"
        />
      </div>
    </div>
  );
};

export default Toolbar;
