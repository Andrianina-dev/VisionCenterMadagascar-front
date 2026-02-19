import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import MadagascarMap from "../../component/map/MadagascarMap";

import activiteService from "../../services/activite.service";

import AuthService from "../../services/auth.service";



const Home = () => {

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const [showMap, setShowMap] = useState(false);

  const [activitesOuvertes, setActivitesOuvertes] = useState([]);

  const [activitesPopulaires, setActivitesPopulaires] = useState([]);

  const [activitesPopulairesFiltrees, setActivitesPopulairesFiltrees] = useState([]);

  const [packagesData, setPackagesData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [typesActivites, setTypesActivites] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [submittingId, setSubmittingId] = useState(null);

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');

  const [exigencesByType, setExigencesByType] = useState({});

  const [showExigences, setShowExigences] = useState(false);

  // Cache pour éviter les appels répétés
  const [registrationCache, setRegistrationCache] = useState({});
  const [participantsCache, setParticipantsCache] = useState({});



  // Récupérer les informations de l'utilisateur connecté

  useEffect(() => {

    const member = AuthService.getCurrentMember();

    if (member) {

      setCurrentUser(member);

    }

  }, []);



  // Créer le nom d'affichage

  const displayName = currentUser ? `${currentUser.prenom} ${currentUser.nom.charAt(0)}.` : 'Membre';

  

  // Créer les variables pour l'avatar et l'email

  const userAvatar = currentUser ? currentUser.avatar : null;

  const userEmail = currentUser ? currentUser.email : null;



  // Image améliorée pour Centre de Vision

  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";



  // Vérifier si l'utilisateur est déjà inscrit à une activité (avec cache)
  const checkIfAlreadyRegistered = async (activiteId) => {
    // Vérifier le cache d'abord
    if (registrationCache[activiteId] !== undefined) {
      return registrationCache[activiteId];
    }

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    const member = localStorage.getItem('member') || sessionStorage.getItem('member');
    
    if (!auth || auth !== 'true' || !member) {
      return false;
    }
    
    try {
      const memberData = JSON.parse(member);
      const utilisateurId = memberData.id;
      
      if (!utilisateurId) {
        return false;
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/public/inscriptions/verifier/${activiteId}/${utilisateurId}`);
      
      if (response.ok) {
        const data = await response.json();
        // Mettre en cache le résultat
        setRegistrationCache(prev => ({ ...prev, [activiteId]: data.isRegistered }));
        return data.isRegistered;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur vérification inscription:', error);
      return false;
    }
  };



  // Compter le nombre de participants pour une activité (avec cache)
  const countParticipants = async (activiteId) => {
    // Vérifier le cache d'abord
    if (participantsCache[activiteId] !== undefined) {
      return participantsCache[activiteId];
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
      
      // Utiliser le nouvel endpoint qui compte directement dans la table inscription_activite
      const response = await fetch(`${apiUrl}/public/inscription_activite/${activiteId}/count`);

      if (response.ok) {
        const data = await response.json();
        const count = data.success ? data.data : 0;
        
        // Mettre en cache le résultat
        setParticipantsCache(prev => ({ ...prev, [activiteId]: count }));
        
        console.log(`🎯 Activité ${activiteId} - ${count} participant(s) trouvé(s) dans inscription_activite`);
        return count;
      }
      
      // Si l'endpoint n'existe pas, retourner 0
      console.warn('⚠️ Endpoint count non disponible - 0 participant pour', activiteId);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
      
    } catch (error) {
      console.error('❌ Erreur comptage participants dans inscription_activite pour', activiteId, ':', error);
      setParticipantsCache(prev => ({ ...prev, [activiteId]: 0 }));
      return 0;
    }
  };



  // Charger les activités depuis l'API (optimisé)
  const loadActivites = async () => {
    try {
      setLoading(true);
      
      // Charger tout en parallèle pour optimiser le temps de chargement
      const [activitesOuvertes, activitesPopulaires, typesResponse] = await Promise.all([
        activiteService.getActivitesOuvertes(),
        activiteService.getActivitesPopulaires(),
        fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/public/types-activites`)
      ]);
      
      // Traiter les types d'activités
      if (typesResponse.ok) {
        const typesData = await typesResponse.json();
        setTypesActivites(typesData);
        console.log('Types d\'activités chargés:', typesData);
      } else {
        console.error('Erreur chargement types:', typesResponse.status, typesResponse.statusText);
      }
      
      // Limiter le nombre d'activités à traiter pour accélérer le chargement initial
      const limitedOuvertes = activitesOuvertes.slice(0, 8); // Limiter à 8 activités
      const limitedPopulaires = activitesPopulaires.slice(0, 6); // Limiter à 6 activités
      
      // Traiter les activités en parallèle avec cache
      const activitesOuvertesWithStatus = await Promise.all(
        limitedOuvertes.map(async (activite) => {
          const [isRegistered, participantsCount] = await Promise.all([
            checkIfAlreadyRegistered(activite.id_activite),
            countParticipants(activite.id_activite)
          ]);
          
          return {
            ...activite,
            isRegistered,
            nombre_participants: participantsCount
          };
        })
      );
      
      const activitesPopulairesWithStatus = await Promise.all(
        limitedPopulaires.map(async (activite) => {
          const [isRegistered, participantsCount] = await Promise.all([
            checkIfAlreadyRegistered(activite.id_activite),
            countParticipants(activite.id_activite)
          ]);
          
          return {
            ...activite,
            isRegistered,
            nombre_participants: participantsCount
          };
        })
      );
      
      setActivitesOuvertes(activitesOuvertesWithStatus);
      setActivitesPopulaires(activitesPopulairesWithStatus);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {

    loadActivites();

  }, []);



  // Initialiser les activités filtrées quand les activités populaires changent

  useEffect(() => {

    setActivitesPopulairesFiltrees(activitesPopulaires);

  }, [activitesPopulaires]);



  const destinations = [

    { id: 1, name: "Menabe", image: "🌴" },

    { id: 2, name: "Melaky", image: "🏝️" },

    { id: 3, name: "East", image: "🌅" },

    { id: 4, name: "Amoroni Mania", image: "🐵" }

  ];



  // Utiliser les vraies activités populaires filtrées au lieu des packages simulés

  const packages = activitesPopulairesFiltrees.slice(0, 4).map((activite, index) => ({

    id: activite.id_activite,

    name: activite.titre_activite,

    price: activite.capacite ? `${activite.nombre_participants || 0}/${activite.capacite} places` : "Illimité",

    rating: "⭐⭐⭐⭐⭐",

    reviews: activite.nombre_participants || 0,

    discount: "Disponible",

    image: activite.image_url || improvedImageBase64,

    date: activite.date_heure_activite,

    lieu: activite.lieu_activite,

    isBase64: true, // Toujours true car on utilise base64

    isRegistered: activite.isRegistered || false

  }));



  // Utiliser les vraies activités ouvertes pour les nouveaux packages

  const newPackages = activitesOuvertes.slice(0, 4).map((activite, index) => ({

    id: activite.id_activite,

    price: activite.capacite ? `${activite.nombre_participants || 0}/${activite.capacite}` : "Illimité",

    image: activite.image_url || improvedImageBase64,

    titre: activite.titre_activite,

    date: activite.date_heure_activite,

    isBase64: true, // Toujours true car on utilise base64

    isRegistered: activite.isRegistered || false,

    nombre_participants: activite.nombre_participants || 0

  }));



  const infoGuide = [

    { icon: "💰", title: "Inscription Gratuite" },

    { icon: "✈️", "title": "Activités Variées" },

    { icon: "🎫", title: "Événements Réguliers" },

    { icon: "ℹ️", title: "Assistance Permanente" },

    { icon: "📱", title: "Contact Facile" }

  ];



  // Gérer le clic sur une activité

  const handleActiviteClick = (activiteId) => {

    navigate(`/activite/${activiteId}`);

  };



  // Gérer l'inscription directe

  const handleParticiper = async (activiteId) => {

    // Vérifier si l'utilisateur est connecté

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');

    const member = localStorage.getItem('member') || sessionStorage.getItem('member');

    const userIsLoggedIn = auth === 'true' && member;

    

    if (!userIsLoggedIn) {

      // Si non connecté, rediriger vers la page de login

      navigate('/login');

      return;

    }



    // Si connecté, inscrire directement

    setSubmittingId(activiteId);

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const member = localStorage.getItem('member') || sessionStorage.getItem('member');

      const memberData = member ? JSON.parse(member) : null;

      

      console.log('État de connexion:', {

        auth,

        member: member,

        'member parsed': member ? JSON.parse(member) : null

      });

      

      // Vérifier que l'ID utilisateur existe (structure correcte)

      if (!memberData || !memberData.id) {

        console.error('Données utilisateur invalides:', memberData);

        alert('Erreur: données utilisateur invalides. Veuillez vous reconnecter.');

        setSubmittingId(null);

        return;

      }

      

      // Récupérer l'ID utilisateur avec fallback

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

        console.error('ID utilisateur non trouvé dans:', memberData);

        alert('Erreur: ID utilisateur non trouvé. Veuillez vous reconnecter.');

        setSubmittingId(null);

        return;

      }

      

      console.log('Tentative d\'inscription avec:', {

        activiteId,

        utilisateurId,

        memberData,

        'utilisateur final': utilisateurId

      });

      

      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}`, {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

          'Accept': 'application/json'

        },

        body: JSON.stringify({

          id_utilisateur: utilisateurId

        })

      });



      const data = await response.json();



      if (!response.ok) {

        console.error('Erreur API:', data);

        throw new Error(data.message || 'Erreur lors de l\'inscription');

      }



      // Afficher un message de succès

      alert('Inscription réussie ! Vous êtes maintenant inscrit à cette activité.');

      

      // Mettre à jour le nombre de participants localement

      setActivitesOuvertes(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: true, nombre_participants: (activite.nombre_participants || 0) + 1 }

            : activite

        )

      );

      

      setActivitesPopulaires(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: true, nombre_participants: (activite.nombre_participants || 0) + 1 }

            : activite

        )

      );

      

      // Rafraîchir les activités pour mettre à jour le statut

      loadActivites();

      

    } catch (err) {

      console.error('Erreur inscription:', err);

      alert('Erreur lors de l\'inscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  // Gérer la désinscription

  const handleDesinscrire = async (activiteId) => {

    // Vérifier si l'utilisateur est connecté

    const auth = localStorage.getItem('auth') || sessionStorage.getItem('auth');

    const member = localStorage.getItem('member') || sessionStorage.getItem('member');

    const userIsLoggedIn = auth === 'true' && member;

    

    if (!userIsLoggedIn) {

      navigate('/login');

      return;

    }



    setSubmittingId(activiteId);

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const member = localStorage.getItem('member') || sessionStorage.getItem('member');

      const memberData = member ? JSON.parse(member) : null;

      

      // Récupérer l'ID utilisateur

      let utilisateurId = memberData.id;

      if (!utilisateurId && memberData) {

        if (memberData.member?.id) {

          utilisateurId = memberData.member.id;

        } else if (memberData.id_utilisateur) {

          utilisateurId = memberData.id_utilisateur;

        } else if (memberData.email) {

          const emailMatch = memberData.email.match(/USR-(\d+)/);

          if (emailMatch) {

            utilisateurId = 'USR-' + emailMatch[1];

          }

        }

      }

      

      const response = await fetch(`${apiUrl}/public/inscriptions/${activiteId}/desinscrire`, {

        method: 'DELETE',

        headers: {

          'Content-Type': 'application/json',

          'Accept': 'application/json'

        },

        body: JSON.stringify({

          participant_id: utilisateurId

        })

      });



      const data = await response.json();



      if (!response.ok) {

        throw new Error(data.message || 'Erreur lors de la désinscription');

      }



      alert('Désinscription réussie ! Vous n\'êtes plus inscrit à cette activité.');

      

      // Mettre à jour le nombre de participants localement

      setActivitesOuvertes(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: false, nombre_participants: Math.max((activite.nombre_participants || 0) - 1, 0) }

            : activite

        )

      );

      

      setActivitesPopulaires(prev => 

        prev.map(activite => 

          activite.id_activite === activiteId 

            ? { ...activite, isRegistered: false, nombre_participants: Math.max((activite.nombre_participants || 0) - 1, 0) }

            : activite

        )

      );

      

      // Rafraîchir les activités pour mettre à jour le statut

      loadActivites();

      

    } catch (err) {

      console.error('Erreur désinscription:', err);

      alert('Erreur lors de la désinscription: ' + err.message);

    } finally {

      setSubmittingId(null);

    }

  };



  const handleSeeOnMap = (activity) => {

    // setSelectedActivity(activity);

  };



  const handleProfileClick = () => {

    navigate("/profile");

  };



  // Gérer le clic sur "Voir tout"

  const handleSeeAllActivites = () => {

    navigate('/activites');

  };



  // Gérer le changement de filtre d'activité

  const handleActivityFilterChange = (e) => {

    const filterValue = e.target.value;

    setSelectedTypeFilter(filterValue);

    console.log('Filtre sélectionné:', filterValue);

    

    // Filtrer les activités populaires selon le type sélectionné

    if (filterValue === 'all') {

      setActivitesPopulairesFiltrees(activitesPopulaires);

    } else {

      const filtrees = activitesPopulaires.filter(activite => 

        activite.id_type === filterValue

      );

      setActivitesPopulairesFiltrees(filtrees);

    }

  };



  // Charger les exigences pour un type d'activité spécifique

  const loadExigencesForType = async (idType) => {

    try {

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/public/exigences/type/${idType}`);

      

      if (response.ok) {

        const exigences = await response.json();

        setExigencesByType(prev => ({

          ...prev,

          [idType]: exigences

        }));

        console.log(`Exigences pour type ${idType}:`, exigences);

      } else {

        console.error('Erreur chargement exigences:', response.status);

      }

    } catch (error) {

      console.error('Erreur lors du chargement des exigences:', error);

    }

  };



  // Gérer le clic sur un type d'activité pour voir les exigences

  const handleTypeClick = (typeId) => {

    if (typeId === 'all') return;

    

    // Charger les exigences si pas encore chargées

    if (!exigencesByType[typeId]) {

      loadExigencesForType(typeId);

    }

    

    // Basculer l'affichage des exigences

    setShowExigences(prev => !prev);

  };



  if (loading) {

    return (

      <div className="home-container">

        <div className="loading-container">

          <div className="loading-spinner">Chargement des activités...</div>

        </div>

      </div>

    );

  }



  if (error) {

    return (

      <div className="home-container">

        <div className="error-container">

          <div className="error-message">{error}</div>

          <button onClick={() => window.location.reload()} className="retry-btn">

            Réessayer

          </button>

        </div>

      </div>

    );

  }



  return (
    <div className="home-container">
      {/* Header Moderne */}
      <header className="home-header">
        <div className="header-container">
          {/* Logo */}
          <div className="header-logo">
            <span className="logo-icon">👁️</span>
            <span className="logo-text">Vision Center</span>
          </div>
          
          {/* Navigation Centre */}
          <nav className="header-nav">
            <button className="nav-link" onClick={() => navigate("/dashboard")}>Accueil</button>
            <button className="nav-link" onClick={() => navigate("/map")}>Carte</button>
            <button className="nav-link" onClick={() => navigate("/activites")}>Activités</button>
            <button className="nav-link" onClick={() => navigate("/contact")}>Contact</button>
          </nav>
          
          {/* Right Section */}
          <div className="header-right">
            {/* Search */}
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">
                <span>🔍</span>
              </button>
            </div>
            
            {/* Notifications */}
            <button className="notification-btn">
              <span className="notification-icon">🔔</span>
              <span className="notification-badge">3</span>
            </button>
            
            {/* Profile */}
            <div className="profile-menu">
              <div className="profile-avatar">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format" alt="Profile" />
                <div className="profile-status-dot"></div>
              </div>
              <div className="profile-info">
                <span className="profile-name">{displayName}</span>
                <span className="profile-role">Membre</span>
              </div>
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format" alt="Profile" />
                  </div>
                  <div className="dropdown-info">
                    <div className="dropdown-name">{displayName}</div>
                    <div className="dropdown-email">membre@visioncenter.mg</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button onClick={handleProfileClick} className="dropdown-item">
                  <span className="dropdown-icon">👤</span>
                  Mon Profil
                </button>
                <button onClick={() => navigate("/settings")} className="dropdown-item">
                  <span className="dropdown-icon">⚙️</span>
                  Paramètres
                </button>
                <button onClick={() => navigate("/notifications")} className="dropdown-item">
                  <span className="dropdown-icon">🔔</span>
                  Notifications
                  <span className="dropdown-badge">3</span>
                </button>
                <div className="dropdown-divider"></div>
                <button onClick={() => navigate('/login')} className="dropdown-item logout-item">
                  <span className="dropdown-icon">🚪</span>
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Votre Santé Visuelle, Notre Priorité</h1>
          <p>Découvrez nos services et activités pour une meilleure vision</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Rechercher une activité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Rechercher</button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="section-header">
          <h2>Nos Services</h2>
          <a href="#" className="see-all">Voir tout</a>
        </div>
        
        <div className="services-grid">
          {destinations.map(dest => (
            <div key={dest.id} className="service-card" onClick={() => handleActiviteClick(dest.id)}>
              <div className="service-image">
                {dest.image ? (
                  dest.isBase64 ? (
                    <img src={dest.image} alt={dest.name} className="service-img" />
                  ) : (
                    <img src={activiteService.getImageUrl(dest.image)} alt={dest.name} className="service-img" />
                  )
                ) : (
                  <div className="service-fallback">🏨</div>
                )}
              </div>
              <div className="service-content">
                <h3>{dest.name}</h3>
                <p className="service-price">{dest.price || 'Gratuit'}</p>
                <p className="service-location">📍 {dest.lieu || 'En ligne'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Packages Section - Activités Populaires */}

      <section className="packages-section">

        <div className="section-header">

          <h2>Activités Populaires</h2>

          <div className="header-actions">

            <select 

              className="activity-filter" 

              value={selectedTypeFilter}

              onChange={handleActivityFilterChange}

            >

              <option value="all">Tous les types</option>

              {typesActivites.map(type => (

                <option key={type.id} value={type.id}>

                  {type.libelle_type}

                </option>

              ))}

            </select>

            {selectedTypeFilter !== 'all' && (

              <button 

                className="exigences-btn"

                onClick={() => handleTypeClick(selectedTypeFilter)}

              >

                Voir les exigences

              </button>

            )}

            <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); handleSeeAllActivites(); }}>Voir tout</a>

          </div>

        </div>



        <div className="packages-grid">

          {packages.length > 0 ? (

            packages.map(pkg => (

              <div key={pkg.id} className="activity-card" onClick={() => handleActiviteClick(pkg.id)}>
                <div className="activity-image">
                  {pkg.image ? (
                    pkg.isBase64 ? (
                      <img src={pkg.image} alt={pkg.name} className="activity-img" />
                    ) : (
                      <img src={activiteService.getImageUrl(pkg.image)} alt={pkg.name} className="activity-img" />
                    )
                  ) : (
                    <div className="activity-fallback">🏨</div>
                  )}
                </div>
                <div className="activity-content">
                  <h3>{pkg.name}</h3>
                  <p className="activity-price">{pkg.price}</p>
                  <p className="activity-location">📍 {pkg.lieu}</p>
                  <button className="activity-btn">Voir détails</button>
                </div>
              </div>

            ))

          ) : (

            <div className="no-activities">

              <p>Aucune activité populaire disponible pour le moment.</p>

            </div>

          )}

        </div>

      </section>



      {/* Section Exigences par Type d'Activité */}

      {showExigences && selectedTypeFilter !== 'all' && (

        <section className="exigences-section">

          <div className="exigences-header">

            <h3>Exigences pour {typesActivites.find(t => t.id === selectedTypeFilter)?.libelle_type}</h3>

            <button className="close-btn" onClick={() => setShowExigences(false)}>✕</button>

          </div>

          

          {exigencesByType[selectedTypeFilter] ? (

            <div className="exigences-list">

              {exigencesByType[selectedTypeFilter].length > 0 ? (

                exigencesByType[selectedTypeFilter].map(exigence => (

                  <div key={exigence.id_exigence} className="exigence-item">

                    <div className="exigence-type">

                      <span className={`type-badge ${exigence.type_exigence}`}>

                        {exigence.type_exigence}

                      </span>

                      <span className={`status-badge ${exigence.obligatoire ? 'obligatoire' : 'optionnel'}`}>

                        {exigence.obligatoire ? 'Obligatoire' : 'Optionnel'}

                      </span>

                    </div>

                    <div className="exigence-content">

                      <h4>{exigence.libelle_exigence}</h4>

                    </div>

                  </div>

                ))

              ) : (

                <p className="no-exigences">Aucune exigence spécifique pour ce type d'activité.</p>

              )}

            </div>

          ) : (

            <div className="loading-exigences">

              <div className="loading-spinner">Chargement des exigences...</div>

            </div>

          )}

        </section>

      )}



      {/* New Packages Section */}

      <section className="new-packages-section">

        <div className="section-header">

          <h2>Nouveaux services ajoutés</h2>

          <a href="#" className="see-all">Voir tout</a>

        </div>



        <div className="new-packages-grid">

          {newPackages.map(pkg => (

            <div key={pkg.id} className="new-package-card">

              <div className="new-package-image">

                {pkg.image ? (

                  pkg.isBase64 ? (

                    <img src={pkg.image} alt={pkg.titre} className="activity-image-small" />

                  ) : (

                    <img src={activiteService.getImageUrl(pkg.image)} alt={pkg.titre} className="activity-image-small" />

                  )

                ) : (

                  pkg.image || "🎯"

                )}

              </div>

              <p className="new-package-price">{pkg.price}</p>

              <p className="new-package-title">{pkg.titre}</p>

              <p className="new-package-date">

                📅 {activiteService.formatDateShort(pkg.date)}

              </p>

              <p className="new-package-participants">

                👥 {pkg.nombre_participants} participant{pkg.nombre_participants > 1 ? 's' : ''}

              </p>

              <div className="new-package-actions">

                <button 

                  className={`participer-btn-small ${pkg.isRegistered ? 'registered' : ''}`}

                  onClick={() => {

                    if (pkg.isRegistered) {

                      handleDesinscrire(pkg.id);

                    } else {

                      handleParticiper(pkg.id);

                    }

                  }}

                  disabled={submittingId === pkg.id}

                >

                  {submittingId === pkg.id ? 'Inscription...' : (pkg.isRegistered ? 'Vous êtes participant' : 'Participez')}

                </button>

                <button 

                  className="see-map-btn-small" 

                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}

                >

                  🗺️ Voir sur la carte

                </button>

              </div>

            </div>

          ))}

        </div>

      </section>



      {/* Information & Guide Section */}

      <section className="info-guide-section">

        <h2>Informations & guide</h2>

        <div className="info-grid">

          {infoGuide.map((item, idx) => (

            <div key={idx} className="info-card">

              <div className="info-icon">{item.icon}</div>

              <p>{item.title}</p>

            </div>

          ))}

        </div>

      </section>



      {/* Map Section with Search Results */}

      {/* Moved to MapSearch page */}

    </div>

  );

};



export default Home;

