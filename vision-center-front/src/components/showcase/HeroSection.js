import React from 'react';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-container">
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
            
            <div className="hero-features">
              <div className="feature-card">
                <div className="feature-icon">🏥</div>
                <div className="feature-text">
                  <h4>Centre Moderne</h4>
                  <p>Équipement de pointe</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">👨‍⚕️</div>
                <div className="feature-text">
                  <h4>Experts Qualifiés</h4>
                  <p>Ophtalmologues expérimentés</p>
                </div>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <div className="feature-text">
                  <h4>Disponibilité</h4>
                  <p>7j/7, Service d'urgence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow"></div>
        <span>Découvrir</span>
      </div>
    </section>
  );
};

export default HeroSection;
