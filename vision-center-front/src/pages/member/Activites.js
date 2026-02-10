import React, { useState, useEffect } from 'react';
import MemberSidebar from '../../components/MemberSidebar';
import '../../styles/pages/Activites.css';

const Activites = () => {
  const [activeNav, setActiveNav] = useState('activities');
  const [activites, setActivites] = useState([]);
  const [filteredActivites, setFilteredActivites] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Types d'activités (données de test)
  const typesActivites = [
    { id: 'all', libelle: 'Toutes les activités' },
    { id: 'TYP-1', libelle: 'Formations' },
    { id: 'TYP-2', libelle: 'Rencontres' },
    { id: 'TYP-3', libelle: 'Événements' },
    { id: 'TYP-4', libelle: 'Autres activités' }
  ];

  // Données de test pour les activités
  const activitesTest = [
    {
      id: 'ACT-1',
      titre: 'Formation Leadership Chrétien',
      description: 'Formation sur les principes du leadership selon la Bible pour les jeunes leaders.',
      type: 'TYP-1',
      typeLibelle: 'Formations',
      date: '2026-02-15 09:00',
      lieu: 'Centre Vision Center - Antananarivo',
      capacite: 30,
      participants: 12,
      statut: 'ouverte'
    },
    {
      id: 'ACT-2',
      titre: 'Camp d\'été Spirituel',
      description: 'Camp de 3 jours avec enseignements, jeux et temps de prière.',
      type: 'TYP-2',
      typeLibelle: 'Rencontres',
      date: '2026-02-20 18:00',
      lieu: 'Site de Camp - Andasibe',
      capacite: 100,
      participants: 45,
      statut: 'ouverte'
    },
    {
      id: 'ACT-3',
      titre: 'Atelier de Louange',
      description: 'Apprentissage des chants et instruments de louange contemporaine.',
      type: 'TYP-3',
      typeLibelle: 'Événements',
      date: '2026-02-25 14:00',
      lieu: 'Salle de Musique - Centre Vision',
      capacite: 25,
      participants: 25,
      statut: 'fermée'
    },
    {
      id: 'ACT-4',
      titre: 'Service Communautaire',
      description: 'Journée de service dans les orphelinats et hôpitaux.',
      type: 'TYP-4',
      typeLibelle: 'Autres activités',
      date: '2026-02-10 08:00',
      lieu: 'Différents lieux - Antananarivo',
      capacite: 80,
      participants: 80,
      statut: 'terminée'
    },
    {
      id: 'ACT-5',
      titre: 'Étude Biblique Jeunesse',
      description: 'Session d\'étude biblique hebdomadaire pour les 15-25 ans.',
      type: 'TYP-1',
      typeLibelle: 'Formations',
      date: '2026-02-22 18:00',
      lieu: 'Salle Multimédia - Centre Vision',
      capacite: 50,
      participants: 28,
      statut: 'ouverte'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des activités
    setTimeout(() => {
      setActivites(activitesTest);
      setFilteredActivites(activitesTest);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrer les activités par type
    if (selectedType === 'all') {
      setFilteredActivites(activites);
    } else {
      const filtered = activites.filter(activite => activite.type === selectedType);
      setFilteredActivites(filtered);
    }
  }, [selectedType, activites]);

  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case 'ouverte': return '#28a745';
      case 'fermée': return '#ffc107';
      case 'terminée': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const getStatutText = (statut) => {
    switch (statut) {
      case 'ouverte': return 'Ouverte';
      case 'fermée': return 'Fermée';
      case 'terminée': return 'Terminée';
      default: return statut;
    }
  };

  const getProgressPercentage = (participants, capacite) => {
    if (!capacite) return 100;
    return Math.round((participants / capacite) * 100);
  };

  return (
    <div className="member-layout">
      <div className="member-sidebar-compact">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeNav === 'activities' ? 'active' : ''}`}>
            <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Activités</span>
          </div>
        </nav>
      </div>
      
      <div className="member-content-area">
        <header className="member-header">
          <div className="header-content">
            <h1 className="header-title">Activités</h1>
            <p className="header-subtitle">Découvrez et participez à nos activités</p>
          </div>
        </header>
        
        <main className="member-main">
          {/* Filtre par type */}
          <div className="filter-section">
            <h3 className="filter-title">Filtrer par type</h3>
            <div className="filter-buttons">
              {typesActivites.map(type => (
                <button
                  key={type.id}
                  className={`filter-btn ${selectedType === type.id ? 'active' : ''}`}
                  onClick={() => handleTypeChange(type.id)}
                >
                  {type.libelle}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des activités */}
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner">Chargement...</div>
            </div>
          ) : (
            <div className="activites-grid">
              {filteredActivites.map(activite => (
                <div key={activite.id} className="activite-card">
                  <div className="activite-header">
                    <span className="activite-type">{activite.typeLibelle}</span>
                    <span 
                      className="activite-statut" 
                      style={{ backgroundColor: getStatutColor(activite.statut) }}
                    >
                      {getStatutText(activite.statut)}
                    </span>
                  </div>
                  
                  <div className="activite-content">
                    <h3 className="activite-titre">{activite.titre}</h3>
                    <p className="activite-description">{activite.description}</p>
                    
                    <div className="activite-info">
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>{activite.date}</span>
                      </div>
                      <div className="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13"></path>
                          <path d="M21 21v-7"></path>
                        </svg>
                        <span>{activite.lieu}</span>
                      </div>
                    </div>
                    
                    <div className="activite-participation">
                      <div className="participation-info">
                        <span className="participants-count">
                          {activite.participants}/{activite.capacite || '∞'}
                        </span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${getProgressPercentage(activite.participants, activite.capacite)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <button className="participate-btn">
                        {activite.statut === 'ouverte' ? 'S\'inscrire' : 
                         activite.statut === 'fermée' ? 'Complet' : 'Terminé'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Activites;
