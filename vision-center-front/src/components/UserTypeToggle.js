import React from 'react';
import '../styles/components/couleur/couleur.css';
import '../styles/components/toggle.css';

const UserTypeToggle = ({ userType, onChange }) => {
  return (
    <div className="user-type-toggle">
      <div className="toggle-labels">
        <span className={`toggle-label ${userType === 'membre' ? 'active' : ''}`}>Membre</span>
        <div className="toggle-container" onClick={() => onChange(userType === 'membre' ? 'non-membre' : 'membre')}>
          <div className={`toggle-slider ${userType === 'membre' ? 'membre' : 'non-membre'}`}></div>
        </div>
        <span className={`toggle-label ${userType === 'non-membre' ? 'active' : ''}`}>Non-membre</span>
      </div>
    </div>
  );
};

export default UserTypeToggle;
