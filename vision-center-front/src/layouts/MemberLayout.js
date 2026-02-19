import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      case 'messages':
        navigate('/member/messages');
        break;
      case 'profile':
        navigate('/profile');
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
      {/* Navigation Header */}
      <header className="member-header">
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">Vision Center</span>
          </div>
          
          {/* Navigation Links */}
          <nav className="header-nav">
            <button 
              className={`nav-link ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleNavClick('dashboard')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </button>
            
            <button 
              className={`nav-link ${activeNav === 'activities' ? 'active' : ''}`}
              onClick={() => handleNavClick('activities')}
            >
              <span className="nav-icon">🎯</span>
              <span className="nav-text">Activities</span>
            </button>
            
            <button 
              className={`nav-link ${activeNav === 'messages' ? 'active' : ''}`}
              onClick={() => handleNavClick('messages')}
            >
              <span className="nav-icon">💬</span>
              <span className="nav-text">Messages</span>
            </button>
            
            <button 
              className={`nav-link ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => handleNavClick('profile')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </button>
          </nav>
          
          {/* Right Section */}
          <div className="header-right">
            {/* Search */}
            <div className="search-box">
              <input type="text" placeholder="Search..." className="search-input" />
              <button className="search-btn">
                <span>🔍</span>
              </button>
            </div>
            
            {/* Notifications */}
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            {/* Profile Menu */}
            <div className="profile-menu">
              <div className="profile-avatar">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Profile" />
              </div>
              <div className="profile-info">
                <span className="profile-name">John Doe</span>
                <span className="profile-role">Admin</span>
              </div>
              <div className="profile-dropdown">
                <button onClick={() => handleNavClick('profile')}>My Profile</button>
                <button onClick={() => handleNavClick('settings')}>Settings</button>
                <button onClick={() => navigate('/login')} className="logout-link">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="member-main">
        <div className="member-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MemberLayout;
