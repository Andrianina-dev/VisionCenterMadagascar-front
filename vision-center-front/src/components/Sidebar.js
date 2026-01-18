import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (nav) => {
    // Naviguer vers la page correspondante
    switch(nav) {
      case 'account':
        navigate('/account');
        break;
      case 'bookings':
        navigate('/profile');  // Corrigé: naviguer vers la page Profile.js
        break;
      case 'promo':
        navigate('/promo');
        break;
      default:
        break;
    }
  };

  const handleSignOut = () => {
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&auto=format" 
            alt="Nasrullah Fath"
          />
        </div>
        <h2 className="user-name">Nasrullah Fath</h2>
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
          className={`nav-item ${activeNav === 'promo' ? 'active' : ''}`}
          onClick={() => handleNavClick('promo')}
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
