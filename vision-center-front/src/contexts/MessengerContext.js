import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const MessengerContext = createContext();

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
};

export const MessengerProvider = ({ children }) => {
  const location = useLocation();
  const [showMessenger, setShowMessenger] = useState(false);

  useEffect(() => {
    // Pages où le chatbot doit être affiché
    const allowedPaths = [
      '/dashboard', '/profile', '/account', '/map', '/activite', '/support',
      '/accueil', '/a-propos', '/programmes', '/ressources', '/galerie', 
      '/actualites', '/contact', '/inscription', '/activites'
    ];
    
    const isAllowedPath = allowedPaths.some(path => 
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
    
    // Ne pas afficher sur les pages d'authentification et admin
    const excludedPaths = ['/login', '/admin/login', '/admin'];
    const isExcluded = excludedPaths.some(path => location.pathname.startsWith(path));
    
    setShowMessenger(isAllowedPath && !isExcluded);
  }, [location.pathname]);

  return (
    <MessengerContext.Provider value={{ showMessenger }}>
      {children}
    </MessengerContext.Provider>
  );
};

export default MessengerContext;
