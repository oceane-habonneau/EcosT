import React from 'react';
import { NodeData } from './Node';

interface ConnectionProps {
  from: NodeData;
  to: NodeData;
  isHighlighted: boolean;
  color: string;
}

const Connection: React.FC<ConnectionProps> = ({ from, to, isHighlighted, color }) => {
  // Calculate center points of nodes (approximate)
  const fromX = from.position.x + 70; // 140/2
  const fromY = from.position.y + 60; // approximate center
  const toX = to.position.x + 70;
  const toY = to.position.y + 60;

  return (
    <line
      x1={fromX}
      y1={fromY}
      x2={toX}
      y2={toY}
      stroke={isHighlighted ? color : '#cbd5e1'}
      strokeWidth={isHighlighted ? 3 : 2}
      opacity={isHighlighted ? 0.9 : 0.4}
      className="transition-all duration-300"
    />
  );
};

export default Connection;
