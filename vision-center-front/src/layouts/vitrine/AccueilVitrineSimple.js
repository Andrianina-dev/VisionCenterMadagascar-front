import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaStar,
  FaHeart,
  FaHands,
  FaDove,
  FaGlobe,
  FaPrayingHands,
  FaBook,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowRight,
  FaLongArrowAltRight,
  FaChartLine,
  FaShieldAlt,
  FaUsers,
  FaEnvelope,
} from 'react-icons/fa';
import './accueilVitrineSimple.css';
import heroRightImage from '../../assets/accueil/fond-image-accueil.jpg';
import FloatingMessenger from '../../component/FloatingMessenger/FloatingMessenger';

const HERO_MAIN_IMG = heroRightImage;
const HERO_ACCENT_IMG =
  'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80';
const WHY_IMG =
  'https://images.unsplash.com/photo-1519491050282-cf00c824d8d9?w=900&q=80';
const CTA_BG =
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1600&q=80';

const STATISTIQUES_VITRINE = [
  { nombre: '1248', suffixe: '', label: 'Âmes touchées' },
  { nombre: '156', suffixe: '', label: 'Baptêmes' },
  { nombre: '32', suffixe: '', label: 'Groupes de prière' },
  { nombre: '7', suffixe: '/7', label: 'Jours de présence' },
];

