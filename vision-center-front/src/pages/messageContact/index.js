// index.js - Fichier d'initialisation pour MessageContact global
import React from 'react';
import { createRoot } from 'react-dom/client';
import GlobalMessageContact from './GlobalMessageContact';
import { initGlobalMessageContact } from './useGlobalMessageContact';
import './MessageContact.css';

// Initialiser le conteneur global
initGlobalMessageContact();

// Créer et rendre le composant global
const container = document.getElementById('global-message-contact');
if (container) {
  const root = createRoot(container);
  root.render(<GlobalMessageContact />);
}

// Exporter les fonctions pour utilisation globale
export { initGlobalMessageContact };
export default GlobalMessageContact;
