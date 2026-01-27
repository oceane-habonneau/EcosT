import React, { useState, useCallback, useRef } from 'react';
import { Settings, Eye, Move, Link2, RotateCcw, MapPin, PlusCircle } from 'lucide-react';
import Node, { NodeData, Category } from './components/Node';
import Connection from './components/Connection';

// Initial nodes data based on the diagram
const initialNodes: NodeData[] = [
  // Center
  { id: 'pms', label: 'PMS', category: 'gestion', position: { x: 550, y: 400 }, connections: 8, icon: 'monitor' },
  
  // Inner circle - Gestion
  { id: 'crm', label: 'CRM', category: 'gestion', position: { x: 750, y: 450 }, connections: 1, icon: 'users' },
  { id: 'erp', label: 'ERP\nComptabilité', category: 'gestion', position: { x: 550, y: 650 }, connections: 1, icon: 'grid' },
  { id: 'channel', label: 'Channel\nManager', category: 'distribution', position: { x: 400, y: 380 }, connections: 1, icon: 'share' },
  
  // Middle circle - Various services
  { id: 'psp', label: 'PSP', category: 'experience', position: { x: 350, y: 520 }, connections: 1, icon: 'card' },
  { id: 'pos', label: 'POS\nRestaurant', category: 'restauration', position: { x: 380, y: 620 }, connections: 1, icon: 'utensils' },
  { id: 'spa', label: 'SPA', category: 'bien-etre', position: { x: 700, y: 630 }, connections: 2, icon: 'sparkles' },
  { id: 'booking1', label: 'Moteur de\nréservation', category: 'reservations', position: { x: 240, y: 350 }, connections: 1, icon: 'calendar' },
  { id: 'booking2', label: 'Moteur de\nréservation', category: 'reservations', position: { x: 180, y: 600 }, connections: 1, icon: 'calendar' },
  { id: 'booking3', label: 'Moteur de\nréservation', category: 'reservations', position: { x: 850, y: 600 }, connections: 1, icon: 'calendar' },
  { id: 'exp', label: 'Exp Client -\nIn house', category: 'experience', position: { x: 850, y: 350 }, connections: 1, icon: 'home' },
  { id: 'chatbot', label: 'Chatbot', category: 'experience', position: { x: 720, y: 340 }, connections: 1, icon: 'message' },
  
  // Outer circle - Client-facing
  { id: 'website', label: 'Site Internet', category: 'distribution', position: { x: 380, y: 260 }, connections: 7, icon: 'globe' },
  { id: 'sales', label: 'Canaux de\nvente', category: 'distribution', position: { x: 550, y: 200 }, connections: 1, icon: 'globe' },
  { id: 'reputation', label: 'E-réputation', category: 'experience', position: { x: 750, y: 270 }, connections: 1, icon: 'star' },
  { id: 'boutique', label: 'E-boutique\n& chèque\ncadeau', category: 'distribution', position: { x: 200, y: 480 }, connections: 1, icon: 'shopping' },
];

// Connections mapping
const initialConnections: Record<string, string[]> = {
  'pms': ['crm', 'erp', 'channel', 'psp', 'pos', 'spa', 'booking1', 'exp'],
  'channel': ['sales'],
  'booking1': ['website'],
  'psp': ['boutique'],
  'pos': ['booking2'],
  'spa': ['booking3'],
  'chatbot': ['website'],
  'website': ['reputation'],
};

const categoryInfo: Record<Category, { label: string; color: string }> = {
  'gestion': { label: 'Gestion & Opérations', color: '#10b981' },
  'reservations': { label: 'Réservations', color: '#3b82f6' },
  'distribution': { label: 'Distribution & Ventes', color: '#f59e0b' },
  'experience': { label: 'Expérience Client', color: '#06b6d4' },
  'restauration': { label: 'Restauration', color: '#ef4444' },
  'bien-etre': { label: 'Bien-être', color: '#a855f7' },
};

