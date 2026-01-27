import React, { useRef, useState, useCallback } from 'react';
import { 
  Monitor, Users, Grid3x3, Share2, CreditCard, UtensilsCrossed, 
  Sparkles, Calendar, Home, MessageCircle, Globe, Star, ShoppingBag 
} from 'lucide-react';

export type Category = 'gestion' | 'reservations' | 'distribution' | 'experience' | 'restauration' | 'bien-etre';

export interface NodeData {
  id: string;
  label: string;
  category: Category;
  position: { x: number; y: number };
  connections: number;
  icon: string;
}

interface NodeProps {
  node: NodeData;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onDragEnd: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  'monitor': Monitor,
  'users': Users,
  'grid': Grid3x3,
  'share': Share2,
  'card': CreditCard,
  'utensils': UtensilsCrossed,
  'sparkles': Sparkles,
  'calendar': Calendar,
  'home': Home,
  'message': MessageCircle,
  'globe': Globe,
  'star': Star,
  'shopping': ShoppingBag,
};

const categoryColors: Record<Category, string> = {
  'gestion': '#10b981',
  'reservations': '#3b82f6',
  'distribution': '#f59e0b',
  'experience': '#06b6d4',
  'restauration': '#ef4444',
  'bien-etre': '#a855f7',
};

const Node: React.FC<NodeProps> = ({
  node,
  isSelected,
  isDraggable,
  onSelect,
  onDragStart,
  onDragEnd,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const Icon = iconMap[node.icon] || Monitor;
  const borderColor = categoryColors[node.category];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isDraggable) {
      setIsDragging(true);
      onDragStart(node.id, e);
    } else {
      onSelect(node.id);
    }
  }, [isDraggable, node.id, onDragStart, onSelect]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      onDragEnd();
    }
  }, [isDragging, onDragEnd]);

  return (
    <div
      ref={nodeRef}
      className={`
        absolute bg-white rounded-2xl shadow-lg border-2 p-4 flex flex-col items-center justify-center gap-2
        transition-all duration-200 cursor-pointer select-none
        ${isSelected ? 'ring-2 ring-offset-2' : ''}
        ${isDragging ? 'opacity-70 scale-105 z-50' : 'z-10'}
        ${isDraggable ? 'cursor-move' : 'cursor-pointer'}
        hover:scale-105 hover:shadow-xl
      `}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        borderColor: borderColor,
        minWidth: '140px',
        width: 'fit-content',
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Status indicator */}
      <div 
        className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-green-500"
        style={{ boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)' }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
        style={{ background: `linear-gradient(135deg, ${borderColor} 0%, ${borderColor}dd 100%)` }}
      >
        <Icon className="w-6 h-6 text-white" strokeWidth={2} />
      </div>

      {/* Label */}
      <div className="text-center text-sm font-bold text-gray-800 leading-tight px-2">
        {node.label.split('\n').map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </div>

      {/* Connection badge */}
      {node.connections > 0 && (
        <div
          className="absolute -bottom-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white"
          style={{ backgroundColor: '#a855f7' }}
        >
          {node.connections}
        </div>
      )}
    </div>
  );
};

export default Node;
