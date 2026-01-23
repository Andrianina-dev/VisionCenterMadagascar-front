import React from 'react';
import './ShowcaseFooter.css';

const ShowcaseFooter = () => {
  return (
    <footer className="showcase-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg viewBox="0 0 100 100" width="50" height="50">
                  <circle cx="50" cy="50" r="45" fill="#7FFEF4"/>
                  <text x="50" y="35" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
                  <text x="50" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
                </svg>
              </div>
              <h3>Vision Center</h3>
              <p>Madagascar</p>
              <p className="footer-description">
                Votre partenaire de confiance pour la santé visuelle à Madagascar. 
                Des services professionnels et un équipement moderne.
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#services">Examens de vue</a></li>
              <li><a href="#services">Lunettes sur mesure</a></li>
              <li><a href="#services">Lentilles de contact</a></li>
              <li><a href="#services">Traitement des maladies oculaires</a></li>
              <li><a href="#services">Chirurgie réfractive</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Liens Utiles</h4>
            <ul>
              <li><a href="#about">À propos</a></li>
              <li><a href="#gallery">Galerie</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#appointment">Prendre rendez-vous</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
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
            
            <div className="social-links">
              <h5>Suivez-nous</h5>
              <div className="social-icons">
                <a href="#" className="social-icon">📘</a>
                <a href="#" className="social-icon">📷</a>
                <a href="#" className="social-icon">🐦</a>
                <a href="#" className="social-icon">💼</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Vision Center Madagascar. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="#privacy">Politique de confidentialité</a>
              <a href="#terms">Conditions d'utilisation</a>
              <a href="#sitemap">Plan du site</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ShowcaseFooter;
