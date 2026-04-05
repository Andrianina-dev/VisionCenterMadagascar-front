import React from 'react';
import { FaStar, FaUsers, FaEnvelope, FaBriefcase, FaLink } from 'react-icons/fa';
import './APropos.css';

const APropos = () => {
  // Données des membres de l'équipe
  const staffMembers = [
    {
      id: 1,
      name: "Pasteur Andry Rakoto",
      role: "Directeur Spirituel",
      image: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Mamy Randrianarisoa",
      role: "Responsable Formation",
      image: "https://randomuser.me/api/portraits/women/1.jpg"
    },
    {
      id: 3,
      name: "Lala Rasoamampionona",
      role: "Conseillère Étudiante",
      image: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 4,
      name: "Haja Razafindramboa",
      role: "Animateur Spirituel",
      image: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 5,
      name: "Voahangy Raveloson",
      role: "Responsable Développement Personnel",
      image: "https://randomuser.me/api/portraits/women/3.jpg"
    },
    {
      id: 6,
      name: "Faniry Rajaonarison",
      role: "Coordinateur Universitaire",
      image: "https://randomuser.me/api/portraits/men/4.jpg"
    }
  ];

  return (
    <div className="a-propos-page-content">
      {/* Header Section - Style luxueux comme l'accueil */}
      <section className="apropos-header-luxury">
        <div className="hero-glow-effect"></div>
        <div className="hero-particles-container">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className="hero-particle" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 5}s`,
                animationDelay: `${Math.random() * 5}s`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`
              }}
            />
          ))}
        </div>
        <div className="apropos-container">
          <div className="apropos-header-content">
            <div className="hero-badge-container">
              <span className="hero-badge">✨ À PROPOS DE NOUS ✨</span>
            </div>
            <h1 className="apropos-header-title">
              <span className="hero-title-line">Vision Center Madagascar</span>
              <div className="hero-title-glow"></div>
            </h1>
            <p className="apropos-header-subtitle-luxury">
              Votre partenaire pour l'élévation morale et le développement spirituel
            </p>
            <div className="hero-description-wrapper">
              <div className="hero-description">
                <p>Nous croyons au potentiel de chaque jeune. Avec passion et engagement, 
                nous accompagnons les étudiants et les jeunes chrétiens dans leur développement personnel 
                et leur formation spirituelle pour un impact positif à Madagascar.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <div className="scroll-mouse"></div>
          <span className="scroll-text">Découvrez notre histoire</span>
        </div>
      </section>

      {/* Historique Section - Timeline luxueuse */}
      <section className="historique-section-luxury">
        <div className="apropos-container">
          <div className="section-header-luxury">
            <div className="section-icon-glow">📖</div>
            <span className="section-badge-luxury">Notre parcours</span>
            <h2 className="section-title-luxury">Notre Histoire</h2>
            <div className="section-divider-luxury">
              <span className="divider-line"></span>
              <span className="divider-icon">✦</span>
              <span className="divider-line"></span>
            </div>
            <p className="section-subtitle-luxury">
              Une décennie d'engagement au service du développement spirituel et moral des jeunes à Madagascar
            </p>
          </div>

          <div className="timeline-luxury">
            <div className="timeline-item">
              <div className="timeline-year">
                <span>2015</span>
                <div className="year-glow"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-icon">🌟</div>
                <h3>Fondation</h3>
                <p>Vision Center Madagascar voit le jour avec une mission : accompagner les jeunes chrétiens dans leur développement spirituel et personnel.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">
                <span>2018</span>
                <div className="year-glow"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-icon">🚀</div>
                <h3>Expansion</h3>
                <p>Ouverture de notre premier centre permanent et lancement des programmes de formation structurée pour les étudiants.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">
                <span>2020</span>
                <div className="year-glow"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-icon">💻</div>
                <h3>Innovation</h3>
                <p>Développement de notre plateforme en ligne pour atteindre plus de jeunes et proposer des ressources numériques.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year">
                <span>2024</span>
                <div className="year-glow"></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-icon">🏆</div>
                <h3>Excellence</h3>
                <p>Reconnaissance comme centre de référence pour le développement personnel et spirituel des jeunes à Madagascar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission-section-luxury">
        <div className="apropos-container">
          <div className="vision-mission-grid">
            <div className="vision-card-luxury">
              <div className="card-glow-effect"></div>
              <div className="card-icon">👁️</div>
              <h3>Notre Vision</h3>
              <p>Devenir le centre de référence pour le développement spirituel et personnel des jeunes chrétiens à Madagascar, reconnu pour notre engagement envers l'élévation morale et la formation spirituelle.</p>
              <div className="card-quote">
                <span>"Des jeunes transformés pour un Madagascar renouvelé."</span>
              </div>
            </div>

            <div className="mission-card-luxury">
              <div className="card-glow-effect"></div>
              <div className="card-icon">🎯</div>
              <h3>Notre Mission</h3>
              <div className="mission-grid">
                <div className="mission-point">
                  <span className="mission-icon">🔬</span>
                  <span>Formation spirituelle continue</span>
                </div>
                <div className="mission-point">
                  <span className="mission-icon">❤️</span>
                  <span>Accompagnement personnalisé</span>
                </div>
                <div className="mission-point">
                  <span className="mission-icon">🌍</span>
                  <span>Impact communautaire</span>
                </div>
                <div className="mission-point">
                  <span className="mission-icon">📚</span>
                  <span>Éducation biblique</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs Section - Grille luxueuse */}
      <section className="valeurs-section-luxury">
        <div className="apropos-container">
          <div className="section-header-luxury">
            <div className="section-icon-glow">⭐</div>
            <span className="section-badge-luxury">Nos fondements</span>
            <h2 className="section-title-luxury">Nos Valeurs</h2>
            <div className="section-divider-luxury">
              <span className="divider-line"></span>
              <span className="divider-icon">✦</span>
              <span className="divider-line"></span>
            </div>
            <p className="section-subtitle-luxury">
              Des principes bibliques qui guident notre engagement quotidien
            </p>
          </div>

          <div className="valeurs-grid-luxury">
            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury"><FaStar /></div>
                </div>
                <h3 className="valeur-title-luxury">Excellence Spirituelle</h3>
                <p className="valeur-description-luxury">Nous nous engageons à offrir un enseignement biblique de qualité, en suivant les principes divins pour la croissance spirituelle.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>

            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury">🤝</div>
                </div>
                <h3 className="valeur-title-luxury">Intégrité</h3>
                <p className="valeur-description-luxury">Nous agissons avec honnêteté, transparence et éthique chrétienne dans toutes nos interactions.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>

            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury">🌱</div>
                </div>
                <h3 className="valeur-title-luxury">Croissance</h3>
                <p className="valeur-description-luxury">Nous favorisons le développement continu de notre équipe et l'amélioration constante de nos pratiques spirituelles.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>

            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury"><FaUsers /></div>
                </div>
                <h3 className="valeur-title-luxury">Communauté</h3>
                <p className="valeur-description-luxury">Nous cultivons des relations fraternelles et soutenons chaque membre dans son parcours spirituel.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>

            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury">💡</div>
                </div>
                <h3 className="valeur-title-luxury">Sagesse</h3>
                <p className="valeur-description-luxury">Nous partageons les enseignements bibliques pour aider les jeunes à prendre des décisions sages.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>

            <div className="valeur-card-luxury">
              <div className="valeur-card-inner">
                <div className="valeur-icon-circle">
                  <div className="valeur-icon-luxury">🌍</div>
                </div>
                <h3 className="valeur-title-luxury">Impact</h3>
                <p className="valeur-description-luxury">Nous sommes engagés à avoir un impact positif et durable dans la société malgache.</p>
                <div className="valeur-card-shine"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      {/* Équipe Section - Staff */}
