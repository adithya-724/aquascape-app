import React, { useRef } from 'react';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import { useUIStore } from '../../store/uiStore';
import DraggableItem from './DraggableItem';

const TankView2D: React.FC = () => {
  const tankRef = useRef<HTMLDivElement>(null);
  const { config } = useTankStore();
  const { objects, substrate, water, selectObject } = useSceneStore();
  const { showGrid } = useUIStore();

  const handleTankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only deselect if clicking on the tank background itself
    const target = e.target as HTMLElement;
    if (target.classList.contains('tank-clickable')) {
      selectObject(null);
    }
  };

  // Calculate substrate height in percentage
  const substrateHeightPercent = substrate.height;
  const waterLevelPercent = water.level;

  // Tank dimensions for display
  const tankWidth = config.dimensions.width;
  const tankHeight = config.dimensions.height;
  const tankDepth = config.dimensions.depth;

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
      {/* Tank Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: '95%',
            height: '85%',
            maxWidth: '1600px',
            maxHeight: '1000px',
          }}
        >
          {/* SVG for perspective lines and side panels */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 1 }}>
            <defs>
              {/* Gradient for left side panel */}
              <linearGradient id="leftSideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(60, 80, 100, 0.4)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(100, 140, 180, 0.2)' }} />
              </linearGradient>

              {/* Gradient for right side panel */}
              <linearGradient id="rightSideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: 'rgba(100, 140, 180, 0.2)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(60, 80, 100, 0.4)' }} />
              </linearGradient>

              {/* Gradient for bottom side panel */}
              <linearGradient id="bottomSideGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'rgba(80, 100, 120, 0.3)' }} />
                <stop offset="100%" style={{ stopColor: 'rgba(40, 50, 60, 0.5)' }} />
              </linearGradient>
            </defs>

            {/* Left side panel (depth perspective) */}
            <polygon
              points="0,2 5,0 5,98 0,100"
              fill="url(#leftSideGradient)"
              stroke="rgba(100, 140, 180, 0.5)"
              strokeWidth="0.3"
            />

            {/* Right side panel (depth perspective) */}
            <polygon
              points="100,2 95,0 95,98 100,100"
              fill="url(#rightSideGradient)"
              stroke="rgba(100, 140, 180, 0.5)"
              strokeWidth="0.3"
            />

            {/* Bottom side panel (depth perspective) */}
            <polygon
              points="0,100 5,98 95,98 100,100"
              fill="url(#bottomSideGradient)"
              stroke="rgba(80, 100, 120, 0.6)"
              strokeWidth="0.3"
            />

            {/* Substrate top surface gradient */}
            <defs>
              <linearGradient id="substrateTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: substrate.color, stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#0d0d0d', stopOpacity: 0.95 }} />
              </linearGradient>
              <linearGradient id="substrateFrontGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: substrate.color, stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#0a0a0a', stopOpacity: 1 }} />
              </linearGradient>
              {/* Noise pattern for grainy texture */}
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                <feColorMatrix type="saturate" values="0"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feBlend in="SourceGraphic" mode="overlay"/>
              </filter>
            </defs>

            {/* Substrate top surface (the visible top of the sand bed with perspective) */}
            <polygon
              points={`5,${98 - substrateHeightPercent * 0.98} 95,${98 - substrateHeightPercent * 0.98} 95,98 5,98`}
              fill="url(#substrateTopGradient)"
              filter="url(#noise)"
            />

            {/* Substrate front face (visible front edge) */}
            <rect
              x="5"
              y={98 - substrateHeightPercent * 0.98}
              width="90"
              height={substrateHeightPercent * 0.98}
              fill="url(#substrateFrontGradient)"
              filter="url(#noise)"
            />

            {/* Substrate on left side panel */}
            <polygon
              points={`0,${100 - substrateHeightPercent} 5,${98 - substrateHeightPercent * 0.98} 5,98 0,100`}
              fill={substrate.color}
              opacity="0.7"
              filter="url(#noise)"
            />

            {/* Substrate on right side panel */}
            <polygon
              points={`100,${100 - substrateHeightPercent} 95,${98 - substrateHeightPercent * 0.98} 95,98 100,100`}
              fill={substrate.color}
              opacity="0.7"
              filter="url(#noise)"
            />

            {/* Perspective lines (edges showing depth) */}
            {/* Top left to back */}
            <line x1="0" y1="2" x2="5" y2="0" stroke="rgba(100, 150, 200, 0.6)" strokeWidth="0.3" />
            {/* Top right to back */}
            <line x1="100" y1="2" x2="95" y2="0" stroke="rgba(100, 150, 200, 0.6)" strokeWidth="0.3" />
            {/* Bottom left to back */}
            <line x1="0" y1="100" x2="5" y2="98" stroke="rgba(100, 150, 200, 0.6)" strokeWidth="0.3" />
            {/* Bottom right to back */}
            <line x1="100" y1="100" x2="95" y2="98" stroke="rgba(100, 150, 200, 0.6)" strokeWidth="0.3" />
          </svg>

          {/* Glass frame - outer border */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(100, 180, 220, 0.3), rgba(150, 200, 230, 0.2))',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              zIndex: 2,
            }}
          >
            {/* Top glass rim */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: '2%',
                background: 'linear-gradient(to bottom, rgba(100, 180, 220, 0.4), rgba(150, 200, 230, 0.3))',
                borderBottom: '1px solid rgba(100, 150, 200, 0.3)',
              }}
            />

            {/* Bottom glass rim */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '3%',
                background: 'linear-gradient(to top, rgba(60, 80, 100, 0.5), rgba(100, 130, 160, 0.4))',
                borderTop: '1px solid rgba(80, 110, 140, 0.4)',
              }}
            />

            {/* Left glass edge */}
            <div
              className="absolute top-0 bottom-0 left-0"
              style={{
                width: '0.8%',
                background: 'linear-gradient(to right, rgba(80, 120, 160, 0.5), rgba(120, 160, 200, 0.3))',
                borderRight: '1px solid rgba(100, 150, 200, 0.3)',
              }}
            />

            {/* Right glass edge */}
            <div
              className="absolute top-0 bottom-0 right-0"
              style={{
                width: '0.8%',
                background: 'linear-gradient(to left, rgba(80, 120, 160, 0.5), rgba(120, 160, 200, 0.3))',
                borderLeft: '1px solid rgba(100, 150, 200, 0.3)',
              }}
            />
          </div>

          {/* Inner tank area */}
          <div
            ref={tankRef}
            onClick={handleTankClick}
            className="absolute tank-clickable"
            style={{
              left: '0.8%',
              right: '0.8%',
              top: '2%',
              bottom: '3%',
              background: 'linear-gradient(to bottom, rgba(240, 248, 255, 0.8), rgba(230, 240, 250, 0.9))',
              boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.05)',
              zIndex: 3,
            }}
          >
            {/* Substrate layer - empty space reserved, actual substrate rendered in SVG */}

            {/* Water layer with subtle blue tint */}
            <div
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                bottom: `${substrateHeightPercent}%`,
                height: `${waterLevelPercent - substrateHeightPercent}%`,
                background: 'linear-gradient(to bottom, rgba(135, 206, 235, 0.08), rgba(70, 130, 180, 0.15))',
              }}
            />

            {/* Glass reflection effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(100deg, rgba(255, 255, 255, 0.4) 0%, transparent 20%, transparent 80%, rgba(255, 255, 255, 0.2) 100%)',
              }}
            />

            {/* Grid overlay */}
            {showGrid && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(150, 170, 190, 0.15) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(150, 170, 190, 0.15) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px',
                }}
              />
            )}

            {/* Scene objects */}
            {objects.map((obj) => (
              <DraggableItem key={obj.id} object={obj} containerRef={tankRef} />
            ))}
          </div>

          {/* Outer frame border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              border: '2px solid rgba(100, 140, 180, 0.5)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              zIndex: 10,
            }}
          />

          {/* Water surface highlight */}
          <div
            className="absolute left-0 right-0 pointer-events-none"
            style={{
              left: '0.8%',
              right: '0.8%',
              top: `calc(2% + ${100 - waterLevelPercent}% * 0.95)`,
              height: '2px',
              background: 'linear-gradient(to right, transparent 5%, rgba(135, 206, 235, 0.5) 50%, transparent 95%)',
              boxShadow: '0 0 8px rgba(135, 206, 235, 0.3)',
              zIndex: 4,
            }}
          />

          {/* Tank info overlay */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-800 text-sm pointer-events-none border border-gray-300 shadow-lg" style={{ zIndex: 20 }}>
            <div className="font-bold text-blue-600">{tankWidth} × {tankHeight} × {tankDepth} cm</div>
            <div className="text-xs text-gray-600 mt-1">
              {config.volumeLiters.toFixed(1)}L ({config.volumeGallons.toFixed(1)} gal)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TankView2D;
