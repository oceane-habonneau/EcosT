# 🏨 Schéma Écosystème IT Hôtelier

Application interactive React/TypeScript pour visualiser et gérer l'écosystème IT d'un hôtel, avec le système PMS au centre et toutes les connexions vers les autres systèmes.

![Écosystème IT Hôtelier](screenshot.png)

## ✨ Fonctionnalités

### 🎯 Modes d'interaction
- **Mode Administration** : Édition complète avec drag-and-drop
- **Vue Publique** : Visualisation en lecture seule
- **Mode Déplacement** : Repositionner les cartes par glisser-déposer
- **Mode Liaison** : Créer des connexions entre systèmes (à venir)

### 🎨 Visualisation
- Diagramme interactif avec 16 systèmes interconnectés
- Connexions visuelles entre les systèmes
- Mise en surbrillance des connexions au clic
- Badges de comptage des connexions
- Indicateurs de statut en temps réel
- Légende des catégories colorée

### 📊 Catégories de systèmes
- 🟢 **Gestion & Opérations** : PMS, CRM, ERP
- 🔵 **Réservations** : Moteurs de réservation
- 🟠 **Distribution & Ventes** : Site, Channel Manager, Canaux
- 🔷 **Expérience Client** : Chatbot, PSP, Exp Client
- 🔴 **Restauration** : POS Restaurant
- 🟣 **Bien-être** : SPA

## 🚀 Installation et lancement

### Prérequis
- Node.js 18+ et npm/pnpm/yarn

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/ecosysteme-hotelier.git
cd ecosysteme-hotelier

# Installer les dépendances
npm install
# ou
pnpm install
# ou
yarn install

# Lancer le serveur de développement
npm run dev
# ou
pnpm dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production

```bash
# Créer le build de production
npm run build

# Prévisualiser le build
npm run preview
```

Les fichiers de production seront dans le dossier `dist/`.

## 🌐 Déploiement sur GitHub Pages

### Méthode 1 : Build et déploiement manuel

1. **Modifier le fichier `vite.config.ts`** :
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/ecosysteme-hotelier/', // Remplacer par le nom de votre repo
})
```

2. **Créer le build** :
```bash
npm run build
```

3. **Déployer sur GitHub Pages** :
```bash
# Installer gh-pages
npm install -g gh-pages

# Déployer le dossier dist
gh-pages -d dist
```

4. **Activer GitHub Pages** :
   - Aller dans Settings → Pages
   - Source : `gh-pages` branch
   - Votre site sera sur `https://VOTRE-USERNAME.github.io/ecosysteme-hotelier/`

### Méthode 2 : Avec GitHub Actions (Automatique)

1. Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v4
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. Push vers GitHub :
```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

3. Le déploiement se fera automatiquement à chaque push !

## 📁 Structure du projet

```
ecosysteme-hotelier/
├── guidelines/
│   └── Guidelines.md          # Règles de design et développement
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Node.tsx       # Composant carte système
│   │   │   └── Connection.tsx # Composant ligne de connexion
│   │   └── App.tsx            # Application principale
│   ├── styles/
│   │   ├── fonts.css          # Import des polices
│   │   ├── index.css          # Styles globaux
│   │   ├── tailwind.css       # Tailwind imports
│   │   └── theme.css          # Variables CSS
│   └── main.tsx               # Point d'entrée React
├── index.html                 # Template HTML
├── package.json               # Dépendances
├── vite.config.ts             # Configuration Vite
├── tailwind.config.js         # Configuration Tailwind
├── tsconfig.json              # Configuration TypeScript
├── postcss.config.mjs         # Configuration PostCSS
├── ATTRIBUTIONS.md            # Crédits
└── README.md                  # Ce fichier
```

## 🎨 Personnalisation

### Modifier les couleurs

Dans `tailwind.config.js` :
```javascript
extend: {
  colors: {
    'gestion': '#10b981',      // Vert
    'reservations': '#3b82f6',  // Bleu
    'distribution': '#f59e0b',  // Orange
    'experience': '#06b6d4',    // Cyan
    'restauration': '#ef4444',  // Rouge
    'bien-etre': '#a855f7',     // Violet
  },
}
```

### Ajouter un système

Dans `src/app/App.tsx`, ajouter dans `initialNodes` :
```typescript
{
  id: 'nouveau-systeme',
  label: 'Nouveau\nSystème',
  category: 'gestion',
  position: { x: 400, y: 300 },
  connections: 0,
  icon: 'monitor'
}
```

### Ajouter des connexions

Dans `initialConnections` :
```typescript
'nouveau-systeme': ['pms', 'autre-systeme'],
```

### Changer les icônes

Dans `src/app/components/Node.tsx`, ajouter dans `iconMap` :
```typescript
'nom-icon': NomIcon, // Import depuis lucide-react
```

## 🛠️ Technologies

- **React 18** - UI library
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Lucide React** - Icônes modernes
- **PostCSS** - Transformations CSS

## 📱 Compatibilité

- ✅ Chrome / Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile (responsive)

## 🎯 Fonctionnalités à venir

- [ ] Mode Liaison pour créer des connexions en drag-and-drop
- [ ] Sauvegarde des positions dans localStorage
- [ ] Export en PNG/SVG
- [ ] Mode sombre
- [ ] Zoom et pan sur le canvas
- [ ] Historique des modifications (undo/redo)
- [ ] Templates de diagrammes prédéfinis
- [ ] Animations avancées

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout amélioration'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📝 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run preview  # Prévisualiser le build
npm run lint     # Vérifier le code
```

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👤 Auteur

**Océane Habonneau**

## 🙏 Remerciements

- React Team pour l'excellent framework
- Tailwind CSS pour le système de design
- Lucide pour les icônes
- Vite pour la rapidité de développement

---

⭐ **N'oubliez pas de mettre une étoile si ce projet vous a été utile !**

🔗 **Demo** : `https://VOTRE-USERNAME.github.io/ecosysteme-hotelier/`
