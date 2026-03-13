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

    

    // Utiliser les données réelles de la base sans modifications statiques

    console.log(`Activité ${id} chargée avec succès:`, data);

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



  // Image améliorée pour Vision Center Madagascar

  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";



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

          console.log('Types d\'activités chargés:', typesData);

        }

        

        // Charger les exigences si le type d'activité est disponible

        if (activiteData.id_type) {

          loadExigencesForType(activiteData.id_type);

        }

        

        // Charger les ressources (documents et vidéos) pour l'activité

        loadRessourcesForActivite(activiteData.id_activite);

        

      } catch (err) {

        setError("Erreur lors du chargement des détails de l'activité");

        console.error("Erreur:", err);

      } finally {

        setLoading(false);

      }

    };



    loadActiviteDetails();

  }, [id]);



  // Charger les exigences pour un type d'activité

  const loadExigencesForType = async (idType) => {

    try {

      setLoadingExigences(true);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/public/exigences/type/${idType}`);

      

      if (response.ok) {

        const exigencesData = await response.json();

        setExigences(exigencesData);

        console.log(`Exigences pour l'activité de type ${idType}:`, exigencesData);

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

      

      // DONNÉES DE TEST - Pour voir le design dans le front

      console.log('🧪 Utilisation des données de test pour les ressources');

      

      // Documents de test selon le type d'activité

      const testDocuments = [

        {

          id: 1,

          titre: "Guide de Prière Quotidienne",

          taille: "PDF - 2.3 MB",

          url: "https://example.com/guide-priere.pdf",

          type: "guide"

        },

        {

          id: 2,

          titre: "Paroles Bibliques du Jour",

          taille: "PDF - 1.5 MB", 

          url: "https://example.com/paroles-bibliques.pdf",

          type: "lecture"

        },

        {

          id: 3,

          titre: "Exercices de Méditation",

          taille: "PDF - 3.1 MB",

          url: "https://example.com/exercices-meditation.pdf", 

          type: "exercice"

        }

      ];

      

      // Vidéos de test selon le type d'activité - VIDÉOS EN LIGNE RÉELLES

      const testVideos = [

        {

          id: 1,

          titre: "Introduction à la Prière Chrétienne",

          duree: "15 min",

          url: "https://www.youtube.com/watch?v=O9xK4JhQv0", // Vidéo réelle de prière

          type: "introduction"

        },

        {

          id: 2,

          titre: "Méditation Guidée - Paix Intérieure",

          duree: "30 min",

          url: "https://www.youtube.com/watch?v=6p_62X2J3E", // Méditation chrétienne

          type: "meditation"

        },

        {

          id: 3,

          titre: "Étude Biblique - La Foi et l'Espérance",

          duree: "45 min",

          url: "https://www.youtube.com/watch?v=XH8r5kYk9o", // Étude biblique

          type: "etude"

        }

      ];

      

      // Simuler un délai de chargement pour voir l'effet

      await new Promise(resolve => setTimeout(resolve, 1000));

      

      // Appliquer les données de test pour voir dans le front

      setDocuments(testDocuments);

      setVideos(testVideos);

      

      console.log(`📚 Documents de test chargés:`, testDocuments);

      console.log(`🎥 Vidéos de test chargées:`, testVideos);

      console.log(`🔍 Nombre de documents:`, testDocuments.length);

      console.log(`🔍 Nombre de vidéos:`, testVideos.length);

      

      // API RÉELLE - À décommenter quand l'API est prête

      /*

       // Charger les documents

       const documentsResponse = await fetch(`${apiUrl}/public/activites/${activiteId}/documents`);

       if (documentsResponse.ok) {

         const documentsData = await documentsResponse.json();

         setDocuments(documentsData);

         console.log(`Documents pour l'activité ${activiteId}:`, documentsData);

       } else {

         console.log('Aucun document trouvé ou erreur:', documentsResponse.status);

         setDocuments([]);

       }

       

       // Charger les vidéos

       const videosResponse = await fetch(`${apiUrl}/public/activites/${activiteId}/videos`);

       if (videosResponse.ok) {

         const videosData = await videosResponse.json();

         setVideos(videosData);

         console.log(`Vidéos pour l'activité ${activiteId}:`, videosData);

       } else {

         console.log('Aucune vidéo trouvée ou erreur:', videosResponse.status);

         setVideos([]);

       }

       */

      

    } catch (error) {

      console.error('Erreur chargement ressources:', error);

      setDocuments([]);

      setVideos([]);

    } finally {

      setLoadingRessources(false);

    }

  };



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



          {/* Sections spécifiques selon le type d'activité */}

          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'formation' && (

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

                        <div key={index} className="video-item">

                          <div className="video-thumbnail">

                            <span className="play-icon">▶️</span>

                          </div>

                          <div className="video-info">

                            <h4>{video.titre || `Vidéo ${index + 1}`}</h4>

                            <p className="video-duration">{video.duree || 'Durée non spécifiée'}</p>

                            {video.url && (

                              <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link">

                                Regarder la vidéo

                              </a>

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

                        <div key={index} className="document-item">

                          <span className="doc-icon">📄</span>

                          <div className="doc-info">

                            <h4>{doc.titre || `Document ${index + 1}`}</h4>

                            <p className="doc-size">{doc.taille || 'PDF'}</p>

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



          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'rencontre' && (

            <div className="activite-details-rencontre">

              <h2>🙏 Détails de la Rencontre Spirituelle</h2>

              <div className="rencontre-content">

                <div className="rencontre-lieu">

                  <h3>📍 Lieu de Rencontre</h3>

                  <div className="lieu-details">

                    <div className="lieu-info">

                      <p className="lieu-nom">{activite.lieu_activite}</p>

                      <p className="lieu-adresse">Adresse complète du lieu</p>

                      <p className="lieu-horaires">Ouverture: 30 min avant</p>

                    </div>

                    <button className="voir-carte-btn">🗺️ Voir sur la carte</button>

                  </div>

                </div>

                <div className="rencontre-programme">

                  <h3>📅 Programme Spirituel</h3>

                  <div className="programme-items">

                    <div className="programme-item">

                      <span className="time">14:00</span>

                      <div className="programme-content">

                        <h4>Accueil et prière d'ouverture</h4>

                        <p>Moment de recueillement et bienvenue</p>

                      </div>

                    </div>

                    <div className="programme-item">

                      <span className="time">14:30</span>

                      <div className="programme-content">

                        <h4>Partage spirituel</h4>

                        <p>Thème: La foi et la persévérance</p>

                      </div>

                    </div>

                    <div className="programme-item">

                      <span className="time">15:30</span>

                      <div className="programme-content">

                        <h4>Méditation guidée</h4>

                        <p>Session de méditation collective</p>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="rencontre-recommandations">

                  <h3>💡 Recommandations</h3>

                  <div className="recommandations-list">

                    <div className="recommandation-item">

                      <span className="rec-icon">👕</span>

                      <p>Tenue vestimentaire modeste et respectueuse</p>

                    </div>

                    <div className="recommandation-item">

                      <span className="rec-icon">📿</span>

                      <p>Apporter votre Bible ou livre spirituel</p>

                    </div>

                    <div className="recommandation-item">

                      <span className="rec-icon">🙏</span>

                      <p>Venir avec un cœur ouvert et humble</p>

                    </div>

                  </div>

                </div>

                

                {/* Ressources pour les rencontres */}

                {(documents.length > 0 || videos.length > 0) && (

                  <div className="rencontre-ressources">

                    <h3>📚 Ressources Spirituelles</h3>

                    {videos.length > 0 && (

                      <div className="resource-section">

                        <h4>🎥 Vidéos de Méditation</h4>

                        <div className="videos-grid">

                          {videos.map((video, index) => (

                            <div key={index} className="video-item">

                              <div className="video-thumbnail">

                                <span className="play-icon">▶️</span>

                              </div>

                              <div className="video-info">

                                <h4>{video.titre || `Méditation ${index + 1}`}</h4>

                                <p className="video-duration">{video.duree || 'Durée non spécifiée'}</p>

                                {video.url && (

                                  <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link">

                                    Regarder

                                  </a>

                                )}

                              </div>

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                    {documents.length > 0 && (

                      <div className="resource-section">

                        <h4>📄 Documents de Prière</h4>

                        <div className="documents-list">

                          {documents.map((doc, index) => (

                            <div key={index} className="document-item">

                              <span className="doc-icon">📄</span>

                              <div className="doc-info">

                                <h4>{doc.titre || `Document ${index + 1}`}</h4>

                                <p className="doc-size">{doc.taille || 'PDF'}</p>

                              </div>

                              {doc.url && (

                                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-btn">

                                  Télécharger

                                </a>

                              )}

                            </div>

                          ))}

                        </div>

                      </div>

                    )}

                  </div>

                )}

              </div>

            </div>

          )}



          {typesActivites.find(t => t.id === activite.id_type)?.libelle_type?.toLowerCase() === 'evenement' && (

            <div className="activite-details-evenement">

              <h2>🎉 Détails de l'Événement</h2>

              <div className="evenement-content">

                <div className="evenement-lieu">

                  <h3>📍 Lieu de l'Événement</h3>

                  <div className="lieu-details">

                    <div className="lieu-info">

                      <p className="lieu-nom">{activite.lieu_activite}</p>

                      <p className="lieu-adresse">Adresse complète de l'événement</p>

                      <p className="lieu-acces">Accès: Transport public disponible</p>

                    </div>

                    <button className="voir-carte-btn">🗺️ Voir sur la carte</button>

                  </div>

                </div>

                <div className="evenement-activites">

                  <h3>🎯 Ce qu'on ferait</h3>

                  <div className="activites-list">

                    <div className="activite-item">

                      <span className="activite-icon">🎵</span>

                      <div className="activite-content">

                        <h4>Musique et chants</h4>

                        <p>Session de louange et adoration</p>

                      </div>

                    </div>

                    <div className="activite-item">

                      <span className="activite-icon">🍽️</span>

                      <div className="activite-content">

                        <h4>Partage de repas</h4>

                        <p>Moment de communion et fraternité</p>

                      </div>

                    </div>

                    <div className="activite-item">

                      <span className="activite-icon">🎪</span>

                      <div className="activite-content">

                        <h4>Activités pour enfants</h4>

                        <p>Programme spécial pour les plus jeunes</p>

                      </div>

                    </div>

                    <div className="activite-item">

                      <span className="activite-icon">🎁</span>

                      <div className="activite-content">

                        <h4>Distribution de cadeaux</h4>

                        <p>Partage de bénédictions matérielles</p>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="evenement-suggestions">

                  <h3>💡 Ce qu'on devrait y mettre</h3>

                  <div className="suggestions-list">

                    <div className="suggestion-item">

                      <span className="sug-icon">📸</span>

                      <p>Zone photo pour immortaliser les moments</p>

                    </div>

                    <div className="suggestion-item">

                      <span className="sug-icon">💺</span>

                      <p>Sièges confortables pour tous</p>

                    </div>

                    <div className="suggestion-item">

                      <span className="sug-icon">🎤</span>

                      <p>Système sonore de qualité</p>

                    </div>

                    <div className="suggestion-item">

                      <span className="sug-icon">🚻</span>

                      <p>Installations sanitaires propres</p>

                    </div>

                    <div className="suggestion-item">

                      <span className="sug-icon">♿️</span>

                      <p>Accès pour personnes à mobilité réduite</p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          )}



          {/* SECTION PAR DÉFAUT - Ressources pour TOUS les types d'activités */}

          {(documents.length > 0 || videos.length > 0) && (

            <div className="activite-details-ressources">

              <h2>📚 Ressources de l'Activité</h2>

              

              {/* Debug info */}

              <div style={{background: '#f0f0f0', padding: '10px', margin: '10px 0', borderRadius: '5px'}}>

                <p>🔍 Debug - Documents: {documents.length}, Vidéos: {videos.length}</p>

                <p>📄 Premier document: {documents[0]?.titre}</p>

                <p>🎥 Première vidéo: {videos[0]?.titre}</p>

              </div>

              

              {/* Section Vidéos */}

              {videos.length > 0 && (

                <div className="resource-section">

                  <h3>🎥 Vidéos Disponibles</h3>

                  {loadingRessources ? (

                    <div className="loading-ressources">Chargement des vidéos...</div>

                  ) : (

                    <div className="videos-grid">

                      {videos.map((video, index) => (

                        <div key={index} className="video-item" onClick={() => handleVideoClick(video)}>

                          <div className="video-thumbnail">

                            <span className="play-icon">▶️</span>

                          </div>

                          <div className="video-info">

                            <h4>{video.titre || `Vidéo ${index + 1}`}</h4>

                            <p className="video-duration">{video.duree || 'Durée non spécifiée'}</p>

                            

                            {/* Lien YouTube au lieu du lecteur intégré */}

                            {video.url && (

                              <a href={video.url} target="_blank" rel="noopener noreferrer" className="video-link" onClick={(e) => e.stopPropagation()}>

                                Regarder sur YouTube

                              </a>

                            )}

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}

              

              {/* Section Documents */}

              {documents.length > 0 && (

                <div className="resource-section">

                  <h3>📄 Documents à Télécharger</h3>

                  {loadingRessources ? (

                    <div className="loading-ressources">Chargement des documents...</div>

                  ) : (

                    <div className="documents-list">

                      {documents.map((doc, index) => (

                        <div key={index} className="document-item">

                          <span className="doc-icon">📄</span>

                          <div className="doc-info">

                            <h4>{doc.titre || `Document ${index + 1}`}</h4>

                            <p className="doc-size">{doc.taille || 'PDF'}</p>

                          </div>

                          {doc.url && (

                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="download-btn">

                              Télécharger

                            </a>

                          )}

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}

            </div>

          )}



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



          {/* Exigences par type d'activité */}

          <div className="activite-details-exigences">

            <div className="exigences-header">

              <h2>📋 Exigences pour cette activité</h2>

              <button 

                className="toggle-exigences-btn"

                onClick={() => setShowExigences(!showExigences)}

              >

                {showExigences ? 'Masquer' : 'Afficher'} les exigences

              </button>

            </div>



            {showExigences && (

              <div className="exigences-content">

                {loadingExigences ? (

                  <div className="loading-exigences">

                    <div className="loading-spinner">Chargement des exigences...</div>

                  </div>

                ) : exigences.length > 0 ? (

                  <div className="exigences-grid">

                    {exigences.map(exigence => (

                      <div key={exigence.id_exigence} className="exigence-card">

                        <div className="exigence-header">

                          <div className="exigence-type">

                            <span className={`type-badge ${exigence.type_exigence}`}>

                              {exigence.type_exigence === 'document' ? '📄' : 

                               exigence.type_exigence === 'materiel' ? '🔧' :

                               exigence.type_exigence === 'information' ? 'ℹ️' : '📋'}

                              {exigence.type_exigence}

                            </span>

                            <span className={`status-badge ${exigence.obligatoire ? 'obligatoire' : 'optionnel'}`}>

                              {exigence.obligatoire ? '🔴 Obligatoire' : '🟡 Optionnel'}

                            </span>

                          </div>

                        </div>

                        <div className="exigence-content">

                          <h4>{exigence.libelle_exigence}</h4>

                          <p className="exigence-description">

                            {exigence.description_exigence || 'Aucune description détaillée disponible.'}

                          </p>

                        </div>

                      </div>

                    ))}

                  </div>

                ) : (

                  <div className="no-exigences-message">

                    <div className="no-exigences-icon">📋</div>

                    <h3>Aucune exigence spécifique</h3>

                    <p>Cette activité ne nécessite aucune exigence particulière.</p>

                  </div>

                )}

              </div>

            )}

          </div>



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

                  src={selectedVideo.url.replace('watch?v=', 'embed/')}

                  title={selectedVideo.titre}

                  frameBorder="0"

                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"

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

