import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/components/MemberLayout.css';

const MemberLayout = ({ children }) => {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  const handleNavClick = (nav) => {
    setShowMobileMenu(false);
    switch(nav) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'activities':
        navigate('/activites');
        break;
      case 'messages':
        navigate('/member/messages');
        break;
      case 'profile':
        navigate('/member/account');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="member-layout">
      {/* Sidebar Navigation */}
      <aside className="member-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Vision Center</span>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className="nav-link"
            onClick={() => handleNavClick('dashboard')}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </button>
          
          <button 
            className="nav-link"
            onClick={() => handleNavClick('messages')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Messages</span>
          </button>
          
          <button 
            className="nav-link"
            onClick={() => handleNavClick('profile')}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-text">Profil</span>
          </button>
          
          <button 
            className="nav-link"
            onClick={() => handleNavClick('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Paramètres</span>
          </button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="member-main">
        {children}
      </main>
    </div>
  );
};

export default MemberLayout;
