import React from "react";
import { useNavigate } from "react-router-dom";
import MadagascarMap from "../../component/map/MadagascarMap";

const MapSearch = () => {
  const navigate = useNavigate();

  return (
    <div className="map-search-container">
      <div className="map-search-content">
        <div className="map-section">
          <MadagascarMap />
        </div>
      </div>
    </div>
  );
};

export default MapSearch;
