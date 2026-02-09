import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MadagascarMap from "../../component/map/MadagascarMap";

const MapSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="map-search-container">
      <div className="map-search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Search Destinations</h1>
      </div>

      <div className="search-results-top">
        <h3>Search Results</h3>
        <p>Select a destination from the list or click on the map to see details</p>
      </div>

      <div className="map-search-content">
        <div className="map-section">
          <MadagascarMap />
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
