import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useState, useEffect, useRef } from "react";
import activiteService from "../../services/activite.service";
import { useNavigate } from "react-router-dom";

// Fonctions pour créer des icônes personnalisées
const createDefaultIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const createSelectedIcon = () => {
  return L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Composant pour contrôler la carte
const MapController = ({ activityCoords, zoomLevel }) => {
  const map = useMap();
  
  useEffect(() => {
    if (activityCoords && activityCoords.length === 2 && map) {
      map.setView(activityCoords, zoomLevel);
    }
  }, [activityCoords, zoomLevel, map]);
  
  return null;
};

// Image améliorée pour Vision Center Madagascar
const improvedImageBase64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjNjY3ZWVhIi8+PC9zdmc+";

// Fix icône Leaflet (important)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MadagascarMap = () => {
  const [activities, setActivities] = useState([]);
  const [mapActivities, setMapActivities] = useState([]); // Activités pour la carte (avec coordonnées)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        
        // Charger UNIQUEMENT les activités ouvertes depuis l'API
        const ouvertesResponse = await activiteService.getActivitesOuvertes();
        
        console.log("Réponse API activités ouvertes:", ouvertesResponse);
        
        // Toutes les activités ouvertes pour la liste
        const allOpenActivities = ouvertesResponse.map(activite => ({
          id: activite.id_activite,
          name: activite.titre_activite,
          region: activite.lieu_activite || "Madagascar",
          price: activite.capacite ? `0/${activite.capacite} places` : "Illimité",
          rating: "⭐⭐⭐⭐",
          reviews: "0",
          image: "📍",
          description: activite.description || "Découvrez cette activité passionnante",
          date: activite.date_heure_activite,
          lieu: activite.lieu_activite,
          statut: activiteService.getActivityStatus(activite),
          places_restantes: activite.capacite ? activite.capacite : "Illimité",
          // Garder les coordonnées originales pour debug
          latitude_origine: activite.latitude_activite,
          longitude_origine: activite.longitude_activite,
          hasCoords: !!(activite.latitude_activite && activite.longitude_activite)
        }));
        
        // Filtrer les activités qui ont des coordonnées pour la carte
        const activitiesWithCoords = ouvertesResponse.filter(activite => {
          const hasCoords = activite.latitude_activite && activite.longitude_activite;
          console.log(`Activité: ${activite.titre_activite}`);
          console.log(`  - Statut: ${activite.statut}`);
          console.log(`  - Latitude: ${activite.latitude_activite}`);
          console.log(`  - Longitude: ${activite.longitude_activite}`);
          console.log(`  - A des coordonnées: ${hasCoords}`);
          return hasCoords;
        });
        
        console.log(`Activités ouvertes avec coordonnées: ${activitiesWithCoords.length}/${ouvertesResponse.length}`);
        
        // Transformer les données pour la carte
        const mapActivitiesData = activitiesWithCoords.map(activite => {
          // Utiliser UNIQUEMENT les coordonnées de la base de données
          const coords = [parseFloat(activite.latitude_activite), parseFloat(activite.longitude_activite)];
          
          console.log(`Activité ouverte ${activite.titre_activite} - Coordonnées BDD:`, coords);
          
          return {
            id: activite.id_activite,
            name: activite.titre_activite,
            region: activite.lieu_activite || "Madagascar",
            price: activite.capacite ? `0/${activite.capacite} places` : "Illimité",
            rating: "⭐⭐⭐⭐",
            reviews: "0",
            image: "📍",
            description: activite.description || "Découvrez cette activité passionnante",
            date: activite.date_heure_activite,
            coords: coords,
            lieu: activite.lieu_activite,
            statut: activiteService.getActivityStatus(activite),
            places_restantes: activite.capacite ? activite.capacite : "Illimité",
            // Garder les coordonnées originales pour debug
            latitude_origine: activite.latitude_activite,
            longitude_origine: activite.longitude_activite
          };
        });
        
        console.log("Toutes les activités ouvertes pour la liste:", allOpenActivities);
        console.log("Activités transformées pour la carte:", mapActivitiesData);
        
        setActivities(allOpenActivities);
        setMapActivities(mapActivitiesData);
      } catch (err) {
        setError("Impossible de charger les activités ouvertes");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleActivityClick = (activityId) => {
    navigate(`/activite/${activityId}`);
  };

  const handleSeeOnMap = (activity) => {
    setSelectedActivity(activity);
  };

  if (loading) {
    return (
      <div className="madagascar-map-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">Chargement des activités...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="madagascar-map-wrapper">
        <div className="error-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="madagascar-map-wrapper">
      <div className="map-activities-list">
        <div className="list-header">
          <h2>Activités Ouvertes</h2>
          <span className="results-count">{activities.length} activités ({mapActivities.length} avec coordonnées)</span>
        </div>

        {/* Affichage des coordonnées de l'activité sélectionnée */}
        {selectedActivity && (
          <div className="selected-coords-display">
            <div className="coords-header">
              <h3>📍 Activité sélectionnée</h3>
              <button 
                className="clear-selection-btn"
                onClick={() => setSelectedActivity(null)}
              >
                ✕
              </button>
            </div>
            <div className="coords-content">
              <div className="coords-item">
                <span className="coords-label">Nom:</span>
                <span className="coords-value">{selectedActivity.name}</span>
              </div>
              <div className="coords-item">
                <span className="coords-label">Lieu:</span>
                <span className="coords-value">{selectedActivity.lieu}</span>
              </div>
              <div className="coords-item">
                <span className="coords-label">Latitude:</span>
                <span className="coords-value">{selectedActivity.coords && selectedActivity.coords[0] ? selectedActivity.coords[0].toFixed(6) : 'N/A'}</span>
              </div>
              <div className="coords-item">
                <span className="coords-label">Longitude:</span>
                <span className="coords-value">{selectedActivity.coords && selectedActivity.coords[1] ? selectedActivity.coords[1].toFixed(6) : 'N/A'}</span>
              </div>
              {/* Debug: afficher les coordonnées originales si elles existent */}
              {selectedActivity.latitude_origine && selectedActivity.longitude_origine && (
                <div className="coords-debug">
                  <div className="coords-item">
                    <span className="coords-label">Lat. BDD:</span>
                    <span className="coords-value-debug">{selectedActivity.latitude_origine}</span>
                  </div>
                  <div className="coords-item">
                    <span className="coords-label">Long. BDD:</span>
                    <span className="coords-value-debug">{selectedActivity.longitude_origine}</span>
                  </div>
                </div>
              )}
              <div className="coords-item">
                <span className="coords-label">Statut:</span>
                <span className={`coords-status ${selectedActivity.statut.class}`}>
                  {selectedActivity.statut.icon} {selectedActivity.statut.text}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="activities-scroll">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card" onClick={() => handleActivityClick(activity.id)}>
              <div className="activity-image">
                {typeof activity.image === 'string' ? activity.image : activity.image}
              </div>
              
              <div className="activity-content">
                <div className="activity-region">{activity.region}</div>
                <h3>{activity.name}</h3>
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-meta">
                  <div className="activity-date">
                    📅 {activiteService.formatDateShort(activity.date)}
                  </div>
                </div>
                <div className={`activity-status ${activity.statut.class}`}>
                  {activity.statut.icon} {activity.statut.text}
                </div>
              </div>

              <div className="activity-footer">
                <div className="activity-price">{activity.price}</div>
                <div className="activity-rating">
                  <span>{activity.rating}</span>
                  <span className="reviews">({activity.reviews})</span>
                </div>
              </div>

              <button className="learn-more-btn">
                Voir détails →
              </button>

              {activity.hasCoords ? (
                <button 
                  className="see-map-btn-list"
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    handleSeeOnMap(activity);
                  }}
                >
                  🗺️ Voir sur la carte
                </button>
              ) : (
                <div className="no-coords-indicator">
                  📍 Pas de coordonnées GPS
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer
          center={[-18.8792, 47.5079]} // Antananarivo
          zoom={6}
          className="map-container"
        >
          <MapController 
            activityCoords={selectedActivity?.coords || null} 
            zoomLevel={12} 
          />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers pour toutes les activités */}
          {mapActivities.map((activity) => {
            const isSelected = selectedActivity?.id === activity.id;
            return (
              <Marker 
                key={activity.id} 
                position={activity.coords || [0, 0]}
                icon={isSelected ? createSelectedIcon() : createDefaultIcon()}
              >
                <Popup>
                  <div className="marker-popup">
                    <h4>{activity.name}</h4>
                    <p><strong>Lieu:</strong> {activity.lieu}</p>
                    <p><strong>Date:</strong> {activiteService.formatDate(activity.date)}</p>
                    <p><strong>Participants:</strong> {activity.price}</p>
                    <div className={`popup-status ${activity.statut.class}`}>
                      {activity.statut.icon} {activity.statut.text}
                    </div>
                    <button 
                      className="popup-btn"
                      onClick={() => handleActivityClick(activity.id)}
                    >
                      Voir détails
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MadagascarMap;
