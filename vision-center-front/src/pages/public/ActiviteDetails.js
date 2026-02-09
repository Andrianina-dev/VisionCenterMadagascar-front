import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import activiteService from "../../services/activite.service";

const getActiviteById = async (id) => {
  console.log(`Tentative de chargement de l'activité ${id} à ${new Date().toISOString()}`);
  
  try {
    // Correction de l'URL pour éviter le double /api/
    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
    const apiUrl = baseUrl.endsWith('/api') ? `${baseUrl.replace('/api', '')}/api/public/activites/${id}` : `${baseUrl}/api/public/activites/${id}`;
    
    console.log(`URL appelée: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Activité ${id} chargée avec succès:`, data);
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'activité:', error);
    throw error;
  }
}

const ActiviteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image améliorée pour Vision Center Madagascar
  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";

  useEffect(() => {
    const loadActiviteDetails = async () => {
      try {
        setLoading(true);
        
        // Charger les données réelles depuis l'API
        const activiteData = await getActiviteById(id);
        setActivite(activiteData);
        
      } catch (err) {
        setError("Erreur lors du chargement des détails de l'activité");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    loadActiviteDetails();
  }, [id]);

  const handleInscription = () => {
    navigate(`/inscription/${id}`);
  };

  const handleParticiper = () => {
    // Rediriger vers la page d'inscription avec l'ID de l'activité
    navigate(`/inscription/${id}`);
  };

  const handleRetour = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-container">
          <div className="loading-spinner">Chargement des détails...</div>
        </div>
      </div>
    );
  }

  if (error || !activite) {
    // Essayer de parser l'erreur pour voir si elle contient les activités disponibles
    let availableActivities = [];
    let detailedError = error || "Activité non trouvée";
    
    try {
      // Si l'erreur est en JSON, essayer d'extraire les activités disponibles
      if (error && error.includes('available_activities')) {
        const errorObj = JSON.parse(error);
        availableActivities = errorObj.available_activities || [];
        detailedError = errorObj.message || detailedError;
      }
    } catch (e) {
      console.log('Impossible de parser l\'erreur:', e);
    }

    return (
      <div className="home-container">
        <div className="error-container">
          <div className="error-message">
            {detailedError}
          </div>
          <div className="error-details">
            <p>ID demandé: <strong>{id}</strong></p>
            
            {availableActivities.length > 0 && (
              <div className="available-activities">
                <h4>Activités disponibles dans la base :</h4>
                <div className="activities-list">
                  {availableActivities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <span className="activity-id">{activity.id_activite}</span>
                      <span className="activity-title">{activity.titre_activite}</span>
                      <span className="activity-status">{activity.statut}</span>
                      <a 
                        href={`/activite-details/${activity.id_activite}`}
                        className="activity-link"
                      >
                        Voir →
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleRetour} className="btn btn-primary">
            Retour aux activités
          </button>
        </div>
      </div>
    );
  }

  const statut = activite ? activiteService.getActivityStatus(activite) : { icon: "", text: "Chargement...", class: "loading" };
  const placesRestantes = activite && activite.capacite ? activite.capacite - (activite.nb_participants || 0) : "Illimité";

  return (
    <div className="home-container">
      <div className="activite-details-container">
        {/* En-tête moderne avec image de fond */}
        <div className="activite-details-hero">
          <div className="activite-hero-overlay">
            <div className="activite-hero-content">
              <button onClick={handleRetour} className="btn-back-hero">
                <span className="btn-back-icon">←</span>
                Retour aux activités
              </button>
              
              <div className="activite-hero-info">
                <h1 className="activite-hero-title">{activite.titre_activite}</h1>
                <div className="activite-hero-meta">
                  <span className={`activite-hero-statut ${statut.class}`}>
                    {statut.icon} {statut.text}
                  </span>
                  <span className="activite-hero-date">
                    📅 {activiteService.formatDate(activite.date_heure_activite)}
                  </span>
                </div>
              </div>
              
              <div className="activite-hero-badges">
                <div className="activite-badge">
                  <span className="badge-icon">👥</span>
                  <span className="badge-text">{activite.nb_participants}/{activite.capacite}</span>
                </div>
                <div className="activite-badge">
                  <span className="badge-icon">📍</span>
                  <span className="badge-text">Antananarivo</span>
                </div>
                <div className="activite-badge">
                  <span className="badge-icon">💰</span>
                  <span className="badge-text">{activite.prix}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="activite-details-content">
          {/* Image principale */}
          <div className="activite-details-image">
            {activite.image_url ? (
              activite.is_base64 ? (
                <img 
                  src={activite.image_url} 
                  alt={activite.titre_activite} 
                  className="activite-image-large"
                />
              ) : (
                <img 
                  src={activiteService.getImageUrl(activite.image_url)} 
                  alt={activite.titre_activite} 
                  className="activite-image-large"
                />
              )
            ) : (
              <div className="activite-image-placeholder">
                <img 
                  src={improvedImageBase64} 
                  alt="Image par défaut" 
                  className="activite-image-large"
                />
              </div>
            )}
          </div>
          
          <div className="activite-details-info-grid">
            {/* Date et heure */}
            <div className="activite-info-card">
              <div className="activite-info-icon">📅</div>
              <div className="activite-info-content">
                <h3>Date et heure</h3>
                <p>{activiteService.formatDate(activite.date_heure_activite)}</p>
                <p className="activite-duree">Durée: {activite.duree}</p>
              </div>
            </div>

            {/* Lieu */}
            <div className="activite-info-card">
              <div className="activite-info-icon">📍</div>
              <div className="activite-info-content">
                <h3>Lieu</h3>
                <p>{activite.lieu_activite}</p>
              </div>
            </div>

            {/* Capacité */}
            <div className="activite-info-card">
              <div className="activite-info-icon">👥</div>
              <div className="activite-info-content">
                <h3>Participants</h3>
                <p>{activite.nb_participants} / {activite.capacite || "Illimité"}</p>
                <div className="places-restantes">
                  {placesRestantes} place{placesRestantes !== 1 ? "s" : ""} restante{placesRestantes !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Responsable */}
            {activite.responsable && (
              <div className="activite-info-card">
                <div className="activite-info-icon">👤</div>
                <div className="activite-info-content">
                  <h3>Responsable</h3>
                  <p>{activite.responsable.prenom} {activite.responsable.nom}</p>
                  <p className="activite-contact">{activite.responsable.email}</p>
                </div>
              </div>
            )}

            {/* Prix */}
            <div className="activite-info-card">
              <div className="activite-info-icon">💰</div>
              <div className="activite-info-content">
                <h3>Prix</h3>
                <p className="activite-prix">{activite.prix}</p>
              </div>
            </div>

            {/* Niveau */}
            <div className="activite-info-card">
              <div className="activite-info-icon">📊</div>
              <div className="activite-info-content">
                <h3>Niveau</h3>
                <p>{activite.niveau}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="activite-details-description">
            <h2>Description</h2>
            <p>{activite.description}</p>
          </div>

          {/* Objectifs */}
          {activite.objectifs && (
            <div className="activite-details-objectifs">
              <h2>Objectifs de la formation</h2>
              <ul className="objectifs-list">
                {activite.objectifs.map((objectif, index) => (
                  <li key={index} className="objectif-item">
                    <span className="objectif-bullet">✓</span>
                    {objectif}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prérequis */}
          {activite.prerequis && (
            <div className="activite-details-prerequis">
              <h2>Prérequis</h2>
              <p>{activite.prerequis}</p>
            </div>
          )}

          {/* Actions */}
          <div className="activite-details-actions">
            {!activite.est_complete && new Date(activite.date_heure_activite) > new Date() && (
              <>
                <button 
                  onClick={handleParticiper} 
                  className="btn btn-success btn-large"
                >
                   Participez
                </button>
                
                <button 
                  onClick={handleInscription} 
                  className="btn btn-primary btn-large"
                >
                  S'inscrire à cette activité
                </button>
              </>
            )}
            
            {activite.est_complete && (
              <button className="btn btn-disabled btn-large" disabled>
                Activité complète
              </button>
            )}
            
            {new Date(activite.date_heure_activite) <= new Date() && (
              <button className="btn btn-disabled btn-large" disabled>
                Activité terminée
              </button>
            )}

            <button 
              onClick={handleRetour} 
              className="btn btn-secondary btn-large"
            >
              Retour aux activités
            </button>

            <button 
              onClick={() => navigate('/map')} 
              className="btn btn-map btn-large"
            >
              🗺️ Voir sur la carte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiviteDetails;
