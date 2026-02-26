import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const NavigationMembre = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations du membre connecté
    const member = AuthService.getCurrentMember();
    if (member) {
      setCurrentUser(member);
    }
  }, []);

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Membre';

  return (
    <header className="home-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-icon">👁️</span>
          <span className="logo-text">Vision Center</span>
        </div>
        
        {/* Navigation Centre */}
        <nav className="header-nav">
          <button className="nav-link" onClick={() => navigate("/dashboard")}>Accueil</button>
          <button className="nav-link" onClick={() => navigate("/map")}>Carte</button>
          <button className="nav-link" onClick={() => navigate("/contact")}>Contact</button>
        </nav>
        
        {/* Right Section */}
        <div className="header-right">
          {/* Notifications */}
          <button className="notification-btn">
            <span className="notification-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>
          
          {/* Profile */}
          <div className="profile-menu">
            <div className="profile-avatar">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format" alt="Profile" />
              <div className="profile-status-dot"></div>
            </div>
            <div className="profile-info">
              <span className="profile-name">{displayName}</span>
              <span className="profile-role">Membre</span>
            </div>
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <div className="dropdown-avatar">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format" alt="Profile" />
                </div>
                <div className="dropdown-info">
                  <div className="dropdown-name">{displayName}</div>
                  <div className="dropdown-email">membre@visioncenter.mg</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button onClick={() => navigate("/profile")} className="dropdown-item">
                <span className="dropdown-icon">📋</span>
                Mon Profil
              </button>
              <button onClick={() => navigate("/settings")} className="dropdown-item">
                <span className="dropdown-icon">⚙️</span>
                Paramètres
              </button>
              <button onClick={() => navigate("/notifications")} className="dropdown-item">
                <span className="dropdown-icon">🔔</span>
                Notifications
                <span className="dropdown-badge">3</span>
              </button>
              <div className="dropdown-divider"></div>
              <button onClick={() => navigate('/login')} className="dropdown-item logout-item">
                <span className="dropdown-icon">🚪</span>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavigationMembre;
