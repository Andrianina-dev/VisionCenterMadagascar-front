import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth.service';
import './AdminSidebar.css';

const AdminSidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'admin connecté
    const admin = AuthService.getCurrentAdmin();
    if (admin) {
      setCurrentUser(admin);
    }
  }, []);

  const handleNavClick = (nav) => {
    // Naviguer vers la page correspondante
    switch(nav) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'activities':
        navigate('/admin/activities');
        break;
      case 'participants':
        navigate('/admin/participants');
        break;
      case 'messages':
        navigate('/admin/messages');
        break;
      case 'map':
        navigate('/admin/map');
        break;
      case 'statistics':
        navigate('/admin/statistics');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  const handleSignOut = async () => {
    try {
      await AuthService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/admin/login');
    }
  };

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Administrateur';
  const adminRole = 'Administrateur';

  return (
    <aside className="admin-sidebar">
      <div className="admin-profile">
        <div className="admin-avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format" 
            alt={displayName}
          />
          <div className="admin-badge">👑</div>
        </div>
        <h2 className="admin-name">{displayName}</h2>
        <p className="admin-role">{adminRole}</p>
      </div>

      <nav className="admin-navigation">
        <div className="nav-section">
          <p className="nav-section-title">Tableau de bord</p>
          <button 
            className={`admin-nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
        </div>

        <div className="nav-section">
          <p className="nav-section-title">Gestion</p>
          <button 
            className={`admin-nav-item ${activeNav === 'activities' ? 'active' : ''}`}
            onClick={() => handleNavClick('activities')}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-text">Activités</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeNav === 'participants' ? 'active' : ''}`}
            onClick={() => handleNavClick('participants')}
          >
            <span className="nav-icon">👥</span>
            <span className="nav-text">Participants</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeNav === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavClick('messages')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Messages</span>
            <span className="nav-badge">3</span>
          </button>
        </div>

        <div className="nav-section">
          <p className="nav-section-title">Outils</p>
          <button 
            className={`admin-nav-item ${activeNav === 'map' ? 'active' : ''}`}
            onClick={() => handleNavClick('map')}
          >
            <span className="nav-icon">🗺️</span>
            <span className="nav-text">Carte</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeNav === 'statistics' ? 'active' : ''}`}
            onClick={() => handleNavClick('statistics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-text">Statistiques</span>
          </button>
          
          <button 
            className={`admin-nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Paramètres</span>
          </button>
        </div>
      </nav>

      <div className="admin-sign-out-section">
        <button className="admin-sign-out-btn" onClick={handleSignOut}>
          <span className="sign-out-icon">🚪</span>
          <span className="sign-out-text">Déconnexion Admin</span>
        </button>
      </div>

      <div className="admin-sidebar-footer">
        <p className="footer-text">Vision Center Madagascar</p>
        <p className="footer-version">Admin Panel v1.0</p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
