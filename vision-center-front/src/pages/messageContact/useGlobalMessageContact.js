// useGlobalMessageContact.js - Hook global pour MessageContact
import { useState, useEffect } from 'react';

// État global partagé
let globalState = {
  isFloating: false,
  showBubbles: true,
  selectedChat: null,
  message: '',
  searchTerm: '',
  isExpanded: false,
  listeners: []
};

// Fonction pour notifier tous les listeners
const notifyListeners = () => {
  globalState.listeners.forEach(listener => listener({ ...globalState }));
};

// Hook global
export const useGlobalMessageContact = () => {
  const [state, setState] = useState({ ...globalState });

  // S'abonner aux changements
  useEffect(() => {
    const listener = (newState) => {
      setState(newState);
    };

    globalState.listeners.push(listener);

    // Nettoyage
    return () => {
      globalState.listeners = globalState.listeners.filter(l => l !== listener);
    };
  }, []);

  // Actions pour modifier l'état global
  const actions = {
    toggleFloating: () => {
      globalState.isFloating = !globalState.isFloating;
      notifyListeners();
    },
    toggleBubbles: () => {
      globalState.showBubbles = !globalState.showBubbles;
      notifyListeners();
    },
    setSelectedChat: (chat) => {
      globalState.selectedChat = chat;
      globalState.isFloating = false; // Fermer le mode flottant quand on sélectionne
      notifyListeners();
    },
    setMessage: (message) => {
      globalState.message = message;
      notifyListeners();
    },
    setSearchTerm: (term) => {
      globalState.searchTerm = term;
      notifyListeners();
    },
    toggleExpanded: () => {
      globalState.isExpanded = !globalState.isExpanded;
      notifyListeners();
    },
    sendMessage: () => {
      if (globalState.message.trim() && globalState.selectedChat) {
        const newMessage = {
          id: Date.now(),
          text: globalState.message,
          sender: 'admin',
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        
        globalState.selectedChat.messages.push(newMessage);
        globalState.message = '';
        notifyListeners();
      }
    }
  };

  return { ...state, ...actions };
};

// Fonction pour initialiser le MessageContact global
export const initGlobalMessageContact = () => {
  // Créer le conteneur global si nécessaire
  if (!document.getElementById('global-message-contact')) {
    const container = document.createElement('div');
    container.id = 'global-message-contact';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  
  return globalState;
};

// Exporter l'état global directement si besoin
export { globalState };
