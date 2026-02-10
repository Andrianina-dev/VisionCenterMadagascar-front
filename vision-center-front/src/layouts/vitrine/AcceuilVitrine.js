import React from 'react';
import { useNavigate } from 'react-router-dom';
import './accueilVitrineSimple.css';

function AccueilVitrine() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="accueil-simple">
      {/* Header */}
      <header className="header-simple">
        <div className="container">
          <div className="logo">
            <h1>Centre de Vision</h1>
          </div>
          <nav className="nav-simple">
            <ul className="nav-links">
              <li><a href="#activites" onClick={(e) => { e.preventDefault(); scrollToSection('activites'); }}>Activités</a></li>
              <li><a href="#a-propos" onClick={(e) => { e.preventDefault(); scrollToSection('a-propos'); }}>À Propos</a></li>
              <li><a href="#galerie" onClick={() => navigate('/galerie')}>Galerie</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
              <li><button onClick={() => navigate('/login')} className="btn-connexion">Espace Membre</button></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-simple" id="accueil">
        <div className="container">
          <div className="hero-content">
            <h2>Bienvenue au Centre de Vision</h2>
            <p>Un lieu de rencontre, de formation et d'épanouissement spirituel au cœur de Madagascar</p>
            <div className="hero-actions">
              <a href="#activites" className="btn-primary">Découvrir nos activités</a>
              <button onClick={() => navigate('/login')} className="btn-secondary">Espace Membre</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-simple" id="a-propos">
        <div className="container">
          <h2>Nos Activités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🙏</div>
              <h3>Cultes et Prières</h3>
              <p>Des moments de recueillement et de adoration dans une atmosphère de paix et de communion.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Études Bibliques</h3>
              <p>Approfondissez votre connaissance des Écritures à travers nos études bibliques hebdomadaires.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Groupes de Partage</h3>
              <p>Rejoignez nos groupes de partage pour grandir ensemble dans la foi et l'amitié.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Louange et Adoration</h3>
              <p>Exprimez votre foi à travers la musique contemporaine et les chants traditionnels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="features-simple" id="activites">
        <div className="container">
          <h2>Activités à Venir</h2>
          <div className="activities-grid">
            <div className="activity-card">
              <div className="activity-date">15 Février 2026</div>
              <div className="activity-content">
                <h3>Formation Leadership Chrétien</h3>
                <p>Formation sur les principes du leadership selon la Bible pour les jeunes leaders.</p>
                <div className="activity-meta">
                  <span>09:00</span>
                  <span>Centre Vision Center</span>
                </div>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-date">20 Février 2026</div>
              <div className="activity-content">
                <h3>Étude Biblique Jeunesse</h3>
                <p>Session d'étude biblique hebdomadaire pour les 15-25 ans.</p>
                <div className="activity-meta">
                  <span>18:00</span>
                  <span>Salle Multimédia</span>
                </div>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-date">10 Février 2026</div>
              <div className="activity-content">
                <h3>Camp d'été Spirituel</h3>
                <p>Camp de 3 jours avec enseignements, jeux et temps de prière.</p>
                <div className="activity-meta">
                  <span>08:00</span>
                  <span>Site de Camp - Andasibe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-simple">
        <div className="container">
          <h2>Rejoignez Notre Communauté</h2>
          <p>Devenez membre et participez à nos activités pour grandir dans votre foi et rencontrer d'autres chrétiens.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">S'inscrire maintenant</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-simple" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Vision Center</h4>
              <p>Un centre chrétien au service de la communauté malgache.</p>
            </div>
            <div className="footer-section">
              <h4>Liens Rapides</h4>
              <ul>
                <li><a href="#activites">Activités</a></li>
                <li><a href="#a-propos">À Propos</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><button onClick={() => navigate('/login')}>Espace Membre</button></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <ul>
                <li>contact@visioncenter.mg</li>
                <li>+261 34 123 456</li>
                <li>Antananarivo, Madagascar</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Centre de Vision. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccueilVitrine;