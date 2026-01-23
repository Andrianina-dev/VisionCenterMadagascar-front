import React, { useState, useEffect } from 'react';
import './ShowcaseHeader.css';

const ShowcaseHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Accueil', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'À Propos', href: '#about' },
    { label: 'Galerie', href: '#gallery' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <header className={`showcase-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-logo">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" width="40" height="40">
                <circle cx="50" cy="50" r="45" fill="#7FFEF4"/>
                <text x="50" y="35" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
                <text x="50" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Vision Center</h1>
              <span>Madagascar</span>
            </div>
          </div>
        </div>

        <nav className="header-nav">
          <ul className="nav-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="nav-item">
                <a href={item.href} className="nav-link">{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="btn-contact">Prendre Rendez-vous</button>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="mobile-nav-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="mobile-nav-item">
                <a 
                  href={item.href} 
                  className="mobile-nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="mobile-btn-contact">Prendre Rendez-vous</button>
        </div>
      </div>
    </header>
  );
};

export default ShowcaseHeader;
