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
    // Ne montrer le chatbot que sur les pages protégées et l'accueil membre
    const protectedPaths = ['/dashboard', '/profile', '/account', '/map', '/activite', '/support'];
    const isProtected = protectedPaths.some(path => location.pathname.startsWith(path));
    setShowMessenger(isProtected);
  }, [location.pathname]);

  return (
    <MessengerContext.Provider value={{ showMessenger }}>
      {children}
    </MessengerContext.Provider>
  );
};

export default MessengerContext;
