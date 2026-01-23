# 🚀 Solution CORS pour Vision Center Madagascar

## 📋 Problème

Les requêtes depuis le frontend (localhost:3000) vers le backend (localhost:8000) sont bloquées par CORS car le backend n'a pas les headers `Access-Control-Allow-Origin`.

## 🛠️ Solution Implémentée

### 1. Serveur Proxy CORS

Un serveur proxy sur le port 3001 qui :

- Accepte les requêtes CORS depuis localhost:3000
- Redirige vers le backend localhost:8000
- Ajoute les headers CORS nécessaires

### 2. Configuration

#### Fichiers modifiés :

- `cors-proxy.js` : Serveur proxy Express
- `package.json` : Scripts et dépendances
- `huggingface.service.js` : URL pointe vers le proxy

## 🚀 Démarrage

### Option 1 : Développement complet

```bash
npm install
npm run dev
```

Cette commande démarre :

- Le serveur proxy CORS sur le port 3001
- Le frontend React sur le port 3000

### Option 2 : Manuel

```bash
# Terminal 1 - Démarrer le proxy
npm run start-proxy

# Terminal 2 - Démarrer le frontend
npm start
```

## 🌐 Architecture

```
Frontend (localhost:3000)
    ↓
Proxy CORS (localhost:3001) ← Ajoute headers CORS
    ↓
Backend (localhost:8000)
```

## ✅ Vérification

1. Le proxy devrait afficher :

```
🚀 CORS Proxy server running on port 3001
📡 Proxying /api/* requests to http://localhost:8000
🌐 CORS enabled for: http://localhost:3000
```

2. Le frontend devrait pouvoir contacter l'IA sans erreurs CORS

## 🔧 Alternative si le proxy ne fonctionne pas

### Extension Navigateur

1. Installer l'extension "CORS Unblock" pour Chrome/Firefox
2. Désactiver temporairement la sécurité CORS

### Configuration Backend (idéal)

Ajouter dans le backend Python/Flask :

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
```

## 📝 Notes

- Le proxy contourne les limitations de sécurité du navigateur
- Les requêtes passent par localhost:3001 → localhost:8000
- Le frontend communique avec localhost:3001 (même domaine)
- Plus besoin de modifier le backend existant
