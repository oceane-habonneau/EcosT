# 🚀 Démarrage Rapide

## Installation en 3 étapes

### 1️⃣ Cloner et installer

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/ecosysteme-hotelier.git
cd ecosysteme-hotelier

# Installer les dépendances
npm install
```

### 2️⃣ Lancer en local

```bash
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur

### 3️⃣ Builder pour production

```bash
npm run build
```

Les fichiers seront dans le dossier `dist/`

## 📤 Publier sur GitHub Pages

### Option A : Déploiement manuel

```bash
# 1. Modifier vite.config.ts
# Changer base: './' en base: '/nom-de-votre-repo/'

# 2. Build
npm run build

# 3. Installer gh-pages
npm install -g gh-pages

# 4. Déployer
gh-pages -d dist
```

### Option B : Déploiement automatique (Recommandé)

1. Créer `.github/workflows/deploy.yml`
2. Copier le contenu depuis le README
3. Push vers GitHub
4. Activer Pages dans Settings

## 🎮 Utilisation

### Mode Administration
- Activer "Mode Administration"
- Choisir "Mode Déplacement"
- Glisser-déposer les cartes pour les repositionner

### Mode Liaison (à venir)
- Activer "Mode Liaison"
- Cliquer sur deux cartes pour créer une connexion

### Vue Publique
- Mode visualisation seule
- Cliquer sur une carte pour voir ses connexions

## 🛠️ Commandes utiles

```bash
npm run dev       # Développement
npm run build     # Production
npm run preview   # Prévisualiser le build
npm run lint      # Vérifier le code
```

## 📝 Structure des fichiers

```
src/
├── app/
│   ├── components/      # Composants React
│   │   ├── Node.tsx
│   │   └── Connection.tsx
│   └── App.tsx          # Application principale
├── styles/              # Styles CSS
└── main.tsx             # Point d'entrée
```

## 🎨 Personnalisation rapide

### Changer une couleur
`tailwind.config.js` → `extend.colors`

### Ajouter un système
`App.tsx` → `initialNodes` array

### Ajouter une connexion
`App.tsx` → `initialConnections` object

## ❓ Problèmes fréquents

### Port déjà utilisé
```bash
npm run dev -- --port 3000
```

### Erreur de build
```bash
rm -rf node_modules dist
npm install
npm run build
```

### GitHub Pages ne fonctionne pas
- Vérifier `base` dans vite.config.ts
- Vérifier que le repo est public
- Activer Pages dans Settings → Pages

## 📞 Besoin d'aide ?

Consultez le README.md complet pour plus de détails !
