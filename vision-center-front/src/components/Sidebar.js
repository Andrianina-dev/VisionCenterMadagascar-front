import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import './Sidebar.css';

const Sidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur connecté
    const member = AuthService.getCurrentMember();
    if (member) {
      setCurrentUser(member);
    }
  }, []);

  const handleNavClick = (nav) => {
    // Naviguer vers la page correspondante
    switch(nav) {
      case 'account':
        navigate('/account');
        break;
      case 'bookings':
        navigate('/profile');  // Corrigé: naviguer vers la page Profile.js
        break;
      case 'support':
        navigate('/support');
        break;
      default:
        break;
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login'); // Rediriger même en cas d'erreur
    }
  };

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Utilisateur';

  return (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format" 
            alt={displayName}
          />
        </div>
        <h2 className="user-name">{displayName}</h2>
      </div>

      <nav className="navigation">
        <button 
          className={`nav-item ${activeNav === 'account' ? 'active' : ''}`}
          onClick={() => handleNavClick('account')}
        >
          <span className="nav-dash">-</span>
          Account
        </button>
        <button 
          className={`nav-item ${activeNav === 'bookings' ? 'active' : ''}`}
          onClick={() => handleNavClick('bookings')}
        >
          <span className="nav-dash">-</span>
          My Bookings
        </button>
        <button 
          className={`nav-item ${activeNav === 'support' ? 'active' : ''}`}
          onClick={() => handleNavClick('support')}
        >
          <span className="nav-dash">-</span>
          Support
        </button>
      </nav>

      <div className="sign-out-section">
        <button className="sign-out-btn" onClick={handleSignOut}>
          <span className="sign-out-text">Sign out</span>
          <span className="sign-out-arrow">→</span>
        </button>
      </div>

      <div className="sidebar-divider"></div>
    </aside>
  );
};

export default Sidebar;
