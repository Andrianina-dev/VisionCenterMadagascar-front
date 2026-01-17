
    import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import L from "leaflet";
import { useState } from "react";

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
  const [activities, setActivities] = useState([
    {
      id: 1,
      name: "Hypothème Mazitsaini",
      region: "Antananarivo",
      price: "$348",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "47",
      image: "🏖️",
      description: "Explore the beautiful coastlines and pristine beaches of Madagascar",
      coords: [-18.8792, 47.5079]
    },
    {
      id: 2,
      name: "Hypothème Mazitsaini",
      region: "Diego Suarez",
      price: "$348",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "67",
      image: "🏝️",
      description: "Adventure in the north with stunning natural landscapes",
      coords: [-13.6824, 48.4574]
    },
    {
      id: 3,
      name: "Hypothème Mazitsaini",
      region: "Toliara",
      price: "$348",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "52",
      image: "🌅",
      description: "Discover the spice island and unique wildlife",
      coords: [-23.3500, 43.6667]
    },
    {
      id: 4,
      name: "Hypothème Mazitsaini",
      region: "Morondava",
      price: "$348",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "73",
      image: "🌴",
      description: "Visit the famous baobab trees and traditional culture",
      coords: [-19.7344, 44.2842]
    },
    {
      id: 5,
      name: "Hypothème Mazitsaini",
      region: "Antsirabe",
      price: "$348",
      rating: "⭐⭐⭐⭐⭐",
      reviews: "45",
      image: "🏔️",
      description: "Mountain tours and local markets",
      coords: [-19.8966, 47.5369]
    }
  ]);

  return (
    <div className="madagascar-map-wrapper">
      <div className="map-activities-list">
        <div className="list-header">
          <h2>Activities & Places</h2>
          <span className="results-count">{activities.length} results</span>
        </div>

        <div className="activities-scroll">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card">
              <div className="activity-image">{activity.image}</div>
              
              <div className="activity-content">
                <div className="activity-region">{activity.region}</div>
                <h3>{activity.name}</h3>
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-footer">
                  <div className="activity-price">{activity.price}</div>
                  <div className="activity-rating">
                    <span>{activity.rating}</span>
                    <span className="reviews">({activity.reviews})</span>
                  </div>
                </div>

                <a href="#" className="learn-more-btn">Learn more</a>
              </div>
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
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Markers for all activities */}
          {activities.map((activity) => (
            <Marker key={activity.id} position={activity.coords}>
              <Popup>
                <div className="marker-popup">
                  <h4>{activity.name}</h4>
                  <p>{activity.region}</p>
                  <p className="popup-price">{activity.price}</p>
                </div>
              </Popup>
            </Marker>
          ))}
            </MapContainer>
          </div>
        </div>
      );
    };
    
    export default MadagascarMap;
