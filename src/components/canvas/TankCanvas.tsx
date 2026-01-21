import React, { useRef, useEffect, useCallback } from 'react';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import type { BackgroundPreset } from '../../types/scene';
import DraggableItem from './DraggableItem';

const TankCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tankAreaRef = useRef<HTMLDivElement>(null);
  const { config } = useTankStore();
  const { substrate, water, background, objects, selectObject } = useSceneStore();

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Tank dimensions and positioning
    const padding = 40;
    const tankWidth = width - padding * 2;
    const tankHeight = height - padding * 2;
    const tankX = padding;
    const tankY = padding;

    // Perspective depth (how much the back panel is inset)
    const perspectiveDepth = Math.min(tankWidth * 0.06, tankHeight * 0.08);

    // Substrate height (percentage of tank interior)
    const substratePercent = substrate.height / 100;
    const substrateHeight = tankHeight * substratePercent * 0.85;

    // Glass thickness
    const glassThickness = 3;

    // Colors
    const glassColor = 'rgba(127, 219, 202, 0.9)'; // Cyan/teal for rim

    // ==================== BACK PANEL (creates depth) ====================
    // Draw background based on preset
    const drawBackground = (preset: BackgroundPreset) => {
      const bgX = tankX + perspectiveDepth;
      const bgY = tankY + perspectiveDepth;
      const bgWidth = tankWidth - perspectiveDepth * 2;
      const bgHeight = tankHeight - perspectiveDepth * 2;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bgX, bgY);
      ctx.lineTo(bgX + bgWidth, bgY);
      ctx.lineTo(bgX + bgWidth, bgY + bgHeight);
      ctx.lineTo(bgX, bgY + bgHeight);
      ctx.closePath();
      ctx.clip();

      switch (preset) {
        case 'black':
          // Solid black background
          ctx.fillStyle = '#0a0a0a';
          ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
          break;

        case 'stone-3d':
          // Dark background with embedded 3D stones
          const stoneGradient = ctx.createLinearGradient(bgX, bgY, bgX, bgY + bgHeight);
          stoneGradient.addColorStop(0, '#2d2d2d');
          stoneGradient.addColorStop(0.5, '#1a1a1a');
          stoneGradient.addColorStop(1, '#0f0f0f');
          ctx.fillStyle = stoneGradient;
          ctx.fillRect(bgX, bgY, bgWidth, bgHeight);

          // Draw embedded stones
          const stones = [
            { x: 0.08, y: 0.12, w: 0.18, h: 0.10, color: '#4a4a4a' },
            { x: 0.75, y: 0.08, w: 0.15, h: 0.08, color: '#3d3d3d' },
            { x: 0.35, y: 0.05, w: 0.12, h: 0.07, color: '#454545' },
            { x: 0.55, y: 0.15, w: 0.20, h: 0.12, color: '#3a3a3a' },
            { x: 0.15, y: 0.28, w: 0.22, h: 0.14, color: '#484848' },
            { x: 0.82, y: 0.25, w: 0.14, h: 0.10, color: '#404040' },
            { x: 0.45, y: 0.35, w: 0.16, h: 0.09, color: '#4d4d4d' },
            { x: 0.05, y: 0.45, w: 0.14, h: 0.08, color: '#424242' },
            { x: 0.65, y: 0.42, w: 0.18, h: 0.11, color: '#3c3c3c' },
            { x: 0.28, y: 0.50, w: 0.20, h: 0.13, color: '#464646' },
            { x: 0.88, y: 0.48, w: 0.10, h: 0.07, color: '#3e3e3e' },
            { x: 0.12, y: 0.62, w: 0.16, h: 0.10, color: '#4b4b4b' },
            { x: 0.50, y: 0.58, w: 0.22, h: 0.14, color: '#393939' },
            { x: 0.78, y: 0.65, w: 0.15, h: 0.09, color: '#434343' },
          ];

          stones.forEach((stone) => {
            const sx = bgX + stone.x * bgWidth;
            const sy = bgY + stone.y * bgHeight;
            const sw = stone.w * bgWidth;
            const sh = stone.h * bgHeight;

            // Stone shadow (recessed effect)
            ctx.fillStyle = '#0a0a0a';
            ctx.beginPath();
            ctx.ellipse(sx + sw / 2 + 2, sy + sh / 2 + 2, sw / 2, sh / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Main stone body
            const stoneGrad = ctx.createRadialGradient(
              sx + sw * 0.35, sy + sh * 0.35, 0,
              sx + sw / 2, sy + sh / 2, Math.max(sw, sh) / 2
            );
            stoneGrad.addColorStop(0, stone.color);
            stoneGrad.addColorStop(0.7, `${stone.color}dd`);
            stoneGrad.addColorStop(1, '#1a1a1a');

            ctx.fillStyle = stoneGrad;
            ctx.beginPath();
            ctx.ellipse(sx + sw / 2, sy + sh / 2, sw / 2, sh / 2, 0, 0, Math.PI * 2);
            ctx.fill();

            // Highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            ctx.beginPath();
            ctx.ellipse(sx + sw * 0.35, sy + sh * 0.35, sw * 0.25, sh * 0.2, -0.3, 0, Math.PI * 2);
            ctx.fill();
          });
          break;

        case 'none':
        default:
          // Default light panel background
          ctx.fillStyle = 'rgba(245, 248, 250, 0.95)';
          ctx.fillRect(bgX, bgY, bgWidth, bgHeight);
          break;
      }

      ctx.restore();
    };

    drawBackground(background.preset);

    // Back panel subtle border
    ctx.beginPath();
    ctx.moveTo(tankX + perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX + perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.closePath();
    ctx.strokeStyle = background.preset === 'none' ? 'rgba(180, 200, 210, 0.5)' : 'rgba(60, 60, 60, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ==================== LEFT SIDE PANEL (perspective) ====================
    const isDarkBg = background.preset === 'black' || background.preset === 'stone-3d';
    const leftGradient = ctx.createLinearGradient(tankX, 0, tankX + perspectiveDepth, 0);
    if (isDarkBg) {
      leftGradient.addColorStop(0, 'rgba(60, 70, 80, 0.7)');
      leftGradient.addColorStop(1, 'rgba(30, 35, 40, 0.3)');
    } else {
      leftGradient.addColorStop(0, 'rgba(220, 235, 240, 0.7)');
      leftGradient.addColorStop(1, 'rgba(245, 250, 252, 0.3)');
    }

    ctx.fillStyle = leftGradient;
    ctx.beginPath();
    ctx.moveTo(tankX, tankY);
    ctx.lineTo(tankX + perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX, tankY + tankHeight);
    ctx.closePath();
    ctx.fill();

    // ==================== RIGHT SIDE PANEL (perspective) ====================
    const rightGradient = ctx.createLinearGradient(tankX + tankWidth - perspectiveDepth, 0, tankX + tankWidth, 0);
    if (isDarkBg) {
      rightGradient.addColorStop(0, 'rgba(30, 35, 40, 0.3)');
      rightGradient.addColorStop(1, 'rgba(60, 70, 80, 0.7)');
    } else {
      rightGradient.addColorStop(0, 'rgba(245, 250, 252, 0.3)');
      rightGradient.addColorStop(1, 'rgba(220, 235, 240, 0.7)');
    }

    ctx.fillStyle = rightGradient;
    ctx.beginPath();
    ctx.moveTo(tankX + tankWidth, tankY);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX + tankWidth, tankY + tankHeight);
    ctx.closePath();
    ctx.fill();

    // ==================== BOTTOM PANEL (perspective floor) ====================
    const bottomGradient = ctx.createLinearGradient(0, tankY + tankHeight - perspectiveDepth, 0, tankY + tankHeight);
    if (isDarkBg) {
      bottomGradient.addColorStop(0, 'rgba(25, 30, 35, 0.4)');
      bottomGradient.addColorStop(1, 'rgba(40, 50, 60, 0.6)');
    } else {
      bottomGradient.addColorStop(0, 'rgba(240, 245, 248, 0.4)');
      bottomGradient.addColorStop(1, 'rgba(200, 215, 225, 0.6)');
    }

    ctx.fillStyle = bottomGradient;
    ctx.beginPath();
    ctx.moveTo(tankX, tankY + tankHeight);
    ctx.lineTo(tankX + perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX + tankWidth, tankY + tankHeight);
    ctx.closePath();
    ctx.fill();

    // ==================== SUBSTRATE ====================
    // Calculate substrate coordinates - flush with tank walls
    const substrateTopY = tankY + tankHeight - substrateHeight;
    const substrateBackTopY = tankY + tankHeight - perspectiveDepth - (substrateHeight * 0.85);

    // Parse hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 128, g: 128, b: 128 };
    };

    const baseColor = hexToRgb(substrate.color);

    // Create substrate texture pattern based on type
    const createSubstratePattern = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 128;
      offscreen.height = 128;
      const offCtx = offscreen.getContext('2d')!;

      // Fill with base color
      offCtx.fillStyle = substrate.color;
      offCtx.fillRect(0, 0, 128, 128);

      if (substrate.type === 'sand') {
        // Fine sand texture - small noise particles
        const imageData = offCtx.getImageData(0, 0, 128, 128);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 25;
          imageData.data[i] = Math.max(0, Math.min(255, baseColor.r + noise));
          imageData.data[i + 1] = Math.max(0, Math.min(255, baseColor.g + noise));
          imageData.data[i + 2] = Math.max(0, Math.min(255, baseColor.b + noise));
        }
        offCtx.putImageData(imageData, 0, 0);
      } else if (substrate.type === 'gravel') {
        // Gravel texture - larger pebble-like shapes
        const imageData = offCtx.getImageData(0, 0, 128, 128);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 50;
          imageData.data[i] = Math.max(0, Math.min(255, baseColor.r + noise));
          imageData.data[i + 1] = Math.max(0, Math.min(255, baseColor.g + noise));
          imageData.data[i + 2] = Math.max(0, Math.min(255, baseColor.b + noise));
        }
        offCtx.putImageData(imageData, 0, 0);

        // Add pebble shapes
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * 128;
          const y = Math.random() * 128;
          const radius = 3 + Math.random() * 6;
          const brightness = (Math.random() - 0.5) * 60;

          offCtx.beginPath();
          offCtx.ellipse(x, y, radius, radius * 0.7, Math.random() * Math.PI, 0, Math.PI * 2);
          offCtx.fillStyle = `rgb(${Math.max(0, Math.min(255, baseColor.r + brightness))}, ${Math.max(0, Math.min(255, baseColor.g + brightness))}, ${Math.max(0, Math.min(255, baseColor.b + brightness))})`;
          offCtx.fill();
        }
      } else {
        // Soil/mud texture - organic grainy look
        const imageData = offCtx.getImageData(0, 0, 128, 128);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 35;
          imageData.data[i] = Math.max(0, Math.min(255, baseColor.r + noise));
          imageData.data[i + 1] = Math.max(0, Math.min(255, baseColor.g + noise));
          imageData.data[i + 2] = Math.max(0, Math.min(255, baseColor.b + noise));
        }
        offCtx.putImageData(imageData, 0, 0);
      }

      return ctx.createPattern(offscreen, 'repeat')!;
    };

    const substratePattern = createSubstratePattern();

    // Create darker version of substrate color for gradients
    const darkerColor = `rgb(${Math.max(0, baseColor.r - 30)}, ${Math.max(0, baseColor.g - 30)}, ${Math.max(0, baseColor.b - 30)})`;
    const darkestColor = `rgb(${Math.max(0, baseColor.r - 50)}, ${Math.max(0, baseColor.g - 50)}, ${Math.max(0, baseColor.b - 50)})`;

    // Draw substrate TOP surface (visible flat top with perspective)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tankX + glassThickness, substrateTopY);
    ctx.lineTo(tankX + perspectiveDepth, substrateBackTopY);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, substrateBackTopY);
    ctx.lineTo(tankX + tankWidth - glassThickness, substrateTopY);
    ctx.closePath();
    ctx.fillStyle = darkerColor;
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = substratePattern;
    ctx.fill();
    ctx.restore();

    // Draw substrate FRONT face (main visible vertical face)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tankX + glassThickness, substrateTopY);
    ctx.lineTo(tankX + tankWidth - glassThickness, substrateTopY);
    ctx.lineTo(tankX + tankWidth - glassThickness, tankY + tankHeight - glassThickness);
    ctx.lineTo(tankX + glassThickness, tankY + tankHeight - glassThickness);
    ctx.closePath();

    const frontGrad = ctx.createLinearGradient(0, substrateTopY, 0, tankY + tankHeight);
    frontGrad.addColorStop(0, substrate.color);
    frontGrad.addColorStop(1, darkestColor);
    ctx.fillStyle = frontGrad;
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = substratePattern;
    ctx.fill();
    ctx.restore();

    // ==================== GLASS FRAME (cyan/teal rim) ====================
    // Top rim
    ctx.fillStyle = glassColor;
    ctx.fillRect(tankX, tankY, tankWidth, glassThickness);

    // Bottom rim
    ctx.fillRect(tankX, tankY + tankHeight - glassThickness, tankWidth, glassThickness);

    // Left rim
    ctx.fillRect(tankX, tankY, glassThickness, tankHeight);

    // Right rim
    ctx.fillRect(tankX + tankWidth - glassThickness, tankY, glassThickness, tankHeight);

    // ==================== PERSPECTIVE EDGE LINES ====================
    ctx.strokeStyle = 'rgba(180, 210, 220, 0.6)';
    ctx.lineWidth = 1;

    // Top left corner to back
    ctx.beginPath();
    ctx.moveTo(tankX + glassThickness, tankY + glassThickness);
    ctx.lineTo(tankX + perspectiveDepth, tankY + perspectiveDepth);
    ctx.stroke();

    // Top right corner to back
    ctx.beginPath();
    ctx.moveTo(tankX + tankWidth - glassThickness, tankY + glassThickness);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + perspectiveDepth);
    ctx.stroke();

    // Note: Bottom perspective lines removed - substrate covers that area

    // ==================== OUTER SHADOW ====================
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.strokeStyle = 'rgba(150, 180, 200, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(tankX, tankY, tankWidth, tankHeight);
    ctx.shadowColor = 'transparent';

  }, [substrate.height, substrate.color, substrate.type, water.level, background.preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        draw(ctx, rect.width, rect.height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  // Tank dimensions for display
  const tankWidth = config.dimensions.width;
  const tankHeight = config.dimensions.height;
  const tankDepth = config.dimensions.depth;

  // Handle click on tank area to deselect objects
  const handleTankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target === tankAreaRef.current) {
      selectObject(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Interactive tank area for draggable objects */}
      <div
        ref={tankAreaRef}
        onClick={handleTankClick}
        className="absolute"
        style={{
          left: '40px',
          top: '40px',
          right: '40px',
          bottom: '40px',
        }}
      >
        {/* Scene objects */}
        {objects.map((obj) => (
          <DraggableItem key={obj.id} object={obj} containerRef={tankAreaRef} />
        ))}
      </div>

      {/* Tank info overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-800 text-sm pointer-events-none border border-gray-300 shadow-lg z-10">
        <div className="font-bold text-blue-600">{tankWidth} × {tankHeight} × {tankDepth} cm</div>
        <div className="text-xs text-gray-600 mt-1">
          {config.volumeLiters.toFixed(1)}L ({config.volumeGallons.toFixed(1)} gal)
        </div>
      </div>
    </div>
  );
};

export default TankCanvas;
