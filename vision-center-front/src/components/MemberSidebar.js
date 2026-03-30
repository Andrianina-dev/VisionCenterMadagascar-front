import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import '../styles/pages/MemberSidebar.css';
import "../styles/components/couleur/couleur.css";

const MemberSidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    // Récupérer les informations du membre connecté
    const member = AuthService.getCurrentUser();
    if (member) {
      setCurrentUser(member);
    }
  }, []);

  const handleNavClick = (nav) => {
    // Naviguer vers la page correspondante
    setShowMobileMenu(false); // Fermer le menu mobile après navigation
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
        navigate('/profile');  // Corrigé: naviguer vers la page Profile.js
        break;
      case 'activities':
        navigate('/member/activites');
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
      {/* Header du profil */}
      <div className="member-profile">
        <div className="member-avatar">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={displayName} className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">
              <span className="avatar-icon">👤</span>
            </div>
          )}
          <div className="member-status online"></div>
        </div>
        <div className="member-info">
          <h2 className="member-name">{displayName}</h2>
          <p className="member-role">{currentUser?.role || 'Membre'}</p>
          <p className="member-email">{currentUser?.email || 'email@example.com'}</p>
        </div>
      </div>

      {/* Bouton menu mobile */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        <span className="menu-icon">{showMobileMenu ? '✕' : '☰'}</span>
      </button>

      {/* Navigation */}
      <nav className={`member-navigation ${showMobileMenu ? 'mobile-open' : ''}`}>
        <button 
          className={`member-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavClick('dashboard')}
        >
          <span className="nav-icon">🏠</span>
          <span className="nav-text">Tableau de bord</span>
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
          className={`member-nav-item ${activeNav === 'activities' ? 'active' : ''}`}
          onClick={() => handleNavClick('activities')}
        >
          <span className="nav-icon">🎯</span>
          <span className="nav-text">Activités</span>
        </button>
        
        <button 
          className={`member-nav-item ${activeNav === 'messages' ? 'active' : ''}`}
          onClick={() => handleNavClick('messages')}
        >
          <span className="nav-icon">📧</span>
          <span className="nav-text">Messages</span>
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

      {/* Actions rapides */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => navigate('/member/settings')}>
          <span className="quick-icon">⚙️</span>
          <span className="quick-text">Paramètres</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/member/notifications')}>
          <span className="quick-icon">🔔</span>
          <span className="quick-text">Notifications</span>
        </button>
      </div>

      {/* Déconnexion */}
      <div className="member-sign-out-section">
        <button className="member-sign-out-btn" onClick={handleSignOut}>
          <span className="sign-out-icon">🚪</span>
          <span className="sign-out-text">Déconnexion</span>
        </button>
      </div>

      {/* Footer */}
      <div className="member-sidebar-footer">
        <p className="footer-text">Centre de Vision</p>
        <p className="footer-version">Member Portal v2.0</p>
      </div>
    </aside>
  );
};

export default MemberSidebar;