<section className="equipe-section-luxury">
  <div className="apropos-container">
    <div className="section-header-luxury">
      <div className="section-icon-glow"><FaUsers /></div>
      <span className="section-badge-luxury">Notre équipe</span>
      <h2 className="section-title-luxury">Notre Staff</h2>
      <div className="section-divider-luxury">
        <span className="divider-line"></span>
        <span className="divider-icon">✦</span>
        <span className="divider-line"></span>
      </div>
      <p className="section-subtitle-luxury">
        Des professionnels passionnés au service de votre santé visuelle
      </p>
    </div>

    <div className="equipe-grid-luxury">
      {staffMembers.map((member) => (
        <div key={member.id} className="membre-card-luxury">
          <div className="membre-image-wrapper">
            <img 
              src={member.image} 
              alt={member.name}
              className="membre-image"
            />
            <div className="membre-badge">
              {member.role.includes("Chef") ? "Expert" : "Spécialiste"}
            </div>
          </div>
          <div className="membre-info">
            <h3 className="membre-nom">{member.name}</h3>
            <p className="membre-role">{member.role}</p>
            <div className="membre-divider"></div>
            <p className="membre-quote">
              "Dévoué à votre santé visuelle"
            </p>
            <div className="membre-social">
              <a href="#" className="membre-social-link"><FaEnvelope /></a>
              <a href="#" className="membre-social-link"><FaBriefcase /></a>
              <a href="#" className="membre-social-link"><FaLink /></a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* Stats Section */}
      <section className="stats-section-luxury">
        <div className="apropos-container">
          <div className="stats-grid-luxury">
            <div className="stat-card-luxury">
              <div className="stat-number-wrapper">
                <span className="stat-number-luxury">10+</span>
                <div className="stat-number-glow"></div>
              </div>
              <p className="stat-label-luxury">Années d'engagement</p>
              <div className="stat-decoration"></div>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-number-wrapper">
                <span className="stat-number-luxury">500+</span>
                <div className="stat-number-glow"></div>
              </div>
              <p className="stat-label-luxury">Jeunes accompagnés</p>
              <div className="stat-decoration"></div>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-number-wrapper">
                <span className="stat-number-luxury">20+</span>
                <div className="stat-number-glow"></div>
              </div>
              <p className="stat-label-luxury">Animateurs spirituels</p>
              <div className="stat-decoration"></div>
            </div>
            <div className="stat-card-luxury">
              <div className="stat-number-wrapper">
                <span className="stat-number-luxury">100%</span>
                <div className="stat-number-glow"></div>
              </div>
              <p className="stat-label-luxury">Engagement spirituel</p>
              <div className="stat-decoration"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Style luxueux */}
      <section className="cta-section-luxury">
        <div className="apropos-container">
          <div className="cta-card-luxury">
            <div className="cta-glow-effect"></div>
            <div className="cta-content">
              <div className="cta-icon">🙏</div>
              <h2 className="cta-title-luxury">Rejoignez Notre Mission</h2>
              <p className="cta-description-luxury">
                Découvrez comment nous pouvons vous accompagner dans votre développement spirituel et personnel
              </p>
              <div className="cta-buttons">
                <button className="cta-primary">
                  Rejoindre le Centre
                  <span className="cta-icon-arrow">→</span>
                </button>
                <button className="cta-secondary">
                  Nous Contacter
                  <span className="cta-icon-prayer">❤️</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      </div>
  );
};

export default APropos;