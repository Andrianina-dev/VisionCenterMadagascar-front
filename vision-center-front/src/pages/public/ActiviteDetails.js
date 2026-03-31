import React, { useState, useEffect } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import activiteService from "../../services/activite.service";



const getActiviteById = async (id) => {

  
  

  try {

    const baseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

    const apiUrl = baseUrl.endsWith('/api') ? `${baseUrl.replace('/api', '')}/api/public/activites/${id}` : `${baseUrl}/api/public/activites/${id}`;

    

    
    

    const response = await fetch(apiUrl);

    

    if (!response.ok) {

      throw new Error(`Erreur HTTP: ${response.status}`);

    }

    

    const data = await response.json();

    

    // Utiliser les données réelles de la base sans modifications statiques

    
    return data;

  } catch (error) {

    console.error('Erreur lors de la récupération de l\'activité:', error);

    throw error;

  }

};



const ActiviteDetails = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [activite, setActivite] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [exigences, setExigences] = useState([]);

  const [loadingExigences, setLoadingExigences] = useState(false);

  const [showExigences, setShowExigences] = useState(true);

  const [typesActivites, setTypesActivites] = useState([]);

  const [documents, setDocuments] = useState([]);

  const [videos, setVideos] = useState([]);

  const [loadingRessources, setLoadingRessources] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const [showVideoPopup, setShowVideoPopup] = useState(false);

  const [isUserRegistered, setIsUserRegistered] = useState(false);



  // Image améliorée pour Vision Center Madagascar

  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";



  // Vérifier si l'utilisateur est inscrit à l'activité
  const checkUserRegistration = async (activiteId) => {
    try {
      // Récupérer l'ID utilisateur depuis localStorage/sessionStorage
      const member = localStorage.getItem('member') || sessionStorage.getItem('member');
      const memberData = member ? JSON.parse(member) : null;
      
      if (!memberData || !memberData.id) {
                return;
      }

      let utilisateurId = memberData.id;
      
      // Fallback: essayer de récupérer depuis les autres propriétés
      if (!utilisateurId && memberData) {
        if (memberData.member?.id) {
          utilisateurId = memberData.member.id;
        } else if (memberData.id_utilisateur) {
          utilisateurId = memberData.id_utilisateur;
        } else if (memberData.email) {
          // Extraire l'ID depuis l'email (format: USR-X)
          const emailMatch = memberData.email.match(/USR-(\d+)/);
          if (emailMatch) {
            utilisateurId = 'USR-' + emailMatch[1];
          }
        }
      }

      if (!utilisateurId) {
                return;
      }

      // Appeler l'API pour vérifier l'inscription
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/public/inscriptions/verifier/${activiteId}/${utilisateurId}`);
      
      if (response.ok) {
        const data = await response.json();
        setIsUserRegistered(data.isRegistered);
              } else {
        console.error('Erreur vérification inscription:', response.status);
        setIsUserRegistered(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification d\'inscription:', error);
      setIsUserRegistered(false);
    }
  };



  // Charger les exigences pour un type d'activité
  const loadExigencesForType = async (idType) => {
    try {
      setLoadingExigences(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/public/exigences/type/${idType}`);
      
      if (response.ok) {
        const exigencesData = await response.json();
        setExigences(exigencesData);
              } else {
        console.error('Erreur chargement exigences:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des exigences:', error);
    } finally {
      setLoadingExigences(false);
    }
  };



  // Charger les ressources (documents et vidéos) pour une activité
  const loadRessourcesForActivite = async (activiteId) => {
    try {
      setLoadingRessources(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
            
      // Appel API réel pour récupérer les ressources
      const response = await fetch(`${apiUrl}/admin/ressources/activite/${activiteId}`);
      
      if (!response.ok) {
        console.error('Erreur API ressources:', response.status);
        setDocuments([]);
        setVideos([]);
        return;
      }
      
      const ressourcesData = await response.json();
            
      // Séparer les documents et les vidéos
      const documents = ressourcesData.filter(r => r.type === 'document');
      const videos = ressourcesData.filter(r => r.type === 'video');
      
      setDocuments(documents);
      setVideos(videos);
      
    } catch (error) {
      console.error('Erreur chargement ressources:', error);
      setDocuments([]);
      setVideos([]);
    } finally {
      setLoadingRessources(false);
    }
  };



  useEffect(() => {

    const loadActiviteDetails = async () => {

      try {

        setLoading(true);

        

        // Charger les données réelles depuis l'API

        const activiteData = await getActiviteById(id);

        setActivite(activiteData);

        

        // Charger les types d'activités pour déterminer le type

        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

        const typesResponse = await fetch(`${apiUrl}/public/types-activites`);

        

        if (typesResponse.ok) {

          const typesData = await typesResponse.json();

          setTypesActivites(typesData);

          
        }

        

        // Charger les exigences si le type d'activité est disponible

        if (activiteData.id_type) {

          loadExigencesForType(activiteData.id_type);

        }

        

        // Charger les ressources (documents et vidéos) pour l'activité

        loadRessourcesForActivite(activiteData.id_activite);

        

        // Vérifier si l'utilisateur est inscrit à l'activité

        checkUserRegistration(activiteData.id_activite);

        

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



  // Fonctions pour gérer la popup vidéo

  const handleVideoClick = (video) => {

    setSelectedVideo(video);

    setShowVideoPopup(true);

  };



  const closeVideoPopup = () => {

    setShowVideoPopup(false);

    setSelectedVideo(null);

  };



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

  const placesRestantes = activite && activite.capacite ? (activite.capacite - (activite.nombre_participants || 0)) : "Illimité";

  const pourcentageRempli = activite && activite.capacite ? Math.round(((activite.nombre_participants || 0) / activite.capacite) * 100) : 0;

  const estComplet = activite && activite.capacite ? (activite.nombre_participants || 0) >= activite.capacite : false;



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

                  <span className="badge-text">{activite.nombre_participants || 0}/{activite.capacite || "Illimité"} places</span>

                  {pourcentageRempli > 0 && (

                    <span className="badge-percentage">({pourcentageRempli}% rempli)</span>

                  )}

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



            {/* Participants */}

            <div className="activite-info-card">

              <div className="activite-info-icon">👥</div>

              <div className="activite-info-content">

                <h3>Participants</h3>

                <p>{activite.nombre_participants || 0} / {activite.capacite || "Illimité"} places</p>

                <div className="places-restantes">

                  {placesRestantes} place{placesRestantes !== 1 ? "s" : ""} restante{placesRestantes !== 1 ? "s" : ""}

                  {pourcentageRempli > 0 && (

                    <span className="pourcentage-info">({pourcentageRempli}% rempli)</span>

                  )}

                </div>

                {activite.est_complet && (

                  <div className="complet-badge">⚠️ Complet</div>

                )}

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



          {/* Description - TOUJOURS visible */}

          <div className="activite-details-description">

            <h2>Description</h2>

            <p>{activite.description}</p>

          </div>



          {/* Message pour les formations non inscrites */}

          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'formation' && !isUserRegistered && (

            <div className="formation-access-message" style={{background: '#fff3cd', padding: '20px', margin: '20px 0', borderRadius: '8px', border: '2px solid #ffc107', textAlign: 'center'}}>

              <h3 style={{color: '#856404', marginBottom: '10px'}}>🔒 Accès Restreint</h3>

              <p style={{color: '#856404', fontSize: '16px', marginBottom: '15px'}}>

                Vous devez être inscrit à cette formation pour accéder aux ressources (vidéos, documents, objectifs).

              </p>

              <div style={{marginTop: '15px'}}>

                <button 

                  onClick={() => navigate(`/inscription/${id}`)} 

                  className="btn btn-primary btn-large"

                  style={{background: '#ffc107', color: '#000', border: 'none', padding: '12px 24px'}}

                >

                  S'inscrire à la formation

                </button>

              </div>

            </div>

          )}



          


          {/* Sections spécifiques selon le type d'activité */}

          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'formation' && isUserRegistered && (

            <div className="activite-details-formation">

              <h2>📚 Ressources de Formation</h2>

              <div className="formation-resources">

                <div className="resource-section">

                  <h3>🎥 Vidéos de Formation</h3>

                  {loadingRessources ? (

                    <div className="loading-ressources">Chargement des vidéos...</div>

                  ) : videos.length > 0 ? (

                    <div className="videos-grid">
                      {videos.map((video, index) => (
                        <div key={video.id || index} className="video-item">
                          <div className="video-thumbnail">
                            {video.url && video.url.includes('youtube.com') ? (
                              <img 
                                src={`https://img.youtube.com/vi/${video.url.split('v=')[1]?.split('&')[0]}/default.jpg`}
                                alt={video.titre}
                                className="video-thumbnail-img"
                              />
                            ) : (
                              <div className="video-thumbnail-placeholder">
                                <span className="play-icon">▶️</span>
                              </div>
                            )}
                          </div>
                          <div className="video-info">
                            <h4>{video.titre || `Vidéo ${index + 1}`}</h4>
                            <p className="video-duration">{video.duree || 'Durée non spécifiée'}</p>
                            {video.url && (
                              <button 
                                onClick={() => handleVideoClick(video)}
                                className="video-link"
                              >
                                Regarder la vidéo
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  ) : (

                    <div className="no-ressources">Aucune vidéo disponible pour cette formation</div>

                  )}

                </div>

                <div className="resource-section">

                  <h3>📄 Documents Nécessaires</h3>

                  {loadingRessources ? (

                    <div className="loading-ressources">Chargement des documents...</div>

                  ) : documents.length > 0 ? (

                    <div className="documents-list">
                      {documents.map((doc, index) => (
                        <div key={doc.id || index} className="document-item">
                          <span className="doc-icon">📄</span>
                          <div className="doc-info">
                            <h4>{doc.titre || `Document ${index + 1}`}</h4>
                            <p className="doc-size">
                              {doc.type_fichier ? doc.type_fichier.toUpperCase() : 'PDF'} - 
                              {doc.date_ajout ? new Date(doc.date_ajout).toLocaleDateString() : 'Date inconnue'}
                            </p>
                          </div>
                          {doc.url && (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-btn">
                              Télécharger
                            </a>
                          )}
                        </div>
                      ))}
                    </div>

                  ) : (

                    <div className="no-ressources">Aucun document disponible pour cette formation</div>

                  )}

                </div>

              </div>

            </div>

          )}



          


          


          {/* Objectifs - SEULEMENT pour les formations */}

          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'formation' && isUserRegistered && activite.objectifs && (

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



      {/* Popup vidéo modale */}

      {showVideoPopup && selectedVideo && (

        <div className="video-popup-overlay" onClick={closeVideoPopup}>

          <div className="video-popup-container" onClick={(e) => e.stopPropagation()}>

            <div className="video-popup-header">

              <h3>{selectedVideo.titre}</h3>

              <button className="video-popup-close" onClick={closeVideoPopup}>

                ×

              </button>

            </div>

            <div className="video-popup-content">

              {selectedVideo.url && selectedVideo.url.includes('youtube.com') ? (
                <iframe
                  className="video-popup-player"
                  src={`${selectedVideo.url.replace('watch?v=', 'embed/')}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`}
                  title={selectedVideo.titre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : selectedVideo.url && selectedVideo.url.includes('youtu.be') ? (
                <iframe
                  className="video-popup-player"
                  src={`https://www.youtube.com/embed/${selectedVideo.url.split('youtu.be/')[1]?.split('?')[0]}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`}
                  title={selectedVideo.titre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : selectedVideo.url ? (

                <video className="video-popup-player" controls autoPlay>

                  <source src={selectedVideo.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.

                </video>

              ) : null}

            </div>

            <div className="video-popup-footer">

              <p className="video-duration-popup">{selectedVideo.duree}</p>

              <a href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="video-popup-link">

                Ouvrir sur YouTube

              </a>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};



export default ActiviteDetails;

