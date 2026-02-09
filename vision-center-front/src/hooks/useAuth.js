import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
      const member = localStorage.getItem('member') || sessionStorage.getItem('member');
      
      if (auth === 'true' && member) {
        const memberData = JSON.parse(member);
        setIsAuthenticated(true);
        setUser(memberData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, rememberMe = false) => {
    try {
      const authString = 'true';
      const userString = JSON.stringify(userData);
      
      if (rememberMe) {
        localStorage.setItem('auth', authString);
        localStorage.setItem('member', userString);
      } else {
        sessionStorage.setItem('auth', authString);
        sessionStorage.setItem('member', userString);
      }
      
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('auth');
      localStorage.removeItem('member');
      sessionStorage.removeItem('auth');
      sessionStorage.removeItem('member');
      
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };

  const updateUser = (userData) => {
    try {
      const userString = JSON.stringify(userData);
      
      if (localStorage.getItem('auth')) {
        localStorage.setItem('member', userString);
      }
      if (sessionStorage.getItem('auth')) {
        sessionStorage.setItem('member', userString);
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  };

  const getUserId = () => {
    if (!user) return null;
    
    return user.id || 
           user.member?.id || 
           user.id_utilisateur || 
           (user.email ? user.email.match(/USR-(\d+)/)?.[1] ? 'USR-' + user.email.match(/USR-(\d+)/)[1] : null : null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    getUserId
  };
};
