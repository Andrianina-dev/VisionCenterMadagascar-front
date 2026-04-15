import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useState, useEffect } from "react";
import activiteService from "../../services/activite.service";
import { useNavigate } from "react-router-dom";

const createDefaultIcon = () => {
  return L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const createSelectedIcon = () => {
  return L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const MapController = ({ activityCoords, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (activityCoords && activityCoords.length === 2 && map) {
      map.setView(activityCoords, zoomLevel);
    }
  }, [activityCoords, zoomLevel, map]);

  return null;
};

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MadagascarMap = () => {
  const [activities, setActivities] = useState([]);
  const [mapActivities, setMapActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);

        const ouvertesResponse = await activiteService.getActivitesOuvertes();

        const allOpenActivities = ouvertesResponse.map((activite) => ({
          id: activite.id_activite,
          name: activite.titre_activite,
          region: activite.lieu_activite || "Madagascar",
          price: activite.capacite ? `0/${activite.capacite} places` : "Illimite",
          nom_image: activite.nom_image,
          rating: "4/5",
          reviews: "0",
          image: "ACTIVITE",
          description: activite.description || "Decouvrez cette activite.",
          date: activite.date_heure_activite,
          lieu: activite.lieu_activite,
          statut: activiteService.getActivityStatus(activite),
          places_restantes: activite.capacite ? activite.capacite : "Illimite",
          latitude_origine: activite.latitude_activite,
          longitude_origine: activite.longitude_activite,
          hasCoords: !!(activite.latitude_activite && activite.longitude_activite),
        }));

        const activitiesWithCoords = ouvertesResponse.filter(
          (activite) => activite.latitude_activite && activite.longitude_activite
        );

        const mapActivitiesData = activitiesWithCoords.map((activite) => ({
          id: activite.id_activite,
          name: activite.titre_activite,
          region: activite.lieu_activite || "Madagascar",
          price: activite.capacite ? `0/${activite.capacite} places` : "Illimite",
          rating: "4/5",
          reviews: "0",
          image: "ACTIVITE",
          description: activite.description || "Decouvrez cette activite.",
          date: activite.date_heure_activite,
          coords: [
            parseFloat(activite.latitude_activite),
            parseFloat(activite.longitude_activite),
          ],
          lieu: activite.lieu_activite,
          statut: activiteService.getActivityStatus(activite),
          places_restantes: activite.capacite ? activite.capacite : "Illimite",
          latitude_origine: activite.latitude_activite,
          longitude_origine: activite.longitude_activite,
        }));

        setActivities(allOpenActivities);
        setMapActivities(mapActivitiesData);
      } catch (err) {
        setError("Impossible de charger les activites ouvertes.");
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

  if (loading) {
    return (
      <div className="madagascar-map-wrapper">
        <div className="loading-container">
          <div className="loading-spinner">Chargement de la carte...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="madagascar-map-wrapper">
        <div className="error-container">
          <h2>Erreur</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="madagascar-map-wrapper">
      <div className="map-activities-list">
        <div className="list-header">
          <h2>Activites ouvertes</h2>
          <span className="results-count">
            {activities.length} activites ({mapActivities.length} avec coordonnees)
          </span>
        </div>

        <div className="activities-scroll">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="activity-card"
              onClick={() => handleActivityClick(activity.id)}
            >
              <div className="activity-image"><img src={`../../assets/images/activite/${activity.nom_image}`} alt="Formation M.E.DI.A" className="media-activity-img media-activity-img-fallback" />
                </div>

              <div className="activity-content">
                <div className="activity-region">{activity.region}</div>
                <h3>{activity.name}</h3>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta-date">
                    <div className={`activity-status ${activity.statut.class}`}>
                      {activity.statut.text}
                    </div>
                    
                   <div className="activity-price">{activity.price}</div>
                </div>
                
                      <div className="activity-date">
                        Date: {activiteService.formatDateShort(activity.date)}
                      </div>
              </div>
                

              {/* <div className="activity-footer">
                <div className="activity-rating">
                  <span>{activity.rating}</span>
                  <span className="reviews">({activity.reviews})</span>
                </div>
              </div> */}

              <button className="learn-more-btn">Voir details</button>

              {!activity.hasCoords && (
                <div className="no-coords-indicator">Coordonnees GPS non disponibles</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="map-wrapper">
        <MapContainer center={[-18.8792, 47.5079]} zoom={6} className="map-container">
          <MapController activityCoords={selectedActivity?.coords || null} zoomLevel={12} />
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapActivities.map((activity) => {
            const isSelected = selectedActivity?.id === activity.id;
            return (
              <Marker
                key={activity.id}
                position={activity.coords || [0, 0]}
                icon={isSelected ? createSelectedIcon() : createDefaultIcon()}
                eventHandlers={{
                  click: () => setSelectedActivity(activity),
                }}
              >
                <Popup>
                  <div className="marker-popup">
                    <h4>{activity.name}</h4>
                    <p>
                      <strong>Lieu:</strong> {activity.lieu}
                    </p>
                    <p>
                      <strong>Date:</strong> {activiteService.formatDate(activity.date)}
                    </p>
                    <p>
                      <strong>Participants:</strong> {activity.price}
                    </p>
                    <div className={`popup-status ${activity.statut.class}`}>
                      {activity.statut.text}
                    </div>
                    <button
                      className="popup-btn"
                      onClick={() => handleActivityClick(activity.id)}
                    >
                      Voir details
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
