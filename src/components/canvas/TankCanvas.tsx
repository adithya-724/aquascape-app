import React, { useRef, useEffect, useCallback } from 'react';
import { useTankStore } from '../../store/tankStore';
import { useSceneStore } from '../../store/sceneStore';
import DraggableItem from './DraggableItem';

const TankCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tankAreaRef = useRef<HTMLDivElement>(null);
  const { config } = useTankStore();
  const { substrate, water, objects, selectObject } = useSceneStore();

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
    const backPanelColor = 'rgba(245, 248, 250, 0.95)';

    // ==================== BACK PANEL (creates depth) ====================
    ctx.fillStyle = backPanelColor;
    ctx.beginPath();
    ctx.moveTo(tankX + perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + perspectiveDepth);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.lineTo(tankX + perspectiveDepth, tankY + tankHeight - perspectiveDepth);
    ctx.closePath();
    ctx.fill();

    // Back panel subtle border
    ctx.strokeStyle = 'rgba(180, 200, 210, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // ==================== LEFT SIDE PANEL (perspective) ====================
    const leftGradient = ctx.createLinearGradient(tankX, 0, tankX + perspectiveDepth, 0);
    leftGradient.addColorStop(0, 'rgba(220, 235, 240, 0.7)');
    leftGradient.addColorStop(1, 'rgba(245, 250, 252, 0.3)');

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
    rightGradient.addColorStop(0, 'rgba(245, 250, 252, 0.3)');
    rightGradient.addColorStop(1, 'rgba(220, 235, 240, 0.7)');

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
    bottomGradient.addColorStop(0, 'rgba(240, 245, 248, 0.4)');
    bottomGradient.addColorStop(1, 'rgba(200, 215, 225, 0.6)');

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

    // Create grainy texture pattern
    const createGrainPattern = () => {
      const offscreen = document.createElement('canvas');
      offscreen.width = 128;
      offscreen.height = 128;
      const offCtx = offscreen.getContext('2d')!;

      offCtx.fillStyle = '#1a1a1a';
      offCtx.fillRect(0, 0, 128, 128);

      const imageData = offCtx.getImageData(0, 0, 128, 128);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 35;
        imageData.data[i] = Math.max(0, Math.min(255, 26 + noise));
        imageData.data[i + 1] = Math.max(0, Math.min(255, 26 + noise));
        imageData.data[i + 2] = Math.max(0, Math.min(255, 26 + noise));
      }
      offCtx.putImageData(imageData, 0, 0);

      return ctx.createPattern(offscreen, 'repeat')!;
    };

    const grainPattern = createGrainPattern();

    // Draw substrate TOP surface (visible flat top with perspective)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(tankX + glassThickness, substrateTopY);
    ctx.lineTo(tankX + perspectiveDepth, substrateBackTopY);
    ctx.lineTo(tankX + tankWidth - perspectiveDepth, substrateBackTopY);
    ctx.lineTo(tankX + tankWidth - glassThickness, substrateTopY);
    ctx.closePath();
    ctx.fillStyle = '#1f1f1f';
    ctx.fill();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = grainPattern;
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
    frontGrad.addColorStop(0, '#1a1a1a');
    frontGrad.addColorStop(1, '#0f0f0f');
    ctx.fillStyle = frontGrad;
    ctx.fill();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = grainPattern;
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

  }, [substrate.height, substrate.color, water.level]);

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
