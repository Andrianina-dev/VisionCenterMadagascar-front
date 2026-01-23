// App.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './accueilVitrine.css';

function AccueilVitrine() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const valueCardsRef = useRef([]);
  const missionRef = useRef(null);

  useEffect(() => {
    // Animation d'entrée pour la section hero
    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.style.opacity = '0';
      heroElement.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        heroElement.style.transition = 'opacity 1s ease, transform 1s ease';
        heroElement.style.opacity = '1';
        heroElement.style.transform = 'translateY(0)';
      }, 300);
    }

    // Animation des cartes de valeurs
    valueCardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px) scale(0.9)';
        
        setTimeout(() => {
          card.style.transition = `opacity 0.8s ease ${index * 200}ms, transform 0.8s ease ${index * 200}ms`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 500 + index * 200);
      }
    });

    // Effet de particules pour le hero
    createParticles();

    // Animation du scroll
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('animated');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const createParticles = () => {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particlesCount = 50;
    for (let i = 0; i < particlesCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random properties
      const size = Math.random() * 5 + 2;
      const posX = Math.random() * 100;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 10;
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;
      
      particlesContainer.appendChild(particle);
    }
  };

  return (
    <div className="church-website">
      {/* Background particles */}
      <div className="particles"></div>
      
      {/* Header avec navigation */}
      <header className="church-header">
        <div className="container">
          <div className="logo">
            <div className="logo-circle">
              <svg viewBox="0 0 200 200" width="90" height="90">
                <circle cx="100" cy="100" r="95" fill="#E6F3FF"/>
                <text x="100" y="75" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#000">VISION</text>
                <text x="100" y="125" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#000">CENTER</text>
                <text x="100" y="150" fontSize="10" textAnchor="middle" fill="#666" fontStyle="italic">Madagascar</text>
                <g opacity="0.8">
                  <rect x="85" y="35" width="30" height="8" fill="#FBBF24" rx="2"/>
                  <rect x="75" y="45" width="50" height="6" fill="#FBBF24" rx="1"/>
                  <rect x="80" y="53" width="40" height="4" fill="#FBBF24" rx="1"/>
                </g>
              </svg>
            </div>
          </div>
          <nav className="main-nav">
            <ul>
              <li><a href="#who" className="nav-link">Qui nous sommes</a></li>
              <li><a href="#programmes" className="nav-link">Programmes</a></li>
              <li><a href="#actualites" className="nav-link">Actualités</a></li>
              <li><a href="#membres" className="nav-link" onClick={() => navigate('/login')}>Membres</a></li>
            </ul>
          </nav>
          <button className="visit-button glow-effect">
            <span className="button-text">Nous contacter</span>
            <span className="glow"></span>
          </button>
        </div>
      </header>

      {/* Section Hero avec effets spéciaux */}
      <section className="hero-section" id="accueil">
        <div className="hero-overlay"></div>
        <div className="hero-glow"></div>
        <div className="container">
          <div className="hero-content" ref={heroRef}>
            <h1 className="hero-title">
              <span className="title-line">Bienvenue au</span>
              <span className="title-highlight">Vision Center Madagascar</span>
            </h1>
            <p className="hero-subtitle">
              Élévation morale, développement personnel et 
              <span className="highlight-word"> formation spirituelle</span>
            </p>
            <div className="hero-buttons">
              <button className="cta-button pulse-button">
                <span className="button-content">
                  <span className="button-icon">→</span>
                  Rejoignez-nous
                </span>
              </button>
              <button className="secondary-button">
                Découvrir nos programmes
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </section>

      {/* Section Présentation avec cartes animées */}
      <section className="expect-section scroll-animate" id="who">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-number">01</span>
              Présentation générale
            </h2>
            <p className="section-subtitle">Accompagnement des jeunes pour un développement intégral</p>
          </div>
          
          <div className="expect-grid">
            {[
              {
                icon: '�',
                title: 'Formation spirituelle',
                description: 'Renforcement de la foi et des valeurs chrétiennes pour une vie équilibrée.',
                delay: 0
              },
              {
                icon: '🎓',
                title: 'Développement personnel',
                description: 'Accompagnement pour découvrir et développer tout votre potentiel.',
                delay: 0.2
              },
              {
                icon: '🤝',
                title: 'Impact communautaire',
                description: 'Formation de leaders engagés pour le développement de Madagascar.',
                delay: 0.4
              }
            ].map((value, index) => (
              <div 
                key={index}
                ref={el => valueCardsRef.current[index] = el}
                className="expect-card"
                style={{ animationDelay: `${value.delay}s` }}
              >
                <div className="card-glow"></div>
                <div className="card-inner">
                  <div className="value-icon animate-icon">{value.icon}</div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                  <div className="card-decoration"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="full-experience scroll-animate">
            <div className="experience-content">
              <p className="experience-text">
                De la formation spirituelle au développement personnel, nous offrons 
                <span className="highlight"> un accompagnement complet pour les jeunes</span>
              </p>
              <p className="experience-highlight">
                Votre vision devient notre mission.
              </p>
              <button className="experience-button shine-button">
                En savoir plus
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Messages clés avec effet parallax */}
      <section className="mission-section" ref={missionRef} id="programmes">
        <div className="mission-bg"></div>
        <div className="container">
          <div className="mission-content scroll-animate">
            <div className="mission-text">
              <h2 className="mission-title">
                <span className="title-number">02</span>
                Messages clés
              </h2>
              <h3 className="mission-statement">
                Élever les jeunes pour 
                <span className="gradient-text"> transformer Madagascar</span> 
              </h3>
              
              <div className="mission-points">
                {[
                  {
                    number: '01',
                    title: 'Élévation morale',
                    description: 'Développer les valeurs chrétiennes pour une vie fondée sur des principes intangibles.'
                  },
                  {
                    number: '02',
                    title: 'Développement personnel',
                    description: 'Accompagner chaque jeune à découvrir et réaliser sa vision unique.'
                  },
                  {
                    number: '03',
                    title: 'Impact national',
                    description: 'Former des leaders qui contribueront positivement au développement de Madagascar.'
                  }
                ].map((point, index) => (
                  <div className="mission-point" key={index}>
                    <div className="point-number">{point.number}</div>
                    <div className="point-content">
                      <h4>{point.title}</h4>
                      <p>{point.description}</p>
                    </div>
                    <div className="point-line"></div>
                  </div>
                ))}
              </div>
              
              <button className="mission-button hover-3d">
                <span>Nos programmes</span>
                <div className="button-effect"></div>
              </button>
            </div>
            
            <div className="mission-image scroll-animate">
              <div className="image-container">
                <div className="image-content">
                  <div className="image-title">Programmes de formation</div>
                  <p>Ateliers, mentorat et accompagnement spirituel pour les étudiants et jeunes professionnels.</p>
                  <div className="image-tags">
                    <span className="tag">Leadership</span>
                    <span className="tag">Mentorat</span>
                    <span className="tag">Spiritualité</span>
                  </div>
                </div>
                <div className="image-overlay"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Actualités récentes avec effet de flottement */}
      <section className="leadership-section scroll-animate" id="actualites">
        <div className="container">
          <div className="leadership-content">
            <div className="leader-image">
              <div className="image-frame">
                <div className="leader-photo"></div>
                <div className="leader-badge">
                  <div className="badge-content">
                    <span className="badge-text">Partenaire</span>
                  </div>
                </div>
              </div>
              <div className="leader-info">
                <h3>One Seed Madagascar</h3>
                <p>Partenaire de développement</p>
                <div className="leader-tags">
                  <span>Formation</span>
                  <span>Accompagnement</span>
                </div>
              </div>
            </div>
            
            <div className="leader-text">
              <h3 className="leader-title">
                <span className="title-number">03</span>
                Actualités récentes
              </h3>
              <div className="news-list">
                <div className="news-item">
                  <div className="news-date">15 Janvier 2025</div>
                  <h4>Lancement du programme de leadership 2025</h4>
                  <p>Nouvelle cohorte de 50 jeunes leaders pour transformer leur communauté.</p>
                </div>
                <div className="news-item">
                  <div className="news-date">8 Janvier 2025</div>
                  <h4>Retraite spirituelle annuelle</h4>
                  <p>3 jours de ressourcement et de formation pour les étudiants universitaires.</p>
                </div>
                <div className="news-item">
                  <div className="news-date">2 Janvier 2025</div>
                  <h4>Partenariat avec One Seed Madagascar</h4>
                  <p>Renforcement de notre collaboration pour multiplier notre impact.</p>
                </div>
              </div>
              <div className="leader-stats">
                <div className="stat">
                  <div className="stat-number">200+</div>
                  <div className="stat-label">Jeunes formés</div>
                </div>
                <div className="stat">
                  <div className="stat-number">15</div>
                  <div className="stat-label">Programmes actifs</div>
                </div>
              </div>
              <button className="mission-button hover-3d">
                <span>Voir toutes les actualités</span>
                <div className="button-effect"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="church-footer">
        <div className="footer-wave"></div>
        <div className="container">
          <div className="footer-content">
            <div className="footer-grid">
              {/* About Column */}
              <div className="footer-column">
                <h4 className="footer-title">À propos</h4>
                <ul className="footer-links">
                  {['Qui nous sommes', 'Notre équipe', 'Nos installations'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="footer-link">
                        <span className="link-icon">→</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Services Column */}
              <div className="footer-column">
                <h4 className="footer-title">Programmes</h4>
                <ul className="footer-links">
                  {['Leadership', 'Mentorat', 'Formation spirituelle', 'Développement personnel', 'Ateliers', 'Événements'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="footer-link">
                        <span className="link-icon">→</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Horaires Column */}
              <div className="footer-column">
                <h4 className="footer-title">Horaires</h4>
                <ul className="footer-links">
                  {['Lundi - Vendredi: 8h-18h', 'Samedi: 8h-12h', 'Dimanche: Fermé', 'Urgences 24/7'].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="footer-link">
                        <span className="link-icon">→</span>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Newsletter Column */}
              <div className="footer-column newsletter-column">
                <h4 className="footer-title">Restez connecté</h4>
                <p className="footer-description">
                  Abonnez-vous pour recevoir nos actualités et inspirations
                </p>
                <form className="newsletter-form">
                  <div className="input-group">
                    <input 
                      type="email" 
                      placeholder="Votre adresse email" 
                      className="newsletter-input"
                    />
                    <button type="submit" className="newsletter-button">
                      <span>S'abonner</span>
                      <div className="send-icon">→</div>
                    </button>
                  </div>
                </form>
                <div className="social-links">
                  {['Facebook', 'Instagram', 'LinkedIn', 'YouTube', 'WhatsApp'].map((platform, index) => (
                    <a href="#" key={index} className="social-link">
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="footer-bottom">
              <div className="footer-info">
                <div className="footer-logo">
                  <h3>Vision Center Madagascar</h3>
                  <p>Élévation morale et développement personnel des jeunes pour transformer Madagascar</p>
                </div>
                <div className="contact-info">
                  <p className="address">
                    <span className="icon">📍</span>
                    Antananarivo, Madagascar • Rue Andriatsitohaina 123
                  </p>
                  <p className="phone">
                    <span className="icon">📞</span>
                    +261 34 12 345 67
                  </p>
                  <p className="email">
                    <span className="icon">✉️</span>
                    contact@visioncenter.mg
                  </p>
                </div>
              </div>
              <div className="copyright">
                <p>© 2025 Vision Center Madagascar, Tous droits réservés.</p>
                <p className="design-credit">
                  Développé avec <span className="heart">❤️</span> pour l'élévation de la jeunesse
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AccueilVitrine;