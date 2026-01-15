# Aquascape Designer

A next-generation 3D aquarium visualization tool built with React, Three.js, and TypeScript. Design your dream aquarium with realistic 3D rendering, drag-and-drop components, and advanced lighting effects.

## Features

### Current Implementation (Phase 1)
- ✅ Full React + TypeScript setup with Vite
- ✅ Tailwind CSS for styling
- ✅ Three.js with React Three Fiber for 3D rendering
- ✅ Professional layout with sidebars and toolbar
- ✅ Zustand state management for scene, tank, and UI state
- ✅ Interactive 3D scene with orbit controls
- ✅ Realistic glass tank with transparency and refraction
- ✅ Animated water surface with customizable clarity
- ✅ Sloped substrate system
- ✅ Grid helper and camera controls
- ✅ Responsive UI with collapsible sidebars

### Planned Features
- 🔄 Drag-and-drop component system
- 🔄 Extensive library of driftwood, rocks, and plants
- 🔄 Advanced lighting system with time-of-day simulation
- 🔄 Water effects (caustics, god rays, bubbles)
- 🔄 Cost calculator and shopping list
- 🔄 Auto-suggestions for aquascaping styles
- 🔄 High-resolution export
- 🔄 Design save/load (JSON)

## Tech Stack

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### 3D Rendering
- **Three.js** - WebGL 3D library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful Three.js helpers
- **@react-three/postprocessing** - Visual effects

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Icon library
- **Framer Motion** - Animations

### State Management
- **Zustand** - Lightweight state management

### Additional Tools
- **@dnd-kit** - Drag and drop
- **Leva** - Dev GUI controls
- **React Color** - Color pickers
- **Lodash** - Utilities

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+ (Note: Currently running on 20.18.1, which works but shows a warning)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd aquascape-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:5173](http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
aquascape-app/
├── public/                  # Static assets
│   └── assets/
│       ├── models/          # 3D models (.glb/.gltf)
│       └── textures/        # PBR textures
├── src/
│   ├── components/
│   │   ├── canvas/          # Three.js/R3F components
│   │   │   ├── Scene.tsx    # Main 3D scene
│   │   │   ├── Tank.tsx     # Glass tank geometry
│   │   │   ├── Water.tsx    # Water surface
│   │   │   └── Substrate.tsx # Substrate layer
│   │   ├── layout/          # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── panels/          # UI panels (coming soon)
│   │   └── ui/              # shadcn/ui components
│   ├── store/               # Zustand stores
│   │   ├── sceneStore.ts    # 3D scene state
│   │   ├── tankStore.ts     # Tank configuration
│   │   └── uiStore.ts       # UI state
│   ├── types/               # TypeScript types
│   │   ├── tank.ts
│   │   ├── scene.ts
│   │   └── components.ts
│   ├── lib/                 # Utilities
│   │   └── utils.ts
│   ├── data/                # Static data
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Usage

### Tank Configuration
- Use the right sidebar to view and modify tank dimensions
- Tank volume is automatically calculated in liters and gallons
- Glass material uses physically-based rendering for realistic appearance

### Camera Controls
- **Left Click + Drag**: Rotate camera around the tank
- **Right Click + Drag**: Pan camera
- **Scroll Wheel**: Zoom in/out
- **Grid Toggle**: Show/hide the floor grid from the toolbar

### UI Controls
- **Left Sidebar**: Component library (substrate, hardscape, plants, etc.)
- **Right Sidebar**: Properties panel for selected objects and tank settings
- **Toolbar**: View controls, grid toggle, export options

## State Management

The app uses three Zustand stores:

1. **tankStore**: Tank dimensions, style, water level, volume calculations
2. **sceneStore**: 3D objects, substrate, lighting, water properties
3. **uiStore**: Sidebar visibility, active tabs, view options

## Customization

### Tank Presets
Tank presets are defined in [src/types/tank.ts](src/types/tank.ts). Common sizes include:
- 10 Gallon
- 20 Gallon Long
- 40 Gallon Breeder
- 75 Gallon
- 120 Gallon

### Lighting & Water
Lighting and water properties can be adjusted through the stores:
- Light intensity, color temperature, position
- Water clarity, tint, level

## Development Roadmap

### Phase 1: Foundation ✅ (Current)
- Project setup
- Basic 3D scene
- Tank visualization
- Layout and UI

### Phase 2: Core Tank Visualization (Next)
- Tank dimension input UI
- Camera presets with smooth transitions
- Measurement tools

### Phase 3: Component System
- Drag-and-drop from library to scene
- 3D raycasting for placement
- Transform controls (move, rotate, scale)

### Phase 4: Hardscape & Plants
- Extended library (10+ wood types, 10+ rocks)
- Plant database (30+ species)
- Growth stage previews

### Phase 5: Advanced Lighting
- Dynamic lighting controls
- Time of day simulation
- Light rays and god rays

### Phase 6: Water Effects
- Caustics and ripples
- Particle systems
- Equipment visualization

### Phase 7: Smart Features
- Cost calculator
- Auto-suggestions
- Style templates

### Phase 8: Export & Polish
- High-res rendering
- JSON import/export
- Print view

## Contributing

This is a personal/portfolio project. Feel free to fork and modify for your own use.

## License

MIT License - Feel free to use this project as you wish.

## Resources & Inspiration

- [Three.js Examples](https://threejs.org/examples/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Aqua Design Amano (ADA)](https://aqua-design-amano.com/) - Aquascaping inspiration
- [Green Aqua](https://www.greenaqua.hu/) - Aquascaping gallery

## Acknowledgments

- Built with [Three.js](https://threejs.org/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- State management by [Zustand](https://zustand-demo.pmnd.rs/)

---

**Status**: 🚧 In active development | Phase 1 Complete
