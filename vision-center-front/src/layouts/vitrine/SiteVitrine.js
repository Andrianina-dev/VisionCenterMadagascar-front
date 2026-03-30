import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSiteVitrine from '../../components/vitrine/NavigationSiteVitrine';
import FooterSiteVitrine from '../../components/vitrine/FooterSiteVitrine';
import './accueilVitrine.css';

function SiteVitrine() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="accueil-vitrine">
      {/* Header */}
      <NavigationSiteVitrine scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-text">🌟 Bienvenue 2026</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line">Transformez Votre</span>
              <span className="title-highlight">Avenir</span>
            </h1>
            <p className="hero-description">
              Rejoignez une communauté dynamique dédiée à votre épanouissement personnel, spirituel et professionnel au cœur de Madagascar
            </p>
            <div className="hero-actions">
              <button onClick={() => scrollToSection('activities')} className="btn-primary btn-large">
                <span>Découvrir nos activités</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              <button onClick={() => navigate('/login')} className="btn-secondary btn-large">
                <span>Espace Membre</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                </svg>
              </button>
            </div>
            
            <div className="hero-secondary-actions">
              <button onClick={() => navigate('/acces-non-membre')} className="btn-outline btn-medium">
                <span>📋 Suivre ma location de salle</span>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Membres Actifs</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50+</span>
                <span className="stat-label">Événements/An</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">10+</span>
                <span className="stat-label">Programmes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>Nos Valeurs</span>
            </div>
            <h2 className="section-title">
              <span className="title-main">Ce Que Nous</span>
              <span className="title-accent">Croyons</span>
            </h2>
            <p className="section-description">
              Les fondations qui guident notre mission et inspirent notre communauté chaque jour
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">📚</div>
                <div className="icon-bg"></div>
              </div>
              <div className="feature-content">
                <h3>Formation Excellence</h3>
                <p>Développement des compétences et leadership chrétien pour la jeunesse malgache</p>
                <div className="feature-features">
                  <span className="feature-tag">Leadership</span>
                  <span className="feature-tag">Compétences</span>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🙏</div>
                <div className="icon-bg"></div>
              </div>
              <div className="feature-content">
                <h3>Vie Spirituelle</h3>
                <p>Épanouissement spirituel et valeurs chrétiennes dans un environnement bienveillant</p>
                <div className="feature-features">
                  <span className="feature-tag">Prières</span>
                  <span className="feature-tag">Méditation</span>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🤝</div>
                <div className="icon-bg"></div>
              </div>
              <div className="feature-content">
                <h3>Communauté Forte</h3>
                <p>Partage, entraide et fraternité entre membres pour grandir ensemble</p>
                <div className="feature-features">
                  <span className="feature-tag">Soutien</span>
                  <span className="feature-tag">Partage</span>
                </div>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">🌱</div>
                <div className="icon-bg"></div>
              </div>
              <div className="feature-content">
                <h3>Développement Personnel</h3>
                <p>Accompagnement personnel et professionnel pour un avenir meilleur</p>
                <div className="feature-features">
                  <span className="feature-tag">Croissance</span>
                  <span className="feature-tag">Accompagnement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="activities" id="activities">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <span>📅 Événements</span>
            </div>
            <h2 className="section-title">
              <span className="title-main">Prochains</span>
              <span className="title-accent">Événements</span>
            </h2>
            <p className="section-description">
              Rejoignez-nous pour des moments forts de partage et d'apprentissage
            </p>
          </div>
          <div className="activities-grid">
            <div className="activity-card featured">
              <div className="activity-header">
                <div className="activity-date">
                  <span className="date-day">15</span>
                  <span className="date-month">Février</span>
                </div>
                <div className="activity-badge">
                  <span>🔥 Populaire</span>
                </div>
              </div>
              <div className="activity-content">
                <h3>Formation Leadership Chrétien</h3>
                <p>Découvrez les principes bibliques du leadership et développez votre potentiel de leader</p>
                <div className="activity-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>09:00 - 17:00</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>Centre Vision Center</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>25 places</span>
                  </div>
                </div>
                <button className="activity-btn">S'inscrire</button>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-date">
                  <span className="date-day">20</span>
                  <span className="date-month">Février</span>
                </div>
              </div>
              <div className="activity-content">
                <h3>Étude Biblique Jeunesse</h3>
                <p>Session hebdomadaire pour approfondir votre connaissance des Écritures</p>
                <div className="activity-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>18:00 - 19:30</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>Salle Multimédia</span>
                  </div>
                </div>
                <button className="activity-btn">S'inscrire</button>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-header">
                <div className="activity-date">
                  <span className="date-day">10</span>
                  <span className="date-month">Mars</span>
                </div>
              </div>
              <div className="activity-content">
                <h3>Camp Spirituel</h3>
                <p>3 jours de retraite spirituelle avec enseignements et activités</p>
                <div className="activity-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏰</span>
                    <span>3 jours</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📍</span>
                    <span>Andasibe</span>
                  </div>
                </div>
                <button className="activity-btn">S'inscrire</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="cta">
        <div className="cta-background">
          <div className="cta-gradient"></div>
          <div className="cta-pattern"></div>
        </div>
        <div className="container">
          <div className="cta-content">
            <div className="cta-badge">
              <span>🚀 Rejoignez-nous</span>
            </div>
            <h2 className="cta-title">
              <span className="title-main">Prêt à</span>
              <span className="title-accent">Commencer</span>
            </h2>
            <p className="cta-description">
              Faites partie d'une communauté qui transforme des vies et crée un impact positif dans la société malgache
            </p>
            <div className="cta-actions">
              <button onClick={() => navigate('/login')} className="btn-primary btn-large cta-btn">
                <span>S'inscrire Gratuitement</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
              <button onClick={() => scrollToSection('activities')} className="btn-outline btn-large">
                <span>Voir les événements</span>
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 12h-6m3 3l-3-3 3-3"/>
                </svg>
              </button>
            </div>
            <div className="cta-features">
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>Accès gratuit aux activités</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>Communauté bienveillante</span>
              </div>
              <div className="cta-feature">
                <span className="feature-icon">✓</span>
                <span>Formation de qualité</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <FooterSiteVitrine />
    </div>
  );
}

export default SiteVitrine;