function AccueilVitrineSimple() {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({});
  const statsRef = useRef(null);

  const presentationData = {
    titre: 'Vision Center',
    titreHighlight: 'Madagascar',
    badge: "Communauté à Antananarivo · Une église qui transforme des vies",
    description:
      "Vision Center Madagascar, appuyé par One Seed Madagascar, est un centre de jeunes chrétiens engagés dans l'élévation morale, le développement personnel et la formation spirituelle. Il accompagne les étudiants universitaires et les jeunes afin qu'ils découvrent, développent et réalisent leurs visions, tout en contribuant positivement au développement de Madagascar.\n\nNous sommes l'espoir de Madagascar.\nL'avenir de Madagascar dépend de toi et moi.",
    statistiques: STATISTIQUES_VITRINE,
    valeurs: [
      {
        nom: 'Foi authentique',
        description: "Une confiance inébranlable en la puissance divine",
        icone: <FaPrayingHands />,
      },
      {
        nom: "Communauté d'amour",
        description: 'Grandir ensemble dans l’unité et la bienveillance',
        icone: <FaHeart />,
      },
      {
        nom: 'Service désintéressé',
        description: 'Donner sans compter, aimer sans conditions',
        icone: <FaHands />,
      },
      {
        nom: 'Transformation divine',
        description: 'Chaque jour, devenir la meilleure version de soi',
        icone: <FaDove />,
      },
      {
        nom: 'Excellence spirituelle',
        description: 'Rechercher la perfection dans notre marche avec Dieu',
        icone: <FaStar />,
      },
      {
        nom: 'Impact social',
        description: "Transformer notre nation par l'amour en action",
        icone: <FaGlobe />,
      },
    ],
  };

  const trustItems = [
    { icon: <FaShieldAlt />, text: 'Accueil & accompagnement' },
    { icon: <FaHeart />, text: 'Communauté bienveillante' },
    { icon: <FaUsers />, text: 'Toutes les générations' },
    { icon: <FaBook />, text: 'Enseignement biblique' },
    { icon: <FaDove />, text: 'Louange & adoration' },
    { icon: <FaGlobe />, text: 'Impact local & national' },
  ];

  const whyChecklist = [
    {
      title: 'Une foi vivante',
      text: 'Des cultes, des cellules et des événements pour grandir spirituellement au quotidien.',
    },
    {
      title: 'Une famille spirituelle',
      text: 'Des relations authentiques, du soutien et une place pour chacun.',
    },
    {
      title: 'Une vision pour Madagascar',
      text: 'Servir notre île avec intégrité, générosité et espérance.',
    },
  ];

  const messagesInspirants = [
    {
      id: 1,
      auteur: 'Pasteur Marc Andrian',
      fonction: 'Pasteur fondateur',
      message:
        'Dieu prépare quelque chose de grand pour toi. Ne doute jamais de Sa puissance, car Il est capable de faire bien au-delà de tout ce que tu peux imaginer.',
      verset: 'Éphésiens 3:20',
      image:
        'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=150&h=150&fit=crop',
    },
    {
      id: 2,
      auteur: 'Évangéliste Sarah Raman',
      fonction: 'Directrice des ministères',
      message:
        "Dans chaque épreuve, Dieu prépare une bénédiction. Garde la foi, car les promesses de l'Éternel s'accomplissent toujours au moment parfait.",
      verset: 'Jérémie 29:11',
      image:
        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop',
    },
    {
      id: 3,
      auteur: 'Frère Jean Rakoto',
      fonction: "Leader d'adoration",
      message:
        "L'adoration n'est pas seulement un chant, c'est une posture de cœur. Quand tu te prosternes devant Dieu, les montagnes bougent.",
      verset: 'Psaumes 95:6',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
  ];

  const evenementsProches = [
    {
      id: 1,
      titre: 'Conférence de réveil spirituel',
      date: '15-17 Avril 2024',
      cat: 'Événement',
      description:
        'Trois jours de présence de Dieu avec des invités et une équipe de louange unie.',
      image:
        'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=600&h=400&fit=crop',
    },
    {
      id: 2,
      titre: 'Camp des jeunes — Génération impact',
      date: '25-28 Avril 2024',
      cat: 'Jeunesse',
      description:
        'Une expérience transformatrice : enseignements, ateliers et moments forts.',
      image:
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop',
    },
    {
      id: 3,
      titre: 'Soirée de louange & adoration',
      date: '5 Mai 2024',
      cat: 'Louange',
      description: 'Une soirée pour célébrer et chercher la face de Dieu ensemble.',
      image:
        'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600&h=400&fit=crop',
    },
  ];

  const temoignages = [
    {
      id: 1,
      nom: 'Marie-Claire Razafy',
      temoignage:
        "Vision Center a transformé ma vie. J'ai trouvé non seulement une église, mais une famille qui m'a aidée à découvrir mon appel.",
      role: 'Membre depuis 2018',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      nom: 'Hery Andriantsitohery',
      temoignage:
        'J’ai été guéri de mes blessures émotionnelles ici. L’amour que j’ai reçu m’a complètement restauré.',
      role: 'Membre depuis 2020',
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      nom: 'Lalao Rasoanaivo',
      temoignage:
        'Mon mariage était au bord du gouffre. Grâce aux conseils et aux prières, Dieu a opéré un miracle.',
      role: 'Membre depuis 2019',
      image:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            STATISTIQUES_VITRINE.forEach((stat, index) => {
              const target = parseInt(stat.nombre, 10);
              let current = 0;
              const increment = Math.max(target / 50, 1);
              const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                  current = target;
                  clearInterval(timer);
                }
                setAnimatedStats((prev) => ({
                  ...prev,
                  [index]: Math.floor(current),
                }));
              }, 30);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const heroStatTriplet = presentationData.statistiques.slice(0, 3);

  return (
    <div className="accueil-vitrine-content vcm-ve">
      <main>
        <section className="ve-hero">
          <div className="ve-hero-left">
            <span className="ve-hero-badge">{presentationData.badge}</span>
            <h1>
              {presentationData.titre}{' '}
              <span className="ve-highlight">{presentationData.titreHighlight}</span>
              <br />
              Là où les cœurs s’élèvent
            </h1>
            <p>{presentationData.description}</p>
            <div className="ve-hero-btns">
              <button
                type="button"
                className="ve-btn-primary ve-btn-reset"
                onClick={() => navigate('/contact')}
              >
                Nous contacter <FaArrowRight aria-hidden />
              </button>
              <button
                type="button"
                className="ve-btn-ghost ve-btn-reset"
                onClick={() => navigate('/programmes-activites')}
              >
                Nos programmes
              </button>
            </div>
            <div className="ve-hero-stats" ref={statsRef}>
              {heroStatTriplet.map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 ? <div className="ve-stat-divider" /> : null}
                  <div className="ve-stat">
                    <strong>
                      {animatedStats[i] !== undefined
                        ? animatedStats[i]
                        : 0}
                      {stat.suffixe}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="ve-hero-right">
            <div
              className="ve-hero-img-main bg-img"
              style={{ backgroundImage: `url(${HERO_MAIN_IMG})` }}
            />
            <div
              className="ve-hero-img-accent bg-img"
              style={{ backgroundImage: `url(${HERO_ACCENT_IMG})` }}
            />
            <div className="ve-float-card">
              <FaChartLine aria-hidden />
              <div>
                <strong>+1000</strong>
                <span>Visiteurs accueillis</span>
              </div>
            </div>
          </div>
        </section>

        <div className="ve-trust-bar">
          <div className="ve-trust-inner">
            {[...trustItems, ...trustItems].map((item, idx) => (
              <span key={`${item.text}-${idx}`}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        <section className="ve-section ve-services-section">
          <div className="container">
            <div className="ve-section-header text-center">
              <span className="ve-section-tag">Notre fondation</span>
              <h2>
                Des piliers spirituels pour <span>grandir ensemble</span>
              </h2>
              <p>
                Foi, communauté et service : tout ce qui guide Vision Center au
                quotidien.
              </p>
            </div>
            <div className="ve-services-grid">
              {presentationData.valeurs.map((valeur) => (
                <div key={valeur.nom} className="ve-service-card">
                  <div className="ve-service-icon">{valeur.icone}</div>
                  <h4>{valeur.nom}</h4>
                  <p>{valeur.description}</p>
                  <button
                    type="button"
                    className="ve-card-link ve-link-btn"
                    onClick={() => navigate('/a-propos')}
                  >
                    En savoir plus <FaLongArrowAltRight aria-hidden />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ve-section ve-whyus-section">
          <div className="container">
            <div className="ve-whyus-row">
              <div className="ve-whyus-col-img">
                <div className="ve-whyus-img-wrap">
                  <div
                    className="ve-whyus-img-main bg-img"
                    style={{ backgroundImage: `url(${WHY_IMG})` }}
                  />
                  <div className="ve-whyus-badge">
                    <strong>15+</strong>
                    <span>Années de présence à Madagascar</span>
                  </div>
                </div>
              </div>
              <div className="ve-whyus-col-content">
                <div className="ve-whyus-content">
                  <span className="ve-section-tag">Pourquoi Vision Center</span>
                  <h2>
                    Une communauté pour <span>toute la famille</span>
                  </h2>
                  <p>{presentationData.description}</p>
                  <div className="ve-checklist">
                    {whyChecklist.map((item) => (
                      <div key={item.title} className="ve-check-item">
                        <FaCheckCircle aria-hidden />
                        <div>
                          <strong>{item.title}</strong>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="ve-btn-primary ve-btn-reset mt-30"
                    onClick={() => navigate('/a-propos')}
                  >
                    Découvrir notre histoire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ve-counter-section">
          <div className="container">
            <div className="ve-counter-grid">
              {presentationData.statistiques.map((stat, index) => (
                <div key={stat.label} className="ve-counter-item">
                  <FaUsers aria-hidden />
                  <strong className="ve-counter-strong">
                    {animatedStats[index] !== undefined
                      ? animatedStats[index]
                      : 0}
                  </strong>
                  <span className="ve-counter-suffix">{stat.suffixe}</span>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ve-section ve-testimonials-section">
          <div className="container">
            <div className="ve-section-header text-center">
              <span className="ve-section-tag">Paroles de vie</span>
              <h2>
                Messages qui <span>inspirent</span>
              </h2>
            </div>
            <div className="ve-testi-grid">
              {messagesInspirants.map((m) => (
                <div key={m.id} className="ve-testi-card">
                  <div className="ve-testi-stars" aria-hidden>
                    {'\u2605\u2605\u2605\u2605\u2605'}
                  </div>
                  <p>« {m.message} »</p>
                  <div className="ve-testi-author">
                    <div
                      className="ve-testi-avatar bg-img"
                      style={{ backgroundImage: `url(${m.image})` }}
                    />
                    <div>
                      <strong>{m.auteur}</strong>
                      <span>
                        {m.fonction} · {m.verset}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ve-section ve-testimonials-section ve-temoignages-subtle">
          <div className="container">
            <div className="ve-section-header text-center">
              <span className="ve-section-tag">Témoignages</span>
              <h2>
                Ce que dit <span>notre famille</span>
              </h2>
            </div>
            <div className="ve-testi-grid">
              {temoignages.map((t) => (
                <div key={t.id} className="ve-testi-card">
                  <div className="ve-testi-stars" aria-hidden>
                    {'\u2605\u2605\u2605\u2605\u2605'}
                  </div>
                  <p>« {t.temoignage} »</p>
                  <div className="ve-testi-author">
                    <div
                      className="ve-testi-avatar bg-img"
                      style={{ backgroundImage: `url(${t.image})` }}
                    />
                    <div>
                      <strong>{t.nom}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className="ve-cta-banner bg-img"
          style={{ backgroundImage: `url(${CTA_BG})` }}
        >
          <div className="ve-cta-overlay" />
          <div className="container ve-cta-content">
            <div className="ve-cta-row">
              <div className="ve-cta-text-col">
                <h2>
                  Prêt à faire le pas vers <span>Dieu et la communauté ?</span>
                </h2>
                <p>
                  Écrivez-nous ou venez nous rendre visite : nous serons
                  honorés de vous accueillir.
                </p>
              </div>
              <div className="ve-cta-btn-col">
                <button
                  type="button"
                  className="ve-btn-white ve-btn-reset"
                  onClick={() => navigate('/contact')}
                >
                  Prendre contact
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="ve-section ve-insights-section">
          <div className="container">
            <div className="ve-section-header text-center">
              <span className="ve-section-tag">À venir</span>
              <h2>
                Prochains <span>rendez-vous</span>
              </h2>
              <p>
                Cultes, camps et soirées : retrouvez les temps forts de la vie de
                l’église.
              </p>
            </div>
            <div className="ve-insights-grid">
              {evenementsProches.map((ev) => (
                <div key={ev.id} className="ve-insight-card">
                  <div
                    className="ve-insight-img bg-img"
                    style={{ backgroundImage: `url(${ev.image})` }}
                  />
                  <div className="ve-insight-body">
                    <span className="ve-insight-cat">{ev.cat}</span>
                    <h5>{ev.titre}</h5>
                    <p>{ev.description}</p>
                    <div className="ve-insight-meta">
                      <span>
                        <FaCalendarAlt aria-hidden /> {ev.date}
                      </span>
                      <button
                        type="button"
                        className="ve-insight-link-btn"
                        onClick={() => navigate('/programmes-activites')}
                      >
                        Voir le programme <FaArrowRight aria-hidden />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ve-newsletter-section">
          <div className="container">
            <div className="ve-newsletter-wrap">
              <div className="ve-nl-left">
                <FaEnvelope aria-hidden />
                <div>
                  <h3>Restons en contact</h3>
                  <p>
                    Recevez les annonces importantes et les invitations aux
                    événements.
                  </p>
                </div>
              </div>
              <form
                className="ve-nl-form"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Votre adresse e-mail"
                  required
                  autoComplete="email"
                />
                <button type="submit">S’inscrire</button>
              </form>
            </div>
          </div>
        </section>
      </main>
      {/* Chatbot IA pour les utilisateurs non connectés */}
      <FloatingMessenger />
    </div>
  );
}

export default AccueilVitrineSimple;
