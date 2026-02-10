import React from 'react';
import { useNavigate } from 'react-router-dom';
import MemberSidebar from '../components/MemberSidebar';

const MemberLayout = ({ children, activeNav = 'dashboard' }) => {
  const navigate = useNavigate();

  const handleNavClick = (nav) => {
    switch(nav) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'activities':
        navigate('/activites');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'account':
        navigate('/account');
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
      <div className="member-sidebar-compact">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            title="Dashboard"
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div 
            className={`nav-item ${activeNav === 'activities' ? 'active' : ''}`}
            onClick={() => handleNavClick('activities')}
            title="Activities"
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div 
            className={`nav-item ${activeNav === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
            title="Profile"
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <div 
            className={`nav-item ${activeNav === 'account' ? 'active' : ''}`}
            onClick={() => handleNavClick('account')}
            title="Account"
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M20.46 14.04l-4.24 4.24M7.78 7.78L3.54 3.54"></path>
            </svg>
          </div>
          <div 
            className={`nav-item ${activeNav === 'settings' ? 'active' : ''}`}
            onClick={() => handleNavClick('settings')}
            title="Settings"
          >
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M20.46 14.04l-4.24 4.24M7.78 7.78L3.54 3.54"></path>
            </svg>
          </div>
        </nav>
      </div>
      <div className="member-content-area">
        <header className="member-header">
          <div className="header-content">
            <h1 className="header-title">Profile</h1>
            <p className="header-subtitle">Welcome back, John</p>
          </div>
        </header>
        <main className="member-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MemberLayout;
