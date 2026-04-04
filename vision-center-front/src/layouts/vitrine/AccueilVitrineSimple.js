import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaHands, FaDove, FaGlobe, FaPrayingHands, FaMagic, FaQuoteLeft, FaBook, FaCalendarAlt, FaMapMarkerAlt, FaQuoteRight, FaPray } from 'react-icons/fa';
import NavigationSiteVitrine from '../../components/vitrine/NavigationSiteVitrine';
import FooterSiteVitrine from '../../components/vitrine/FooterSiteVitrine';
import './accueilVitrineSimple.css';

function AccueilVitrineSimple() {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({});
  const statsRef = useRef(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const presentationData = {
    titre: "Vision Center Madagascar",
    sousTitre: "Là où les cœurs s'élèvent, où les vies se transforment",
    description: "Au cœur de Madagascar, Vision Center est un sanctuaire spirituel unique. Une communauté vibrante où la foi rencontre l'excellence, où chaque âme trouve sa place et où l'amour divin transforme les destins.",
    statistiques: [
      { nombre: "1248", suffixe: "", label: "Âmes Touchées" },
      { nombre: "156", suffixe: "", label: "Baptêmes" },
      { nombre: "32", suffixe: "", label: "Groupes de Prière" },
      { nombre: "7", suffixe: "/7", label: "Présence Divine" }
    ],
    valeurs: [
      { 
        nom: "Foi Authentique", 
        description: "Une confiance inébranlable en la puissance divine",
        icone: <FaPrayingHands />,
        couleur: "#FFD700"
      },
      { 
        nom: "Communauté d'Amour", 
        description: "Grandir ensemble dans l'unité et la bienveillance",
        icone: <FaHeart />,
        couleur: "#FF6B6B"
      },
      { 
        nom: "Service Désintéressé", 
        description: "Donner sans compter, aimer sans conditions",
        icone: <FaHands />,
        couleur: "#4ECDC4"
      },
      { 
        nom: "Transformation Divine", 
        description: "Chaque jour, devenir la meilleure version de soi",
        icone: <FaDove />,
        couleur: "#A8E6CF"
      },
      { 
        nom: "Excellence Spirituelle", 
        description: "Rechercher la perfection dans notre marche avec Dieu",
        icone: <FaStar />,
        couleur: "#FFD93D"
      },
      { 
        nom: "Impact Social", 
        description: "Transformer notre nation par l'amour en action",
        icone: <FaGlobe />,
        couleur: "#6BCB77"
      }
    ]
  };

  const messagesInspirants = [
    {
      id: 1,
      auteur: "Pasteur Marc Andrian",
      fonction: "Pasteur Fondateur",
      message: "Dieu prépare quelque chose de grand pour toi. Ne doute jamais de Sa puissance, car Il est capable de faire bien au-delà de tout ce que tu peux imaginer.",
      verset: "Éphésiens 3:20",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=150&h=150&fit=crop"
    },
    {
      id: 2,
      auteur: "Évangéliste Sarah Raman",
      fonction: "Directrice des Ministères",
      message: "Dans chaque épreuve, Dieu prépare une bénédiction. Garde la foi, car les promesses de l'Éternel s'accomplissent toujours au moment parfait.",
      verset: "Jérémie 29:11",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop"
    },
    {
      id: 3,
      auteur: "Frère Jean Rakoto",
      fonction: "Leader Adoration",
      message: "L'adoration n'est pas seulement un chant, c'est une posture de cœur. Quand tu te prosterne devant Dieu, les montagnes bougent.",
      verset: "Psaumes 95:6",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    }
  ];

  const evenementsProches = [
    {
      id: 1,
      titre: "Conférence de Réveil Spirituel",
      date: "15-17 Avril 2024",
      heure: "18h00 - 21h00",
      lieu: "Vision Center, Antananarivo",
      description: "3 jours de feu spirituel avec des invités internationaux",
      image: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop"
    },
    {
      id: 2,
      titre: "Camp des Jeunes - Génération Impact",
      date: "25-28 Avril 2024",
      heure: "Journée complète",
      lieu: "Centre Spirituel d'Ivato",
      description: "Une expérience transformatrice pour les jeunes",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop"
    },
    {
      id: 3,
      titre: "Soirée de Louange & Adoration",
      date: "5 Mai 2024",
      heure: "17h00 - 20h00",
      lieu: "Vision Center",
      description: "Une soirée de célébration et de présence divine",
      image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop"
    }
  ];

  const temoignages = [
    {
      id: 1,
      nom: "Marie-Claire Razafy",
      temoignage: "Vision Center a transformé ma vie. J'ai trouvé non seulement une église, mais une famille qui m'a aidée à découvrir mon appel.",
      role: "Membre depuis 2018",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      id: 2,
      nom: "Hery Andriantsitohery",
      temoignage: "J'ai été guéri de mes blessures émotionnelles ici. L'amour que j'ai reçu m'a complètement restauré.",
      role: "Membre depuis 2020",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
    },
    {
      id: 3,
      nom: "Lalao Rasoanaivo",
      temoignage: "Mon mariage était au bord du gouffre. Grâce aux conseils et aux prières, Dieu a opéré un miracle.",
      role: "Membre depuis 2019",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stats = {};
            presentationData.statistiques.forEach((stat, index) => {
              const target = parseInt(stat.nombre);
              let current = 0;
              const increment = target / 50;
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setAnimatedStats(prev => ({ ...prev, [index]: Math.floor(current) }));
              }, 30);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % temoignages.length);
    }, 5000);

    return () => {
      observer.disconnect();
      clearInterval(testimonialInterval);
    };
  }, []);

  return (
    <div className="accueil-vitrine">
      <NavigationSiteVitrine />

      <main>
        {/* Hero Section - Luxueux avec Parallax */}
        <section className="hero-section">
          <div className="hero-bg-image"></div>
          <div className="hero-gradient-overlay"></div>
          <div className="hero-glow-effect"></div>
          <div className="hero-particles-container">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="hero-particle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}></div>
            ))}
          </div>
          
          <div className="container hero-container">
            <div className="hero-content-wrapper">
              <div className="hero-badge-container">
                <span className="hero-badge"><FaMagic /> Communauté Vivante <FaMagic /></span>
              </div>
              
              <h1 className="hero-title">
                <span className="hero-title-line">{presentationData.titre}</span>
                <span className="hero-title-glow"></span>
              </h1>
              
              <p className="hero-subtitle">{presentationData.sousTitre}</p>
              
              <div className="hero-description-wrapper">
                <p className="hero-description">{presentationData.description}</p>
              </div>
              
              <div className="hero-buttons">
                <button className="btn-primary-luxury" onClick={() => navigate('/contact')}>
                  <span className="btn-text">Rejoindre la Communauté</span>
                  <span className="btn-icon">→</span>
                </button>
                <button className="btn-outline-luxury" onClick={() => navigate('/services')}>
                  <span className="btn-text">Découvrir nos Services</span>
                  <span className="btn-icon"><FaMagic /></span>
                </button>
              </div>
            </div>

            <div className="hero-stats-container" ref={statsRef}>
              {presentationData.statistiques.map((stat, index) => (
                <div key={index} className="stat-card-luxury">
                  <div className="stat-number-wrapper">
                    <span className="stat-number-luxury">
                      {animatedStats[index] !== undefined ? animatedStats[index] : 0}{stat.suffixe}
                    </span>
                    <div className="stat-number-glow"></div>
                  </div>
                  <div className="stat-label-luxury">{stat.label}</div>
                  <div className="stat-decoration"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valeurs Section - Design Luxueux */}
        <section className="valeurs-section-luxury">
          <div className="container">
            <div className="section-header-luxury">
              <div className="section-icon-glow"><FaMagic /></div>
              <span className="section-badge-luxury">Notre Fondation Spirituelle</span>
              <h2 className="section-title-luxury">Nos Valeurs Fondamentales</h2>
              <div className="section-divider-luxury">
                <span className="divider-line"></span>
                <span className="divider-icon"><FaMagic /></span>
                <span className="divider-line"></span>
              </div>
              <p className="section-subtitle-luxury">Les piliers qui soutiennent notre vision et guident notre marche</p>
            </div>

            <div className="valeurs-grid-luxury">
              {presentationData.valeurs.map((valeur, index) => (
                <div key={index} className="valeur-card-luxury">
                  <div className="valeur-card-inner">
                    <div className="valeur-icon-circle" style={{ background: `linear-gradient(135deg, ${valeur.couleur}20, ${valeur.couleur}05)` }}>
                      <div className="valeur-icon-luxury">{valeur.icone}</div>
                    </div>
                    <h3 className="valeur-title-luxury">{valeur.nom}</h3>
                    <p className="valeur-description-luxury">{valeur.description}</p>
                    <div className="valeur-card-shine"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Messages Inspirants - Design Élégant */}
        <section className="messages-section-luxury">
          <div className="container">
            <div className="section-header-luxury">
              <div className="section-icon-glow"><FaStar /></div>
              <span className="section-badge-luxury">Paroles de Vie</span>
              <h2 className="section-title-luxury">Messages Inspirants</h2>
              <div className="section-divider-luxury">
                <span className="divider-line"></span>
                <span className="divider-icon"><FaMagic /></span>
                <span className="divider-line"></span>
              </div>
              <p className="section-subtitle-luxury">Des paroles qui élèvent l'âme et nourrissent l'esprit</p>
            </div>

            <div className="messages-grid-luxury">
              {messagesInspirants.map((message, index) => (
                <div key={message.id} className="message-card-luxury">
                  <div className="message-card-background"></div>
                  <div className="message-quote-decoration"><FaQuoteLeft /></div>
                  <div className="message-author-info">
                    <div className="message-author-image">
                      <img src={message.image} alt={message.auteur} />
                    </div>
                    <div className="message-author-details">
                      <h4 className="message-author-name">{message.auteur}</h4>
                      <p className="message-author-role">{message.fonction}</p>
                    </div>
                  </div>
                  <p className="message-text-luxury">{message.message}</p>
                  <div className="message-verset-luxury">
                    <span className="verset-icon"><FaBook /></span>
                    <span>{message.verset}</span>
                  </div>
                  <div className="message-card-glow"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Événements à Venir */}
        <section className="evenements-section-luxury">
          <div className="container">
            <div className="section-header-luxury">
              <div className="section-icon-glow"><FaCalendarAlt /></div>
              <span className="section-badge-luxury">Agenda Spirituel</span>
              <h2 className="section-title-luxury">Événements à Venir</h2>
              <div className="section-divider-luxury">
                <span className="divider-line"></span>
                <span className="divider-icon"><FaMagic /></span>
                <span className="divider-line"></span>
              </div>
              <p className="section-subtitle-luxury">Ne manquez pas ces moments de grâce et de partage</p>
            </div>

            <div className="evenements-grid-luxury">
              {evenementsProches.map((event, index) => (
                <div key={event.id} className="event-card-luxury">
                  <div className="event-image-wrapper">
                    <img src={event.image} alt={event.titre} />
                    <div className="event-date-badge">
                      <span className="event-date-day">{event.date.split(' ')[0]}</span>
                      <span className="event-date-month">{event.date.split(' ')[1]}</span>
                    </div>
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.titre}</h3>
                    <div className="event-details">
                      <div className="event-detail">
                        <span className="detail-icon">⏰</span>
                        <span>{event.heure}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon"><FaMapMarkerAlt /></span>
                        <span>{event.lieu}</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <button className="event-button" onClick={() => navigate('/evenements')}>
                      S'inscrire
                      <span className="button-arrow">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Témoignages - Carrousel Élégant */}
        <section className="temoignages-section-luxury">
          <div className="container">
            <div className="section-header-luxury">
              <div className="section-icon-glow"><FaQuoteRight /></div>
              <span className="section-badge-luxury">Vies Transformées</span>
              <h2 className="section-title-luxury">Ce qu'ils disent</h2>
              <div className="section-divider-luxury">
                <span className="divider-line"></span>
                <span className="divider-icon"><FaMagic /></span>
                <span className="divider-line"></span>
              </div>
              <p className="section-subtitle-luxury">Des histoires qui témoignent de la puissance de Dieu</p>
            </div>

            <div className="temoignages-carousel">
              {temoignages.map((temoignage, index) => (
                <div 
                  key={temoignage.id} 
                  className={`temoignage-card-luxury ${activeTestimonial === index ? 'active' : ''}`}
                  style={{ display: activeTestimonial === index ? 'block' : 'none' }}
                >
                  <div className="temoignage-content">
                    <div className="temoignage-quote-icon"><FaQuoteLeft /></div>
                    <p className="temoignage-text">{temoignage.temoignage}</p>
                    <div className="temoignage-author">
                      <div className="temoignage-author-image">
                        <img src={temoignage.image} alt={temoignage.nom} />
                      </div>
                      <div className="temoignage-author-info">
                        <h4 className="temoignage-author-name">{temoignage.nom}</h4>
                        <p className="temoignage-author-role">{temoignage.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="temoignage-dots">
                {temoignages.map((_, index) => (
                  <button 
                    key={index} 
                    className={`temoignage-dot ${activeTestimonial === index ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="cta-section-luxury">
          <div className="container">
            <div className="cta-card-luxury">
              <div className="cta-glow-effect"></div>
              <div className="cta-content">
                <div className="cta-icon"><FaDove /></div>
                <h3 className="cta-title-luxury">Prêt à commencer votre voyage spirituel ?</h3>
                <p className="cta-description-luxury">Rejoignez une communauté qui croit en vous et en la puissance de Dieu pour transformer votre vie</p>
                <div className="cta-buttons">
                  <button className="cta-primary" onClick={() => navigate('/contact')}>
                    <span>Je m'inscris maintenant</span>
                    <span className="cta-icon-arrow">→</span>
                  </button>
                  <button className="cta-secondary" onClick={() => navigate('/priere')}>
                    <span>Demander une prière</span>
                    <span className="cta-icon-prayer"><FaPray /></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSiteVitrine />
    </div>
  );
}

export default AccueilVitrineSimple;