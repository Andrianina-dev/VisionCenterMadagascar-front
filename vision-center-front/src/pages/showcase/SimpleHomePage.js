import React from 'react';
import './SimpleHomePage.css';

const SimpleHomePage = () => {
  return (
    <div className="simple-homepage">
      {/* Header */}
      <header className="simple-header">
        <div className="header-container">
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
          
          <nav className="nav-menu">
            <a href="#home">Accueil</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </nav>
          
          <button className="btn-contact">Prendre Rendez-vous</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Votre Vision, 
              <span className="hero-highlight">Notre Priorité</span>
            </h1>
            <p className="hero-subtitle">
              Vision Center Madagascar vous offre des soins oculaires de qualité 
              avec un équipement moderne et une équipe de professionnels dévoués.
            </p>
            <div className="hero-actions">
              <button className="btn-primary">Prendre Rendez-vous</button>
              <button className="btn-secondary">Découvrir nos Services</button>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image">
              <div className="image-placeholder">
                <div className="placeholder-icon">👁️</div>
                <p>Image du centre</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="services-preview">
        <div className="section-container">
          <h2>Nos Services Principaux</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">👁️</div>
              <h3>Examens de Vue</h3>
              <p>Examens complets avec équipement moderne</p>
            </div>
            <div className="service-card">
              <div className="service-icon">👓</div>
              <h3>Lunettes sur Mesure</h3>
              <p>Large sélection de montures et verres</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔮</div>
              <h3>Lentilles de Contact</h3>
              <p>Solutions confortables pour toutes les corrections</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="section-container">
          <h2>Contactez-nous</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <span>123 Rue de la Vision, Antananarivo 101, Madagascar</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+261 34 12 345 67</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>contact@visioncenter.mg</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <span>Lun-Ven: 8h-18h | Sam: 8h-12h</span>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Prendre Rendez-vous</h3>
              <form>
                <input type="text" placeholder="Votre nom" required />
                <input type="email" placeholder="Votre email" required />
                <input type="tel" placeholder="Votre téléphone" required />
                <textarea placeholder="Message (optionnel)" rows="4"></textarea>
                <button type="submit" className="btn-submit">Envoyer la demande</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="simple-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>Vision Center Madagascar</h3>
              <p>Votre partenaire de confiance pour la santé visuelle</p>
            </div>
            <div className="footer-links">
              <a href="#services">Services</a>
              <a href="#contact">Contact</a>
              <a href="#about">À propos</a>
            </div>
            <div className="footer-social">
              <span>Suivez-nous:</span>
              <a href="#">📘</a>
              <a href="#">📷</a>
              <a href="#">🐦</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Vision Center Madagascar. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimpleHomePage;
