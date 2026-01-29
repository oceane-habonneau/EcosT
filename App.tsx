import React, { useState, useCallback, useRef } from 'react';
import { Settings, Eye, Move, Link2, RotateCcw, MapPin, PlusCircle, Download, Trash2, Edit3, X } from 'lucide-react';
import Node, { NodeData, Category } from './components/Node';
import Connection from './components/Connection';

// Simplified initial nodes
const initialNodes: NodeData[] = [
  { id: 'pms', label: 'PMS', category: 'gestion', position: { x: 550, y: 400 }, connections: 6, icon: 'monitor' },
  { id: 'channel', label: 'Channel\nManager', category: 'distribution', position: { x: 400, y: 300 }, connections: 1, icon: 'share' },
  { id: 'booking', label: 'Moteur de\nréservation', category: 'reservations', position: { x: 700, y: 300 }, connections: 1, icon: 'calendar' },
  { id: 'psp', label: 'PSP', category: 'experience', position: { x: 350, y: 500 }, connections: 1, icon: 'card' },
  { id: 'pos', label: 'POS\nRestaurant', category: 'restauration', position: { x: 400, y: 600 }, connections: 1, icon: 'utensils' },
  { id: 'ota', label: 'OTA', category: 'distribution', position: { x: 700, y: 500 }, connections: 1, icon: 'globe' },
  { id: 'crm', label: 'CRM', category: 'gestion', position: { x: 750, y: 600 }, connections: 1, icon: 'users' },
];

const initialConnections: Record<string, string[]> = {
  'pms': ['channel', 'booking', 'psp', 'pos', 'ota', 'crm'],
};

const categoryInfo: Record<Category, { label: string; color: string }> = {
  'gestion': { label: 'Gestion & Opérations', color: '#10b981' },
  'reservations': { label: 'Réservations', color: '#3b82f6' },
  'distribution': { label: 'Distribution & Ventes', color: '#f59e0b' },
  'experience': { label: 'Expérience Client', color: '#06b6d4' },
  'restauration': { label: 'Restauration', color: '#ef4444' },
  'bien-etre': { label: 'Bien-être', color: '#a855f7' },
};

