import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt, FaSearch, FaFilter } from 'react-icons/fa';
import ApiService from '../../services/api';
import Card from '../../components/cards/Card';
import '../../styles/pages/MesActivites.css';

const MesActivites = () => {
  const navigate = useNavigate();
  
  const [activites, setActivites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('toutes');

  useEffect(() => {
    chargerMesActivites();
  }, []);

  const chargerMesActivites = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get('/member/activites-participees');
      setActivites(response.data.activites || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
      setError('Impossible de charger vos activités. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  const activitesFiltrees = activites.filter(activite => {
    const correspondRecherche = activite.titre_activite?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activite.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'toutes') return correspondRecherche;
    if (filterStatus === 'avenir') return correspondRecherche && new Date(activite.date_activite) > new Date();
    if (filterStatus === 'passe') return correspondRecherche && new Date(activite.date_activite) <= new Date();
    
    return correspondRecherche;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  if (loading) {
    return (
      <div className="mes-activites-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Chargement de vos activités...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mes-activites-container">
        <div className="error-state">
          <p>{error}</p>
          <button onClick={chargerMesActivites} className="retry-btn">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mes-activites-container">
      <div className="mes-activites-header">
        <h1>Mes Activités</h1>
        <p className="subtitle">Retrouvez toutes les activités auxquelles vous avez participé</p>
        
        <div className="filters-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'toutes' ? 'active' : ''}`}
              onClick={() => setFilterStatus('toutes')}
            >
              <FaCalendarAlt />
              Toutes
            </button>
            <button
              className={`filter-btn ${filterStatus === 'avenir' ? 'active' : ''}`}
              onClick={() => setFilterStatus('avenir')}
            >
              <FaClock />
              À venir
            </button>
            <button
              className={`filter-btn ${filterStatus === 'passe' ? 'active' : ''}`}
              onClick={() => setFilterStatus('passe')}
            >
              <FaCalendarAlt />
              Passées
            </button>
          </div>
        </div>
      </div>

      <div className="activites-grid">
        {activitesFiltrees.length === 0 ? (
          <div className="empty-state">
            <FaCalendarAlt className="empty-icon" />
            <h3>Aucune activité trouvée</h3>
            <p>
              {searchQuery 
                ? `Aucune activité ne correspond à "${searchQuery}"`
                : 'Vous n\'avez pas encore participé à des activités'
              }
            </p>
            <button 
              onClick={() => navigate('/member/programmes')}
              className="discover-btn"
            >
              Découvrir les activités
            </button>
          </div>
        ) : (
          activitesFiltrees.map((activite) => (
            <Card key={activite.id} className="activite-card">
              <div className="activite-header">
                <div className="activite-titre">
                  <h3>{activite.titre_activite}</h3>
                  <span className={`status-badge ${activite.statut?.toLowerCase()}`}>
                    {activite.statut || 'Terminé'}
                  </span>
                </div>
                <div className="activite-meta">
                  <span className="participants">
                    <FaUsers />
                    {activite.nombre_participants || 0} participants
                  </span>
                  <span className="date">
                    <FaCalendarAlt />
                    {formatDate(activite.date_activite)}
                  </span>
                </div>
              </div>
              
              <div className="activite-content">
                <p className="description">
                  {activite.description || 'Aucune description disponible'}
                </p>
                
                <div className="activite-details">
                  <div className="detail-item">
                    <FaClock />
                    <span>
                      {formatTime(activite.heure_debut)} - {formatTime(activite.heure_fin)}
                    </span>
                  </div>
                  {activite.lieu && (
                    <div className="detail-item">
                      <FaMapMarkerAlt />
                      <span>{activite.lieu}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="activite-footer">
                <button 
                  onClick={() => navigate(`/member/activite/${activite.id}`)}
                  className="details-btn"
                >
                  Voir les détails
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MesActivites;
