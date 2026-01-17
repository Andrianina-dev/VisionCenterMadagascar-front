import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import MadagascarMap from "../../component/map/MadagascarMap";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMap, setShowMap] = useState(false);

  const destinations = [
    { id: 1, name: "Menabe", image: "🌴" },
    { id: 2, name: "Melaky", image: "🏝️" },
    { id: 3, name: "East", image: "🌅" },
    { id: 4, name: "Amoroni Mania", image: "🐵" }
  ];

  const packages = [
    { id: 1, name: "(Hypothème Mazitsaini)", price: "$348", rating: "⭐⭐⭐⭐⭐", reviews: "67", discount: "20%" },
    { id: 2, name: "(Hypothème Mazitsaini)", price: "$348", rating: "⭐⭐⭐⭐⭐", reviews: "67", discount: "30%" },
    { id: 3, name: "(Hypothème Mazitsaini)", price: "$348", rating: "⭐⭐⭐⭐⭐", reviews: "67", discount: "15%" },
    { id: 4, name: "(Hypothème Mazitsaini)", price: "$348", rating: "⭐⭐⭐⭐⭐", reviews: "67", discount: "25%" }
  ];

  const newPackages = [
    { id: 1, price: "$348", image: "🏖️" },
    { id: 2, price: "$348", image: "☀️" },
    { id: 3, price: "$348", image: "🌳" },
    { id: 4, price: "$348", image: "🧘" }
  ];

  const infoGuide = [
    { icon: "💰", title: "Refund Policy Information" },
    { icon: "✈️", title: "Travel Regulations" },
    { icon: "🎫", title: "International Flight Information" },
    { icon: "ℹ️", title: "Tour Assistance Information" },
    { icon: "📱", title: "Refund..." }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Destination Madagascar</h1>
          <p>Escape at your fingertips</p>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Where are you looking?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">Search</button>
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
          <h2>Find other interesting destinations</h2>
          <a href="#" className="see-all">More</a>
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

      {/* Packages Section */}
      <section className="packages-section">
        <div className="section-header">
          <h2>Package that end seems</h2>
          <a href="#" className="see-all">See All</a>
        </div>

        <div className="packages-grid">
          {packages.map(pkg => (
            <div key={pkg.id} className="package-card">
              <div className="package-discount">{pkg.discount}</div>
              <div className="package-image">🏨</div>
              <h3>{pkg.name}</h3>
              <p className="package-price">{pkg.price}</p>
              <div className="package-rating">
                <span>{pkg.rating}</span>
                <span>({pkg.reviews} reviews)</span>
              </div>
              <a href="#" className="learn-more">Learn more</a>
            </div>
          ))}
        </div>
      </section>

      {/* New Packages Section */}
      <section className="new-packages-section">
        <div className="section-header">
          <h2>New package just added</h2>
          <a href="#" className="see-all">See All</a>
        </div>

        <div className="new-packages-grid">
          {newPackages.map(pkg => (
            <div key={pkg.id} className="new-package-card">
              <div className="new-package-image">{pkg.image}</div>
              <p className="new-package-price">{pkg.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Information & Guide Section */}
      <section className="info-guide-section">
        <h2>Information & brief guide</h2>
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