const availableIcons = [
  { value: 'monitor', label: 'Ordinateur', icon: '💻' },
  { value: 'users', label: 'Utilisateurs', icon: '👥' },
  { value: 'grid', label: 'Grille', icon: '📊' },
  { value: 'share', label: 'Partage', icon: '🔗' },
  { value: 'card', label: 'Carte', icon: '💳' },
  { value: 'utensils', label: 'Restaurant', icon: '🍽️' },
  { value: 'sparkles', label: 'Étoiles', icon: '✨' },
  { value: 'calendar', label: 'Calendrier', icon: '📅' },
  { value: 'home', label: 'Maison', icon: '🏠' },
  { value: 'message', label: 'Message', icon: '💬' },
  { value: 'globe', label: 'Globe', icon: '🌐' },
  { value: 'star', label: 'Étoile', icon: '⭐' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
];

function App() {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [connections, setConnections] = useState(initialConnections);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDragMode, setIsDragMode] = useState(true);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteConnectionModal, setShowDeleteConnectionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  
  // Form states
  const [newCardLabel, setNewCardLabel] = useState('');
  const [newCardIcon, setNewCardIcon] = useState('monitor');
  const [newCardCategory, setNewCardCategory] = useState<Category>('gestion');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [deletingNodeId, setDeletingNodeId] = useState<string | null>(null);
  
  // Link mode state
  const [linkModeFirstNode, setLinkModeFirstNode] = useState<string | null>(null);
  const [deleteConnectionFrom, setDeleteConnectionFrom] = useState<string | null>(null);

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

  const handleDragEnd = useCallback(() => {
    setDraggingNode(null);
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    if (isDragMode) return;
    
    // Delete connection mode
    if (deleteConnectionFrom) {
      const fromId = deleteConnectionFrom;
      const toId = nodeId;
      
      if (fromId !== toId) {
        setConnections(prev => {
          const newConnections = { ...prev };
          if (newConnections[fromId]) {
            newConnections[fromId] = newConnections[fromId].filter(id => id !== toId);
            if (newConnections[fromId].length === 0) {
              delete newConnections[fromId];
            }
          }
          return newConnections;
        });
        
        setNodes(prevNodes => prevNodes.map(node => {
          if (node.id === fromId) {
            return { ...node, connections: Math.max(0, node.connections - 1) };
          }
          return node;
        }));
      }
      
      setDeleteConnectionFrom(null);
      setSelectedNode(null);
      return;
    }
    
    // Link mode
    if (!linkModeFirstNode) {
      setLinkModeFirstNode(nodeId);
      setSelectedNode(nodeId);
    } else if (linkModeFirstNode === nodeId) {
      setLinkModeFirstNode(null);
      setSelectedNode(null);
    } else {
      const fromId = linkModeFirstNode;
      const toId = nodeId;
      
      setConnections(prev => {
        const newConnections = { ...prev };
        if (!newConnections[fromId]) {
          newConnections[fromId] = [];
        }
        if (!newConnections[fromId].includes(toId)) {
          newConnections[fromId] = [...newConnections[fromId], toId];
        }
        return newConnections;
      });
      
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.id === fromId) {
          return { ...node, connections: node.connections + 1 };
        }
        return node;
      }));
      
      setLinkModeFirstNode(null);
      setSelectedNode(null);
    }
  }, [isDragMode, linkModeFirstNode, deleteConnectionFrom]);

  const handleResetConnections = () => {
    setConnections(initialConnections);
    setNodes(prevNodes => prevNodes.map(node => {
      const initialNode = initialNodes.find(n => n.id === node.id);
      if (initialNode) {
        return { ...node, connections: initialNode.connections };
      }
      return { ...node, connections: 0 };
    }));
  };

  const handleResetPositions = () => {
    setNodes(prevNodes => prevNodes.map(node => {
      const initialNode = initialNodes.find(n => n.id === node.id);
      if (initialNode) {
        return { ...node, position: initialNode.position };
      }
      return node;
    }));
  };

  const handleAddCard = () => {
    if (!newCardLabel.trim()) {
      alert('Veuillez entrer un libellé pour la carte');
      return;
    }
    
    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      label: newCardLabel,
      category: newCardCategory,
      position: { x: 400, y: 400 },
      connections: 0,
      icon: newCardIcon,
    };
    
    setNodes(prev => [...prev, newNode]);
    setNewCardLabel('');
    setNewCardIcon('monitor');
    setNewCardCategory('gestion');
    setShowAddModal(false);
  };

  const openEditModal = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setEditingNodeId(nodeId);
      setEditLabel(node.label);
      setShowEditModal(true);
    }
  };

  const handleEditCard = () => {
    if (!editLabel.trim()) {
      alert('Veuillez entrer un libellé');
      return;
    }
    
    setNodes(prevNodes => prevNodes.map(node =>
      node.id === editingNodeId
        ? { ...node, label: editLabel }
        : node
    ));
    
    setShowEditModal(false);
    setEditingNodeId(null);
    setEditLabel('');
  };

  const openDeleteModal = (nodeId: string) => {
    setDeletingNodeId(nodeId);
    setShowDeleteModal(true);
  };

  const handleDeleteCard = () => {
    if (!deletingNodeId) return;
    
    setNodes(prev => prev.filter(n => n.id !== deletingNodeId));
    
    setConnections(prev => {
      const newConnections = { ...prev };
      delete newConnections[deletingNodeId];
      
      Object.keys(newConnections).forEach(fromId => {
        newConnections[fromId] = newConnections[fromId].filter(toId => toId !== deletingNodeId);
        if (newConnections[fromId].length === 0) {
          delete newConnections[fromId];
        }
      });
      
      return newConnections;
    });
    
    setShowDeleteModal(false);
    setDeletingNodeId(null);
  };

  const activateDeleteConnectionMode = () => {
    setDeleteConnectionFrom(null);
    setSelectedNode(null);
    setShowDeleteConnectionModal(true);
  };

  const startDeleteConnection = () => {
    setShowDeleteConnectionModal(false);
    setIsDragMode(false);
    setLinkModeFirstNode(null);
  };

  const exportToPNG = async () => {
    if (!canvasRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `ecosysteme-hotelier-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Erreur export PNG:', error);
      alert('Erreur lors de l\'export PNG');
    }
  };

  const exportToPDF = async () => {
    if (!canvasRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(canvasRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`ecosysteme-hotelier-${Date.now()}.pdf`);
      
      setShowExportModal(false);
    } catch (error) {
      console.error('Erreur export PDF:', error);
      alert('Erreur lors de l\'export PDF');
    }
  };

  const getHighlightedConnections = useCallback(() => {
    if (!selectedNode && !deleteConnectionFrom) return new Set<string>();

    const highlighted = new Set<string>();
    const sourceNode = selectedNode || deleteConnectionFrom;
    if (!sourceNode) return highlighted;
    
    const directConnections = connections[sourceNode] || [];
    directConnections.forEach(targetId => {
      highlighted.add(`${sourceNode}-${targetId}`);
    });

    return highlighted;
  }, [selectedNode, deleteConnectionFrom, connections]);

  const highlightedConnections = getHighlightedConnections();

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 font-display">
          Schéma écosystème hôtelier
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <p className="text-center text-gray-600">Océane Habonneau</p>
          <a
            href="mailto:oceane.habonneau@gmail.com?subject=Demande de contact - Écosystème IT Hôtelier&body=Bonjour Océane,%0D%0A%0D%0AJe vous contacte suite à la consultation de votre schéma d'écosystème IT hôtelier.%0D%0A%0D%0A[Votre message ici]%0D%0A%0D%0ACordialement"
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
            title="Me contacter par email"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactez-moi
          </a>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2"
          >
            {isMobileMenuOpen ? 'Masquer le menu' : 'Afficher le menu'}
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className={`${isMobileMenuOpen || 'hidden md:flex'} flex-wrap items-center justify-center gap-2 md:gap-4 mb-6`}>
          <div className="flex w-full md:w-auto rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <button
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 md:flex-none px-3 md:px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
                isAdminMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Settings className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Mode Administration</span>
              <span className="sm:hidden">Admin</span>
            </button>
            <button
              onClick={() => setIsAdminMode(false)}
              className={`flex-1 md:flex-none px-3 md:px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
                !isAdminMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
              }`}
            >
              <Eye className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Vue Publique</span>
              <span className="sm:hidden">Public</span>
            </button>
          </div>

          {isAdminMode && (
            <>
              <div className="flex w-full md:w-auto rounded-lg overflow-hidden shadow-sm border border-gray-200">
                <button
                  onClick={() => {
                    setIsDragMode(true);
                    setLinkModeFirstNode(null);
                    setSelectedNode(null);
                    setDeleteConnectionFrom(null);
                  }}
                  className={`flex-1 md:flex-none px-3 md:px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
                    isDragMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  <Move className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Mode Déplacement</span>
                  <span className="sm:hidden">Déplacer</span>
                </button>
                <button
                  onClick={() => {
                    setIsDragMode(false);
                    setLinkModeFirstNode(null);
                    setSelectedNode(null);
                    setDeleteConnectionFrom(null);
                  }}
                  className={`flex-1 md:flex-none px-3 md:px-4 py-2 flex items-center justify-center gap-2 text-xs md:text-sm font-semibold transition-colors ${
                    !isDragMode && !deleteConnectionFrom ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                  }`}
                >
                  <Link2 className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Mode Liaison</span>
                  <span className="sm:hidden">Lier</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleResetConnections}
                  className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
                >
                  <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Réinit. liaisons</span>
                  <span className="sm:hidden">Liaisons</span>
                </button>
                <button
                  onClick={handleResetPositions}
                  className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
                >
                  <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Réinit. positions</span>
                  <span className="sm:hidden">Positions</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
                >
                  <PlusCircle className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Ajouter carte</span>
                  <span className="sm:hidden">Ajouter</span>
                </button>
                <button
                  onClick={activateDeleteConnectionMode}
                  className="px-2 md:px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
                >
                  <X className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Suppr. connexion</span>
                  <span className="sm:hidden">Suppr.</span>
                </button>
              </div>

              <button
                onClick={() => setShowExportModal(true)}
                className="w-full md:w-auto px-2 md:px-4 py-2 bg-green-500 text-white border border-green-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-1 md:gap-2 shadow-sm"
              >
                <Download className="w-3 h-3 md:w-4 md:h-4" />
                <span>Exporter</span>
              </button>
            </>
          )}
        </div>

        {isDragMode && isAdminMode && (
          <div className="text-center text-xs md:text-sm text-blue-600 bg-blue-50 py-2 px-4 rounded-lg mb-4">
            <Move className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
            Cliquez et glissez pour déplacer les cartes
          </div>
        )}
        
        {!isDragMode && isAdminMode && !deleteConnectionFrom && (
          <div className="text-center text-xs md:text-sm text-blue-600 bg-blue-50 py-2 px-4 rounded-lg mb-4">
            <Link2 className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
            {linkModeFirstNode 
              ? 'Cliquez sur une carte pour créer une connexion' 
              : 'Cliquez sur une carte source, puis sur une carte destination'}
          </div>
        )}
        
        {deleteConnectionFrom && (
          <div className="text-center text-xs md:text-sm text-red-600 bg-red-50 py-2 px-4 rounded-lg mb-4">
            <X className="w-3 h-3 md:w-4 md:h-4 inline mr-2" />
            Cliquez sur une carte pour supprimer la connexion
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        <div
          ref={canvasRef}
          className="relative bg-white rounded-xl md:rounded-2xl shadow-lg p-6 md:p-12 min-h-[600px] md:min-h-[800px] overflow-x-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {renderConnections()}
          </svg>

          {nodes.map(node => (
            <div key={node.id} className="relative" style={{ display: 'inline-block' }}>
              <Node
                node={node}
                isSelected={selectedNode === node.id || linkModeFirstNode === node.id || deleteConnectionFrom === node.id}
                isDraggable={isDragMode && isAdminMode}
                onSelect={handleNodeSelect}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
              {isAdminMode && isDragMode && (
                <div className="absolute -top-2 -right-2 flex gap-1 z-50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(node.id);
                    }}
                    className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors shadow-md"
                    title="Éditer"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(node.id);
                    }}
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-6 px-4">
          <h3 className="w-full text-center text-xs md:text-sm font-semibold text-gray-600 mb-2">
            Légende des catégories
          </h3>
          {Object.entries(categoryInfo).map(([key, { label, color }]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs md:text-sm text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center pb-8">
        <div className="text-sm text-gray-500">
          Vous préférez me contacter via LinkedIn ?{' '}
          <a
            href="https://www.linkedin.com/in/oc%C3%A9ane-habonneau-5a908212a/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            Voir mon profil LinkedIn
          </a>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          © 2026 Océane Habonneau - Tous droits réservés
        </div>
      </div>

      {/* Modals - Add, Edit, Delete, Export */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-display">Ajouter une carte</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Libellé</label>
                <input
                  type="text"
                  value={newCardLabel}
                  onChange={(e) => setNewCardLabel(e.target.value)}
                  placeholder="Ex: Site Internet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Icône</label>
                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                  {availableIcons.map((iconOption) => (
                    <button
                      key={iconOption.value}
                      onClick={() => setNewCardIcon(iconOption.value)}
                      className={`p-2 md:p-3 text-xl md:text-2xl rounded-lg transition-all ${
                        newCardIcon === iconOption.value
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      title={iconOption.label}
                    >
                      {iconOption.icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie</label>
                <select
                  value={newCardCategory}
                  onChange={(e) => setNewCardCategory(e.target.value as Category)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(categoryInfo).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button onClick={handleAddCard} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-display">Éditer la carte</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau libellé</label>
                <input
                  type="text"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEditModal(false); setEditingNodeId(null); }} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button onClick={handleEditCard} className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-display text-red-600">Supprimer la carte</h2>
            <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer cette carte ? Toutes ses connexions seront également supprimées.</p>
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteModal(false); setDeletingNodeId(null); }} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button onClick={handleDeleteCard} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConnectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-display">Supprimer une connexion</h2>
            <p className="text-gray-700 mb-6">Cliquez d'abord sur la carte source, puis sur la carte destination pour supprimer leur connexion.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConnectionModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <button onClick={startDeleteConnection} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors">
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-4 font-display">Exporter le schéma</h2>
            <p className="text-gray-700 mb-6">Choisissez le format d'export :</p>
            <div className="space-y-3">
              <button onClick={exportToPNG} className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Exporter en PNG
              </button>
              <button onClick={exportToPDF} className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Exporter en PDF
              </button>
              <button onClick={() => setShowExportModal(false)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
