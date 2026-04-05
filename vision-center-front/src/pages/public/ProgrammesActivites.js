import React from 'react';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaBook, FaPray, FaHandshake } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ProgrammesActivites.css';

const ProgrammesActivites = () => {
  const navigate = useNavigate();

  const programmes = [
    {
      id: 1,
      title: "Étude Biblique Hebdomadaire",
      category: "Formation",
      description: "Approfondissez votre connaissance des Écritures à travers nos sessions d'étude hebdomadaires.",
      icon: <FaBook />,
      schedule: "Tous les mercredis",
      time: "18:00 - 19:30",
      location: "Salle Multimédia",
      audience: "Jeunes et adultes",
      color: "blue"
    },
    {
      id: 2,
      title: "Culte de Louange",
      category: "Spirituel",
      description: "Moments de louange et d'adoration pour nourrir votre spiritualité.",
      icon: <FaPray />,
      schedule: "Chaque dimanche",
      time: "09:00 - 11:00",
      location: "Salle Principale",
      audience: "Toute la famille",
      color: "purple"
    },
    {
      id: 3,
      title: "Groupes de Partage",
      category: "Communauté",
      description: "Petits groupes pour partager, prier et grandir ensemble dans la foi.",
      icon: <FaUsers />,
      schedule: "Chaque semaine",
      time: "Variable selon les groupes",
      location: "Divers lieux",
      audience: "Petits groupes",
      color: "green"
    },
    {
      id: 4,
      title: "Ateliers de Développement Personnel",
      category: "Formation",
      description: "Développez vos talents et compétences pour votre épanouissement personnel.",
      icon: <FaHandshake />,
      schedule: "Mensuel",
      time: "14:00 - 17:00",
      location: "Salle de Formation",
      audience: "Jeunes et adultes",
      color: "orange"
    },
    {
      id: 5,
      title: "Camp Spirituel Annuel",
      category: "Événement",
      description: "3 jours de retraite spirituelle intense avec enseignements et activités.",
      icon: <FaCalendarAlt />,
      schedule: "Annuel (Juillet)",
      time: "3 jours",
      location: "Andasibe",
      audience: "Tous",
      color: "red"
    },
    {
      id: 6,
      title: "Programme Jeunesse",
      category: "Jeunesse",
      description: "Activités spécifiques pour les jeunes : sports, loisirs, et formation spirituelle.",
      icon: <FaUsers />,
      schedule: "Chaque samedi",
      time: "14:00 - 18:00",
      location: "Parc Jeunesse",
      audience: "12-25 ans",
      color: "teal"
    }
  ];

  const handleInscription = (programme) => {
    // Rediriger vers login pour l'inscription
    navigate('/login', { state: { programmeId: programme.id } });
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
      orange: '#F59E0B',
      red: '#EF4444',
      teal: '#14B8A6'
    };
    return colors[color] || '#6B7280';
  };

  return (
    <div className="programmes-activites">
      {/* Header */}
      <section className="programmes-header">
        <div className="header-background">
          <div className="header-gradient"></div>
        </div>
        <div className="container">
          <div className="header-content">
            <h1>Programmes & Activités</h1>
            <p>Découvrez toutes nos activités conçues pour votre épanouissement spirituel et personnel</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="programmes-intro">
        <div className="container">
          <div className="intro-content">
            <h2>Notre Mission</h2>
            <p>Nous proposons une variété de programmes et d'activités pour répondre aux besoins de notre communauté. Que vous soyez jeune ou adulte, débutant ou expérimenté, vous trouverez des activités adaptées à votre cheminement spirituel et personnel.</p>
          </div>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="programmes-grid">
        <div className="container">
          <h2>Nos Programmes</h2>
          <div className="grid">
            {programmes.map((programme) => (
              <div key={programme.id} className="programme-card">
                <div className="programme-header" style={{ backgroundColor: getCategoryColor(programme.color) }}>
                  <div className="programme-icon">{programme.icon}</div>
                  <div className="programme-category">{programme.category}</div>
                </div>
                <div className="programme-content">
                  <h3>{programme.title}</h3>
                  <p>{programme.description}</p>
                  <div className="programme-details">
                    <div className="detail-item">
                      <FaCalendarAlt className="detail-icon" />
                      <span>{programme.schedule}</span>
                    </div>
                    <div className="detail-item">
                      <FaClock className="detail-icon" />
                      <span>{programme.time}</span>
                    </div>
                    <div className="detail-item">
                      <FaMapMarkerAlt className="detail-icon" />
                      <span>{programme.location}</span>
                    </div>
                    <div className="detail-item">
                      <FaUsers className="detail-icon" />
                      <span>{programme.audience}</span>
                    </div>
                  </div>
                  <div className="programme-actions">
                    <button 
                      onClick={() => handleInscription(programme)}
                      className="btn-primary"
                    >
                      S'inscrire
                    </button>
                    <button className="btn-outline">
                      En savoir plus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="programmes-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Rejoignez-nous!</h2>
            <p>Devenez membre pour accéder à toutes nos activités et bénéficier d'un accompagnement personnalisé.</p>
            <div className="cta-actions">
              <button onClick={() => navigate('/login')} className="btn-primary btn-large">
                Devenir Membre
              </button>
              <button onClick={() => navigate('/a-propos')} className="btn-outline btn-large">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgrammesActivites;
