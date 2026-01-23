import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import './MemberSidebar.css';

const MemberSidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations du membre connecté
    const member = AuthService.getCurrentMember();
    if (member) {
      setCurrentUser(member);
    }
  }, []);

  const handleNavClick = (nav) => {
    // Naviguer vers la page correspondante
    switch(nav) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'account':
        navigate('/account');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'bookings':
        navigate('/bookings');
        break;
      case 'activities':
        navigate('/activite');
        break;
      case 'map':
        navigate('/map');
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
      navigate('/login');
    }
  };

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Membre';
  const memberRole = currentUser?.role || 'Membre';

  return (
    <aside className="member-sidebar">
      <div className="member-profile">
        <div className="member-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format" 
            alt={displayName}
          />
          <div className="member-status"></div>
        </div>
        <h2 className="member-name">{displayName}</h2>
        <p className="member-role">{memberRole}</p>
      </div>

      <nav className="member-navigation">
        <button 
          className={`member-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Accueil</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'account' ? 'active' : ''}`}
          onClick={() => handleNavClick('account')}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-text">Mon Compte</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'profile' ? 'active' : ''}`}
          onClick={() => handleNavClick('profile')}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">Profil</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'bookings' ? 'active' : ''}`}
          onClick={() => handleNavClick('bookings')}
        >
          <span className="nav-icon">📅</span>
          <span className="nav-text">Mes Réservations</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'activities' ? 'active' : ''}`}
          onClick={() => handleNavClick('activities')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-text">Activités</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'map' ? 'active' : ''}`}
          onClick={() => handleNavClick('map')}
        >
          <span className="nav-icon">🗺️</span>
          <span className="nav-text">Carte</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'support' ? 'active' : ''}`}
          onClick={() => handleNavClick('support')}
        >
          <span className="nav-icon">💬</span>
          <span className="nav-text">Support</span>
        </button>
      </nav>

      <div className="member-sign-out-section">
        <button className="member-sign-out-btn" onClick={handleSignOut}>
          <span className="sign-out-icon">🚪</span>
          <span className="sign-out-text">Déconnexion</span>
        </button>
      </div>

      <div className="member-sidebar-footer">
        <p className="footer-text">Vision Center Madagascar</p>
        <p className="footer-version">Member Portal v1.0</p>
      </div>
    </aside>
  );
};

export default MemberSidebar;
