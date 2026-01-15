import React from 'react';
import { useUIStore } from '../../store/uiStore';
import Sidebar from './Sidebar';
import Toolbar from './Toolbar';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { leftSidebarOpen, rightSidebarOpen } = useUIStore();

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out bg-card border-r border-border',
            leftSidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          {leftSidebarOpen && (
            <div className="w-80 h-full">
              <Sidebar side="left" />
            </div>
          )}
        </div>

        {/* Center - 3D Canvas */}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>

        {/* Right Sidebar - Properties Panel */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out bg-card border-l border-border',
            rightSidebarOpen ? 'w-80' : 'w-0'
          )}
        >
          {rightSidebarOpen && (
            <div className="w-80 h-full">
              <Sidebar side="right" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-card border-t border-border px-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Objects: 0</span>
          <span>Volume: 0L</span>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
