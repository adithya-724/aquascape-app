import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useSceneStore } from '../../store/sceneStore';
import type { SceneObject } from '../../types/scene';
import { Mountain, Trees, Box, ImageIcon, RotateCw } from 'lucide-react';

interface DraggableItemProps {
  object: SceneObject;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ object, containerRef }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotationStart, setRotationStart] = useState({ angle: 0, mouseAngle: 0 });
  const [scaleStart, setScaleStart] = useState({ scale: 1, distance: 0 });

  const { selectedObjectId, selectObject, updateObject, getCustomAsset } = useSceneStore();

  // Get custom asset if this is a custom object
  const customAsset = useMemo(() => {
    if (object.type === 'custom' && object.metadata?.customAssetId) {
      return getCustomAsset(object.metadata.customAssetId);
    }
    return undefined;
  }, [object.type, object.metadata?.customAssetId, getCustomAsset]);
  const isSelected = selectedObjectId === object.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectObject(object.id);
    setIsDragging(true);

    if (itemRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - itemRect.left,
        y: e.clientY - itemRect.top,
      });
    }
  };

  // Get item center for rotation calculations
  const getItemCenter = () => {
    if (!itemRef.current) return { x: 0, y: 0 };
    const rect = itemRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // Handle rotation start
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const center = getItemCenter();
    const mouseAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
    setRotationStart({ angle: object.rotation, mouseAngle });
    setIsRotating(true);
  };

  // Handle scale start
  const handleScaleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const center = getItemCenter();
    const distance = Math.sqrt(
      Math.pow(e.clientX - center.x, 2) + Math.pow(e.clientY - center.y, 2)
    );
    setScaleStart({ scale: object.scale, distance });
    setIsScaling(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();

        // Calculate new position relative to container
        let newX = ((e.clientX - containerRect.left - dragOffset.x) / containerRect.width) * 100;
        let newY = ((e.clientY - containerRect.top - dragOffset.y) / containerRect.height) * 100;

        // Constrain to container bounds
        newX = Math.max(0, Math.min(95, newX));
        newY = Math.max(0, Math.min(95, newY));

        updateObject(object.id, {
          position: { x: newX, y: newY },
        });
      }

      if (isRotating) {
        const center = getItemCenter();
        const currentAngle = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI);
        const angleDiff = currentAngle - rotationStart.mouseAngle;
        let newRotation = rotationStart.angle + angleDiff;
        // Normalize to 0-360
        newRotation = ((newRotation % 360) + 360) % 360;
        updateObject(object.id, { rotation: newRotation });
      }

      if (isScaling) {
        const center = getItemCenter();
        const currentDistance = Math.sqrt(
          Math.pow(e.clientX - center.x, 2) + Math.pow(e.clientY - center.y, 2)
        );
        const scaleFactor = currentDistance / scaleStart.distance;
        let newScale = scaleStart.scale * scaleFactor;
        // Clamp scale
        newScale = Math.max(0.2, Math.min(4, newScale));
        updateObject(object.id, { scale: newScale });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsRotating(false);
      setIsScaling(false);
    };

    if (isDragging || isRotating || isScaling) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isRotating, isScaling, dragOffset, rotationStart, scaleStart, containerRef, object.id, updateObject]);

  // Get icon based on type
  const getIcon = () => {
    switch (object.type) {
      case 'rock':
        return <Mountain size={32} className="text-slate-600" />;
      case 'driftwood':
        return <Box size={32} className="text-amber-700" />;
      case 'plant':
        return <Trees size={32} className="text-green-600" />;
      case 'custom':
        return <ImageIcon size={32} className="text-purple-600" />;
      default:
        return <Box size={32} />;
    }
  };

  // Render handles for selected objects
  const renderHandles = () => {
    if (!isSelected) return null;

    return (
      <>
        {/* Rotation handle - top center */}
        <div
          onMouseDown={handleRotateStart}
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform"
          title="Drag to rotate"
          style={{ transform: `translateX(-50%) rotate(${-object.rotation}deg)` }}
        >
          <RotateCw size={12} className="text-white" />
        </div>
        {/* Line connecting rotation handle to object */}
        <div
          className="absolute -top-6 left-1/2 w-0.5 h-4 bg-primary/50"
          style={{ transform: 'translateX(-50%)' }}
        />

        {/* Scale handles - corners */}
        <div
          onMouseDown={handleScaleStart}
          className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-primary rounded-sm cursor-nwse-resize shadow hover:scale-125 transition-transform"
          title="Drag to resize"
          style={{ transform: `rotate(${-object.rotation}deg)` }}
        />
        <div
          onMouseDown={handleScaleStart}
          className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-primary rounded-sm cursor-nwse-resize shadow hover:scale-125 transition-transform"
          title="Drag to resize"
          style={{ transform: `rotate(${-object.rotation}deg)` }}
        />
        <div
          onMouseDown={handleScaleStart}
          className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-primary rounded-sm cursor-nesw-resize shadow hover:scale-125 transition-transform"
          title="Drag to resize"
          style={{ transform: `rotate(${-object.rotation}deg)` }}
        />
        <div
          onMouseDown={handleScaleStart}
          className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-primary rounded-sm cursor-nesw-resize shadow hover:scale-125 transition-transform"
          title="Drag to resize"
          style={{ transform: `rotate(${-object.rotation}deg)` }}
        />
      </>
    );
  };

  // Render custom asset as an image
  if (object.type === 'custom' && customAsset) {
    return (
      <div
        ref={itemRef}
        onMouseDown={handleMouseDown}
        className={`absolute cursor-move transition-all ${
          isDragging ? 'opacity-80' : ''
        } ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
        style={{
          left: `${object.position.x}%`,
          top: `${object.position.y}%`,
          transform: `rotate(${object.rotation}deg) scale(${object.scale})`,
          zIndex: isSelected ? 1000 : object.zIndex,
        }}
      >
        <img
          src={customAsset.processedImage}
          alt={object.name}
          className="max-w-[120px] max-h-[120px] object-contain pointer-events-none"
          draggable={false}
        />
        {renderHandles()}
      </div>
    );
  }

  return (
    <div
      ref={itemRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move transition-all ${
        isDragging ? 'opacity-80' : ''
      } ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
        transform: `rotate(${object.rotation}deg) scale(${object.scale})`,
        zIndex: isSelected ? 1000 : object.zIndex,
      }}
    >
      <div className={`p-3 bg-white/90 rounded-lg shadow-lg border-2 ${
        isSelected ? 'border-primary' : 'border-slate-300'
      } hover:shadow-xl transition-shadow`}>
        {getIcon()}
        <div className="text-xs text-center mt-1 font-medium text-slate-700">
          {object.name}
        </div>
      </div>
      {renderHandles()}
    </div>
  );
};

export default DraggableItem;
