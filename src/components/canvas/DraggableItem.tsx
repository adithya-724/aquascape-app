import React, { useRef, useState, useEffect } from 'react';
import { useSceneStore } from '../../store/sceneStore';
import type { SceneObject } from '../../types/scene';
import { Mountain, Trees, Box } from 'lucide-react';

interface DraggableItemProps {
  object: SceneObject;
  containerRef: React.RefObject<HTMLDivElement>;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ object, containerRef }) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { selectedObjectId, selectObject, updateObject } = useSceneStore();
  const isSelected = selectedObjectId === object.id;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectObject(object.id);
    setIsDragging(true);

    if (itemRef.current && containerRef.current) {
      const itemRect = itemRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setDragOffset({
        x: e.clientX - itemRect.left,
        y: e.clientY - itemRect.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, containerRef, object.id, updateObject]);

  // Get icon based on type
  const getIcon = () => {
    switch (object.type) {
      case 'rock':
        return <Mountain size={32} className="text-slate-600" />;
      case 'driftwood':
        return <Box size={32} className="text-amber-700" />;
      case 'plant':
        return <Trees size={32} className="text-green-600" />;
      default:
        return <Box size={32} />;
    }
  };

  return (
    <div
      ref={itemRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move transition-all ${
        isDragging ? 'scale-110 opacity-80' : ''
      } ${isSelected ? 'ring-4 ring-primary ring-offset-2' : ''}`}
      style={{
        left: `${object.position.x}%`,
        top: `${object.position.y}%`,
        transform: `rotate(${object.rotation}deg) scale(${object.scale})`,
        zIndex: isSelected ? 1000 : 1,
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
    </div>
  );
};

export default DraggableItem;
