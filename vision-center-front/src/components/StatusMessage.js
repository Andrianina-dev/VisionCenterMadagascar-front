import React from 'react';

// Composant pour afficher les messages de statut
const StatusMessage = ({ message, children }) => {
  if (!message) return null;
  
  return (
    <div 
      className="status-message" 
      style={{
        backgroundColor: message.backgroundColor,
        border: `1px solid ${message.borderColor}`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '12px'
      }}
    >
      <div className="message-content">
        {message.subtext ? (
          <>
            <div className="message-title" style={{color: message.textColor, fontWeight: 'bold'}}>
              {message.text}
            </div>
            <div className="message-subtitle" style={{color: message.textColor, marginTop: '4px'}}>
              {message.subtext}
            </div>
          </>
        ) : (
          <div className="message-desc" style={{color: message.textColor}}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusMessage;
