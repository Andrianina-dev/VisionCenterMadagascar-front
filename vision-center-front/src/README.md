# Structure du Frontend Vision Center Madagascar

## 📁 Organisation des dossiers

```
src/
├── assets/                 # Ressources statiques
│   ├── css/               # Fichiers CSS organisés par type
│   ├── images/            # Images et icônes
│   └── fonts/             # Polices personnalisées
├── components/            # Composants React
│   ├── common/            # Composants réutilisables
│   │   ├── Button.js      # Bouton personnalisé
│   │   ├── LoadingSpinner.js # Spinner de chargement
│   │   └── index.js       # Export des composants communs
│   ├── forms/             # Composants de formulaire
│   └── ui/                # Composants d'interface
├── pages/                 # Pages de l'application
│   ├── public/            # Pages publiques (sans authentification)
│   ├── member/            # Pages membres (authentification requise)
│   └── admin/             # Pages administration
├── layouts/               # Mises en page
├── services/              # Services API
├── hooks/                 # Hooks personnalisés React
│   ├── useAuth.js         # Gestion de l'authentification
│   └── useInscription.js  # Gestion des inscriptions
├── utils/                 # Fonctions utilitaires
│   ├── constants.js       # Constantes de l'application
│   └── helpers.js         # Fonctions d'aide
├── styles/                # Point d'entrée des styles
│   └── index.css          # Import principal des CSS
└── contexts/              # Contextes React
```

## 🎨 Gestion des styles

### Import principal
Tous les styles sont importés via `src/styles/index.css` qui est lui-même importé dans `src/index.js`.

### Organisation CSS
- **assets/css/** : Contient tous les fichiers CSS organisés par composant/page
- **Variables CSS** : Définies dans `styles/index.css` avec `:root`
- **Classes utilitaires** : Incluses dans le fichier de styles principal

### Variables disponibles
```css
--primary-color, --secondary-color, --success-color, --danger-color
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl
--border-radius-sm, --border-radius-md, --border-radius-lg
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--font-family-base, --font-size-xs, --font-size-sm, --font-size-base
--transition-fast, --transition-normal, --transition-slow
```

## 🧩 Composants communs

### Button
```javascript
import { Button } from './components/common';

<Button 
  variant="primary" 
  size="medium" 
  loading={false}
  onClick={handleClick}
  icon="🎯"
>
  Texte du bouton
</Button>
```

**Props disponibles :**
- `variant`: primary, secondary, success, danger, warning, info, light, dark, link
- `size`: small, medium, large
- `loading`: État de chargement
- `icon`: Icône (texte ou composant)
- `iconPosition`: left, right
- `fullWidth`: Bouton pleine largeur

### LoadingSpinner
```javascript
import { LoadingSpinner } from './components/common';

<LoadingSpinner 
  size="medium" 
  color="primary" 
  text="Chargement..."
  overlay={false}
/>
```

## 🪝 Hooks personnalisés

### useAuth
Gestion complète de l'authentification :
```javascript
import { useAuth } from './components/common';

const { 
  isAuthenticated, 
  user, 
  loading, 
  login, 
  logout, 
  getUserId 
} = useAuth();
```

### useInscription
Gestion des inscriptions aux activités :
```javascript
import { useInscription } from './components/common';

const { 
  inscrire, 
  desinscrire, 
  verifierInscription, 
  submitting, 
  error 
} = useInscription();
```

## 🛠️ Utilitaires

### Constants
```javascript
import { API_URLS, ERROR_MESSAGES, SUCCESS_MESSAGES } from './components/common';
```

### Helpers
```javascript
import { 
  formatDate, 
  handleError, 
  isValidEmail, 
  debounce, 
  scrollToTop 
} from './components/common';
```

## 🔄 Migration des fichiers

### Fichiers CSS déplacés
- `pages/public/*.css` → `assets/css/`
- `components/*.css` → `assets/css/`
- `layouts/*.css` → `assets/css/`
- `App.css`, `index.css` → `assets/css/`

### Imports à mettre à jour
Remplacer les imports directs par l'import principal :
```javascript
// Avant
import './Home.css';
import './Button.css';

// Après (uniquement dans index.js)
import './styles/index.css';
```

## 📱 Responsive Design

Classes utilitaires responsive incluses :
- `.d-sm-none`, `.d-sm-block`, `.d-sm-flex`
- `.d-md-none`, `.d-md-block`, `.d-md-flex`
- `.d-lg-none`, `.d-lg-block`, `.d-lg-flex`
- `.d-xl-none`, `.d-xl-block`, `.d-xl-flex`

## 🎯 Bonnes pratiques

1. **Utiliser les composants communs** : Éviter de dupliquer le code
2. **Suivre la structure** : Respecter l'organisation des dossiers
3. **Utiliser les variables CSS** : Pour la cohérence visuelle
4. **Importer les utilitaires** : Utiliser les fonctions d'aide existantes
5. **Documenter les nouveaux composants** : Ajouter des PropTypes et commentaires

## 🚀 Prochaines améliorations

- [ ] Ajouter des composants de formulaire (Input, Select, etc.)
- [ ] Créer un système de notification
- [ ] Ajouter des composants de modal
- [ ] Implémenter un système de thème (clair/sombre)
- [ ] Ajouter des tests unitaires pour les composants
