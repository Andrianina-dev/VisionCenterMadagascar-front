import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FooterSiteVitrine.css';

const FooterSiteVitrine = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Vision Center</h4>
            <p>Formation et développement pour la jeunesse malgache</p>
          </div>
          <div className="footer-section">
            <h4>Liens Utiles</h4>
            <ul>
              <li><a href="#activites">Activités</a></li>
              <li><a href="#a-propos">À Propos</a></li>
              <li><button onClick={() => navigate('/galerie')}>Galerie</button></li>
              <li><button onClick={() => navigate('/login')}>Espace Membre</button></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>📧 contact@visioncenter.mg</li>
              <li>📱 +261 34 123 456</li>
              <li>📍 Antananarivo, Madagascar</li>
              <li><a href="https://www.facebook.com/profile.php?id=100068896893591" target="_blank" rel="noopener noreferrer">📘 Facebook de Vision Center Madagascar</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Vision Center Madagascar. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSiteVitrine;
