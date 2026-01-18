import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import activiteService from "../../services/activite.service";
import "./ActiviteDetails.css";

const ActiviteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activite, setActivite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image améliorée pour Vision Center Madagascar
  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";

  // Données de test statiques
  const testData = {
    id_activite: "ACT-001",
    titre_activite: "Atelier de Formation en Leadership",
    description: "Rejoignez notre atelier intensif de formation en leadership conçu spécialement pour les jeunes professionnels de Madagascar. Cet événement unique vous offrira les compétences essentielles pour développer votre potentiel de leader et faire une différence positive dans votre communauté.\n\nAu programme :\n• Techniques de communication avancées\n• Gestion d'équipe et motivation\n• Prise de décision stratégique\n• Intelligence émotionnelle et empathie\n• Leadership adaptatif au contexte malgache\n\nNos formateurs expérimentés vous guideront à travers des exercices pratiques, des études de cas réelles et des sessions de coaching personnalisé.",
    date_heure_activite: "2024-02-15T09:00:00",
    lieu_activite: "Centre de Formation Vision Center - Antananarivo",
    capacite: 50,
    nb_participants: 32,
    est_complete: false,
    statut: "ouvert",
    image_activite: improvedImageBase64,
    image_url: improvedImageBase64,
    is_base64: true,
    responsable: {
      nom: "Rakoto",
      prenom: "Jean",
      email: "jean.rakoto@visioncenter.mg",
      telephone: "+261 34 12 345 67"
    },
    inscription_ouverte: true,
    prix: "Gratuit",
    duree: "2 jours",
    niveau: "Intermédiaire",
    prerequis: "Aucun prérequis spécifique",
    objectifs: [
      "Développer les compétences en leadership",
      "Améliorer la communication interpersonnelle", 
      "Apprendre à gérer une équipe efficacement",
      "Maîtriser la prise de décision"
    ]
  };

  useEffect(() => {
    // Simuler le chargement avec des données statiques
    const loadActiviteDetails = async () => {
      try {
        setLoading(true);
        
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Utiliser les données de test
        setActivite(testData);
        
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

  const handleRetour = () => {
    navigate("/");
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
    return (
      <div className="home-container">
        <div className="error-container">
          <div className="error-message">
            {error || "Activité non trouvée"}
          </div>
          <button onClick={handleRetour} className="btn btn-primary">
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const statut = activiteService.getActivityStatus(activite);
  const placesRestantes = activite.capacite ? activite.capacite - activite.nb_participants : "Illimité";

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
              <button 
                onClick={handleInscription} 
                className="btn btn-primary btn-large"
              >
                S'inscrire à cette activité
              </button>
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
              Retour à l'accueil
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
