import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import './AdminLayout.css';

const AdminLayout = ({ children, activeNav = 'dashboard' }) => {
  return (
    <div className="admin-layout">
      <AdminSidebar activeNav={activeNav} />
      <div className="admin-main-content">
        <header className="admin-header">
          <div className="header-content">
            <h1 className="header-title">Vision Center Madagascar</h1>
            <p className="header-subtitle">Panneau d'Administration</p>
          </div>
        </header>
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