function App() {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDragMode, setIsDragMode] = useState(true);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle node drag start
  const handleDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    if (!isDragMode) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - rect.left - node.position.x,
      y: e.clientY - rect.top - node.position.y,
    });
  }, [isDragMode, nodes]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingNode || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 140));
    const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 120));

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggingNode
          ? { ...node, position: { x: newX, y: newY } }
          : node
      )
    );
  }, [draggingNode, dragOffset]);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDraggingNode(null);
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: string) => {
    if (!isDragMode) {
      setSelectedNode(prev => prev === nodeId ? null : nodeId);
    }
  }, [isDragMode]);

  // Reset connections
  const handleResetConnections = () => {
    setConnections(initialConnections);
  };

  // Reset positions
  const handleResetPositions = () => {
    setNodes(initialNodes);
  };

  // Get highlighted connections
  const getHighlightedConnections = useCallback(() => {
    if (!selectedNode) return new Set<string>();

    const highlighted = new Set<string>();
    const directConnections = connections[selectedNode] || [];
    
    directConnections.forEach(targetId => {
      highlighted.add(`${selectedNode}-${targetId}`);
    });

    return highlighted;
  }, [selectedNode, connections]);

  const highlightedConnections = getHighlightedConnections();

  // Render all connections
  const renderConnections = () => {
    const lines: JSX.Element[] = [];
    const nodesMap = new Map(nodes.map(n => [n.id, n]));

    Object.entries(connections).forEach(([fromId, toIds]) => {
      const fromNode = nodesMap.get(fromId);
      if (!fromNode) return;

      toIds.forEach(toId => {
        const toNode = nodesMap.get(toId);
        if (!toNode) return;

        const connectionKey = `${fromId}-${toId}`;
        const isHighlighted = highlightedConnections.has(connectionKey);
        const color = categoryInfo[fromNode.category].color;

        lines.push(
          <Connection
            key={connectionKey}
            from={fromNode}
            to={toNode}
            isHighlighted={isHighlighted}
            color={color}
          />
        );
      });
    });

    return lines;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-center mb-2 font-display">
          Schéma écosystème hôtelier
        </h1>
        <p className="text-center text-gray-600 mb-6">Océane Habonneau</p>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          {/* Admin/Public Mode */}
          <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <button
              onClick={() => setIsAdminMode(true)}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors ${
                isAdminMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Mode Administration
            </button>
            <button
              onClick={() => setIsAdminMode(false)}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors ${
                !isAdminMode
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Vue Publique
            </button>
          </div>

          {isAdminMode && (
            <>
              {/* Drag/Link Mode */}
              <div className="flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <button
                  onClick={() => setIsDragMode(true)}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors ${
                    isDragMode
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Move className="w-4 h-4" />
                  Mode Déplacement
                </button>
                <button
                  onClick={() => setIsDragMode(false)}
                  className={`px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-colors ${
                    !isDragMode
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  Mode Liaison
                </button>
              </div>

              {/* Action buttons */}
              <button
                onClick={handleResetConnections}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Réinitialiser liaisons
              </button>
              <button
                onClick={handleResetPositions}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MapPin className="w-4 h-4" />
                Réinitialiser positions
              </button>
              <button
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Ajouter carte
              </button>
            </>
          )}
        </div>

        {isDragMode && isAdminMode && (
          <div className="text-center text-sm text-blue-600 bg-blue-50 py-2 px-4 rounded-lg inline-block mx-auto">
            <Move className="w-4 h-4 inline mr-2" />
            Cliquez et glissez pour déplacer les cartes
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="max-w-7xl mx-auto">
        <div
          ref={canvasRef}
          className="relative bg-white rounded-2xl shadow-lg p-12 min-h-[800px]"
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {renderConnections()}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <Node
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              isDraggable={isDragMode && isAdminMode}
              onSelect={handleNodeSelect}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <h3 className="w-full text-center text-sm font-semibold text-gray-600 mb-2">
            Légende des catégories
          </h3>
          {Object.entries(categoryInfo).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
