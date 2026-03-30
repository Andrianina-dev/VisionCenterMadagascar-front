import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSiteVitrine from '../../components/vitrine/NavigationSiteVitrine';
import FooterSiteVitrine from '../../components/vitrine/FooterSiteVitrine';
import './accueilVitrineSimple.css';

function AccueilVitrineSimple() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="accueil-simple">
      {/* Header - Navigation du site vitrine */}
      <NavigationSiteVitrine scrollToSection={scrollToSection} />

      {/* Contenu principal */}
      <main className="main-content">
        {/* Présentation Générale */}
        <section className="presentation-section">
          <div className="container">
            <div className="presentation-content">
              <div className="presentation-text">
                <h1 className="main-title">Vision Center Madagascar</h1>
                <p className="main-subtitle">
                  Un centre d'excellence dédié à la formation, au développement personnel et à l'épanouissement spirituel de la jeunesse malgache.
                </p>
                <div className="key-points">
                  <div className="point">
                    <span className="point-icon">🎓</span>
                    <span>Formation professionnelle de qualité</span>
                  </div>
                  <div className="point">
                    <span className="point-icon">🌱</span>
                    <span>Développement personnel continu</span>
                  </div>
                  <div className="point">
                    <span className="point-icon">🙏</span>
                    <span>Valeurs spirituelles chrétiennes</span>
                  </div>
                </div>
              </div>
              <div className="presentation-visual">
                <div className="visual-card">
                  <div className="visual-icon">✨</div>
                  <h3>Notre Mission</h3>
                  <p>Former les leaders de demain avec des compétences, des valeurs et une vision pour transformer Madagascar.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Message Clé */}
        <section className="key-message-section">
          <div className="container">
            <div className="message-card">
              <div className="message-header">
                <h2>Notre Message Clé</h2>
                <div className="message-icon">💡</div>
              </div>
              <div className="message-content">
                <p className="message-text">
                  "Investissez dans votre avenir aujourd'hui pour devenir le leader que Madagascar a besoin demain. 
                  Chaque compétence acquise est une brique pour construire un pays meilleur."
                </p>
                <div className="message-actions">
                  <button onClick={() => navigate('/login')} className="cta-primary">
                    Rejoindre Notre Communauté
                  </button>
                  <button onClick={() => navigate('/contact')} className="cta-secondary">
                    En Savoir Plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Actualités Récentes */}
        <section className="news-section">
          <div className="container">
            <h2 className="section-title">Actualités Récentes</h2>
            <div className="news-grid">
              <article className="news-card">
                <div className="news-image">
                  <div className="news-placeholder">📚</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">15 Mars 2026</span>
                    <span className="news-category">Formation</span>
                  </div>
                  <h3>Nouveau Programme de Leadership</h3>
                  <p>Lancement de notre programme intensif de leadership pour les jeunes professionnels.</p>
                  <a href="#" className="news-link">Lire la suite →</a>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <div className="news-placeholder">🏆</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">10 Mars 2026</span>
                    <span className="news-category">Événement</span>
                  </div>
                  <h3>Certification des Premiers Diplômés</h3>
                  <p>Célébration de la première promotion de notre programme de développement personnel.</p>
                  <a href="#" className="news-link">Lire la suite →</a>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <div className="news-placeholder">🤝</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">5 Mars 2026</span>
                    <span className="news-category">Partenariat</span>
                  </div>
                  <h3>Nouveau Partenariat Stratégique</h3>
                  <p>Collaboration avec des organisations internationales pour étendre notre impact.</p>
                  <a href="#" className="news-link">Lire la suite →</a>
                </div>
              </article>

              <article className="news-card">
                <div className="news-image">
                  <div className="news-placeholder">🎯</div>
                </div>
                <div className="news-content">
                  <div className="news-meta">
                    <span className="news-date">1 Mars 2026</span>
                    <span className="news-category">Innovation</span>
                  </div>
                  <h3>Lancement de Notre Platforme E-Learning</h3>
                  <p>Nouvelle plateforme numérique pour rendre nos formations accessibles à tous.</p>
                  <a href="#" className="news-link">Lire la suite →</a>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSiteVitrine />
    </div>
  );
}

export default AccueilVitrineSimple;
