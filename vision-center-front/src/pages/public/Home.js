import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import MadagascarMap from "../../component/map/MadagascarMap";
import activiteService from "../../services/activite.service";
import AuthService from "../../services/auth.service";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [activitesOuvertes, setActivitesOuvertes] = useState([]);
  const [activitesPopulaires, setActivitesPopulaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const member = AuthService.getCurrentMember();
    if (member) {
      setCurrentUser(member);
    }
  }, []);

  // Créer le nom d'affichage
  const getDisplayName = () => {
    if (currentUser) {
      return `${currentUser.prenom} ${currentUser.nom.charAt(0)}.`;
    }
    return "Visiteur";
  };

  // Image améliorée pour Vision Center Madagascar
  const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";

  // Charger les activités depuis l'API
  useEffect(() => {
    const loadActivites = async () => {
      try {
        setLoading(true);
        
        // Charger les activités ouvertes
        const ouvertesResponse = await activiteService.getActivitesOuvertes();
        setActivitesOuvertes(ouvertesResponse);

        // Charger les activités populaires
        const populairesResponse = await activiteService.getActivitesPopulaires();
        setActivitesPopulaires(populairesResponse);

        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des activités:', err);
        setError('Impossible de charger les activités. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadActivites();
  }, []);

  const destinations = [
    { id: 1, name: "Menabe", image: "🌴" },
    { id: 2, name: "Melaky", image: "🏝️" },
    { id: 3, name: "East", image: "🌅" },
    { id: 4, name: "Amoroni Mania", image: "🐵" }
  ];

  // Utiliser les vraies activités populaires au lieu des packages simulés
  const packages = activitesPopulaires.slice(0, 4).map((activite, index) => ({
    id: activite.id_activite,
    name: activite.titre_activite,
    price: activite.capacite ? `0/${activite.capacite} places` : "Illimité",
    rating: "⭐⭐⭐⭐⭐",
    reviews: "0",
    discount: "Disponible",
    image: activite.image_url || improvedImageBase64,
    date: activite.date_heure_activite,
    lieu: activite.lieu_activite,
    isBase64: true // Toujours true car on utilise base64
  }));

  // Utiliser les vraies activités ouvertes pour les nouveaux packages
  const newPackages = activitesOuvertes.slice(0, 4).map((activite, index) => ({
    id: activite.id_activite,
    price: activite.capacite ? `0/${activite.capacite}` : "Illimité",
    image: activite.image_url || improvedImageBase64,
    titre: activite.titre_activite,
    date: activite.date_heure_activite,
    isBase64: true // Toujours true car on utilise base64
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
    navigate(`/activite-details/${activiteId}`);
  };

  // Gérer l'inscription directe
  const handleParticiper = (activiteId) => {
    navigate(`/inscription/${activiteId}`);
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
      {/* Header Simple */}
      <header className="simple-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">
              <h2>Vision Center Madagascar</h2>
            </div>
            <nav className="header-nav">
              <button className="nav-btn" onClick={() => navigate("/dashboard")}>Accueil</button>
              <button className="nav-btn" onClick={() => navigate("/map")}>Carte</button>
              <button className="nav-btn" onClick={() => navigate("/activites")}>Activités</button>
              <button className="nav-btn" onClick={() => navigate("/contact")}>Contact</button>
            </nav>
          </div>
          <div className="header-profile">
            <div className="profile-info">
              <span className="profile-name">{getDisplayName()}</span>
              <span className="profile-status">En ligne</span>
            </div>
            <div className="profile-avatar">
              <div className="avatar-wrapper" onClick={handleProfileClick}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format" alt="Profile" className="profile-img" />
                <div className="status-indicator"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Vision Center Madagascar</h1>
          <p>Votre santé visuelle, notre priorité</p>
          
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

      {/* Quick Links */}
      <section className="quick-links">
        <button className="quick-btn" onClick={() => navigate("/map")} title="View Map">🔍</button>
        <button className="quick-btn">📍</button>
        <button className="quick-btn">❤️</button>
        <button className="quick-btn">👤</button>
        <button className="quick-btn">⚙️</button>
      </section>

      {/* Destinations Section */}
      <section className="destinations-section">
        <div className="section-header">
          <h2>Découvrez nos services</h2>
          <a href="#" className="see-all">Plus</a>
        </div>
        
        <div className="destinations-grid">
          {destinations.map(dest => (
            <div key={dest.id} className="destination-card">
              <div className="destination-image">{dest.image}</div>
              <h3>{dest.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Packages Section - Activités Populaires */}
      <section className="packages-section">
        <div className="section-header">
          <h2>Activités Populaires</h2>
          <a href="#" className="see-all" onClick={(e) => { e.preventDefault(); handleSeeAllActivites(); }}>Voir tout</a>
        </div>

        <div className="packages-grid">
          {packages.length > 0 ? (
            packages.map(pkg => (
              <div key={pkg.id} className="package-card" onClick={() => handleActiviteClick(pkg.id)}>
                <div className={`package-discount ${pkg.discount === 'Complet' ? 'complete' : 'available'}`}>
                  {pkg.discount}
                </div>
                <div className="package-image">
                  {pkg.image ? (
                    pkg.isBase64 ? (
                      <img src={pkg.image} alt={pkg.name} className="activity-image" />
                    ) : (
                      <img src={activiteService.getImageUrl(pkg.image)} alt={pkg.name} className="activity-image" />
                    )
                  ) : (
                    "🏨"
                  )}
                </div>
                <h3>{pkg.name}</h3>
                <p className="package-price">{pkg.price}</p>
                <p className="package-location">📍 {pkg.lieu}</p>
                <div className="package-rating">
                  <span>{pkg.rating}</span>
                  <span>({pkg.reviews} participants)</span>
                </div>
                <div className="package-actions">
                  <button 
                    className="participer-btn" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleParticiper(pkg.id); }}
                  >
                    Participez
                  </button>
                  <a href="#" className="learn-more" onClick={(e) => { e.preventDefault(); handleActiviteClick(pkg.id); }}>
                    Voir détails
                  </a>
                  <button 
                    className="see-map-btn" 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/map'); }}
                  >
                    🗺️ Voir sur la carte
                  </button>
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
              <div className="new-package-actions">
                <button 
                  className="participer-btn-small" 
                  onClick={() => handleParticiper(pkg.id)}
                >
                  Participez
                </button>
                <button 
                  className="learn-more-btn" 
                  onClick={() => handleActiviteClick(pkg.id)}
                >
                  Voir détails
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
