import React from 'react';
import MemberSidebar from '../components/MemberSidebar';
import './MemberLayout.css';

const MemberLayout = ({ children, activeNav = 'dashboard' }) => {
  return (
    <div className="member-layout">
      <MemberSidebar activeNav={activeNav} />
      <div className="member-main-content">
        <header className="member-header">
          <div className="header-content">
            <h1 className="header-title">Vision Center Madagascar</h1>
            <p className="header-subtitle">Espace Membre</p>
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
