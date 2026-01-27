# Guidelines - Écosystème IT Hôtelier

## General Guidelines

* Use React with TypeScript for type safety and better developer experience
* Keep components modular and reusable
* Use CSS modules or scoped styles to avoid conflicts
* Implement drag-and-drop functionality for node positioning
* Use SVG for dynamic connection lines
* Optimize for performance with React.memo and useCallback where appropriate
* Keep file sizes small and put helper functions in separate files
* Follow the repository structure strictly

## Design System Guidelines

### Colors

**Primary Colors:**
* Green (Gestion & Opérations): `#10b981`
* Blue (Réservations): `#3b82f6`
* Orange (Distribution & Ventes): `#f59e0b`
* Cyan (Expérience Client): `#06b6d4`
* Red (Restauration): `#ef4444`
* Purple (Bien-être): `#a855f7`

**Neutral Colors:**
* Background: `#f5f7fa`
* Surface: `#ffffff`
* Text Primary: `#1e293b`
* Text Secondary: `#64748b`
* Border: `#e2e8f0`

### Typography

* Primary Font: 'Plus Jakarta Sans' (body text, labels)
* Display Font: 'Urbanist' (headings, titles)
* Base font-size: 14px
* Title font-size: 24px
* Label font-size: 12px

### Card Component (Nodes)

The Card component represents each system in the ecosystem.

**Structure:**
* Rounded corners with 16px border radius
* White background with subtle shadow
* Icon at the top (40x40px)
* Label text below icon
* Connection badge at bottom (purple circle with number)
* Status indicator dot at top-right (green)
* Border color matches category color

**Variants:**
* **Gestion & Opérations** (Green): PMS, CRM, ERP Comptabilité
* **Réservations** (Blue): Moteur de réservation (x3)
* **Distribution & Ventes** (Orange): Site Internet, Channel Manager, Canaux de vente, E-boutique
* **Expérience Client** (Cyan): Exp Client - In house, Chatbot, PSP
* **Restauration** (Red): POS Restaurant
* **Bien-être** (Purple): SPA

**States:**
* Default: White background, colored border
* Hover: Slight scale (1.02), enhanced shadow
* Active/Selected: Highlighted border, connections emphasized
* Dragging: Elevated shadow, semi-transparent

### Connection Lines

* Color: `#cbd5e1` (light gray)
* Stroke width: 2px
* Opacity: 0.6
* When highlighted: Color changes to category color, opacity 1.0

### Buttons

**Primary Button:**
* Background: `#3b82f6`
* Text: White
* Border radius: 8px
* Padding: 10px 20px
* Font weight: 600

**Secondary Button:**
* Background: White
* Border: 1px solid `#e2e8f0`
* Text: `#64748b`
* Border radius: 8px
* Padding: 10px 20px

**Button Groups:**
* Should be arranged horizontally with 8px gap
* Toggle buttons share background and border

### Modes

**Mode Administration / Vue Publique:**
* Toggle button at top with gear icon
* Dark gray background when active
* Allows editing and repositioning

**Mode Déplacement / Mode Liaison:**
* Toggle buttons for different interaction modes
* Blue highlight when active
* "Mode Déplacement": Drag and drop nodes
* "Mode Liaison": Create connections between nodes

### Layout

**Container:**
* Max-width: 1400px
* Centered with auto margins
* Padding: 2rem

**Canvas Area:**
* White background
* Border radius: 16px
* Box shadow: subtle elevation
* Min-height: 800px
* Padding: 3rem

**Legend:**
* Bottom of canvas
* Horizontal layout with color-coded circles
* Labels for each category

## Technical Guidelines

### State Management

* Use React Context or Zustand for global state
* Local state with useState for component-specific data
* Store node positions, connections, and mode states

### Drag and Drop

* Use react-draggable or custom implementation
* Update positions in state on drag end
* Snap to grid (optional)
* Constraint nodes to canvas boundaries

### SVG Connections

* Calculate line positions based on node centers
* Redraw connections on node movement
* Use path or line elements
* Animate on creation/deletion

### Data Structure

```typescript
interface Node {
  id: string;
  label: string;
  category: 'gestion' | 'reservations' | 'distribution' | 'experience' | 'restauration' | 'bien-etre';
  position: { x: number; y: number };
  connections: string[]; // Array of connected node IDs
  icon: string; // Icon identifier
}

interface Connection {
  from: string;
  to: string;
  category: string;
}
```

### File Organization

```
src/
├── app/
│   ├── components/
│   │   ├── Node.tsx
│   │   ├── Connection.tsx
│   │   ├── Canvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── Legend.tsx
│   │   └── ...
│   └── App.tsx
├── styles/
│   ├── fonts.css
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
```

## Interactions

### Node Interactions

* **Click**: Select node (highlight connections)
* **Drag**: Move node (in Mode Déplacement)
* **Double-click**: Edit node properties
* **Hover**: Show tooltip with details

### Connection Creation

* In "Mode Liaison": Click source node, then target node
* Visual feedback during connection creation
* Validate connections (prevent duplicates, self-connections)

### Toolbar Actions

* **Réinitialiser liaisons**: Reset all connections
* **Réinitialiser positions**: Reset node positions to default
* **Ajouter carte**: Add new node to canvas

## Accessibility

* All interactive elements should be keyboard accessible
* Provide ARIA labels for screen readers
* Sufficient color contrast (WCAG AA)
* Focus indicators on all focusable elements

## Performance

* Virtualize large node lists if needed
* Memoize expensive calculations
* Debounce drag events
* Use requestAnimationFrame for smooth animations

## Best Practices

* Keep components under 300 lines
* Extract reusable logic into custom hooks
* Use TypeScript strict mode
* Document complex logic with comments
* Write unit tests for critical functions
* Use meaningful variable and function names
