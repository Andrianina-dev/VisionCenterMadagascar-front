import React from 'react';
import { useNavigate } from 'react-router-dom';
import './accueilVitrineSimple.css';

function AccueilVitrineSimple() {
  const navigate = useNavigate();

  return (
    <div className="accueil-simple">
      {/* Header */}
      <header className="header-simple">
        <div className="container">
          <div className="logo">
            <h1>Vision Center Madagascar</h1>
          </div>
          <nav className="nav-simple">
            <button onClick={() => navigate('/login')} className="btn-connexion">
              Espace Membre
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-simple">
        <div className="container">
          <div className="hero-content">
            <h2>Bienvenue au Vision Center Madagascar</h2>
            <p>Un lieu de formation, de développement personnel et d'épanouissement spirituel</p>
            <div className="hero-actions">
              <button onClick={() => navigate('/login')} className="btn-primary">
                Rejoindre la communauté
              </button>
              <button className="btn-secondary">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-simple">
        <div className="container">
          <h3>Nos Activités</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h4>Formation</h4>
              <p>Développement des compétences et leadership</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🙏</div>
              <h4>Spiritualité</h4>
              <p>Épanouissement spirituel et valeurs chrétiennes</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h4>Communauté</h4>
              <p>Partage et entraide entre membres</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-simple">
        <div className="container">
          <h3>Prêt à commencer votre voyage ?</h3>
          <p>Rejoignez notre communauté pour grandir et vous épanouir</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            S'inscrire maintenant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-simple">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Vision Center</h4>
              <p>Formation et développement pour la jeunesse malgache</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Antananarivo, Madagascar</p>
              <p>contact@visioncenter.mg</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Vision Center Madagascar. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccueilVitrineSimple;
