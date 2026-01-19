import { create } from 'zustand';

interface UIStore {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  activeTab: 'substrate' | 'hardscape' | 'plants' | 'decor' | 'equipment';
  showGrid: boolean;
  showRuler: boolean;
  showRuleOfThirds: boolean;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setActiveTab: (tab: UIStore['activeTab']) => void;
  toggleGrid: () => void;
  toggleRuler: () => void;
  toggleRuleOfThirds: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  activeTab: 'hardscape',
  showGrid: true,
  showRuler: false,
  showRuleOfThirds: false,

  toggleLeftSidebar: () =>
    set((state) => ({
      leftSidebarOpen: !state.leftSidebarOpen,
    })),

  toggleRightSidebar: () =>
    set((state) => ({
      rightSidebarOpen: !state.rightSidebarOpen,
    })),

  setActiveTab: (tab) =>
    set(() => ({
      activeTab: tab,
    })),

  toggleGrid: () =>
    set((state) => ({
      showGrid: !state.showGrid,
    })),

  toggleRuler: () =>
    set((state) => ({
      showRuler: !state.showRuler,
    })),

  toggleRuleOfThirds: () =>
    set((state) => ({
      showRuleOfThirds: !state.showRuleOfThirds,
    })),
}));
