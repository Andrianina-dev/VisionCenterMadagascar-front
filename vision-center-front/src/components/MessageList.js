// MessageList.js - Composant pour afficher la liste des messages
import React from 'react';
import { useMessages } from '../hooks/useMessages';

const MessageList = () => {
  const { 
    senders, 
    selectedSender, 
    messages, 
    loading, 
    error, 
    selectSender, 
    clearError 
  } = useMessages();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const messageData = {
      message: formData.get('message'),
      sender_name: formData.get('sender_name'),
      sender_email: formData.get('sender_email')
    };

    const result = await sendMessage(messageData);
    
    if (result.success) {
      e.target.reset();
      alert('Message envoyé avec succès !');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  if (loading && senders.length === 0) {
    return (
      <div className="message-list-loading">
        <div className="spinner"></div>
        <p>Chargement des messages...</p>
      </div>
    );
  }

  return (
    <div className="message-list-container">
      {error && (
        <div className="error-message">
          <p>Erreur: {error}</p>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Liste des expéditeurs */}
      <div className="senders-list">
        <h3>Conversations</h3>
        {senders.length === 0 ? (
          <p>Aucune conversation pour le moment</p>
        ) : (
          <div className="senders">
            {senders.map(sender => (
              <div 
                key={sender.id}
                className={`sender-item ${selectedSender?.id === sender.id ? 'active' : ''}`}
                onClick={() => selectSender(sender)}
              >
                <div 
                  className="sender-avatar" 
                  style={{ backgroundColor: MessageService.getAvatarColor(sender.name) }}
                >
                  {sender.avatar}
                </div>
                <div className="sender-info">
                  <div className="sender-name">{sender.name}</div>
                  <div className="sender-last-message">{sender.lastMessage}</div>
                  <div className="sender-meta">
                    <span className="sender-time">{sender.time}</span>
                    {sender.unread > 0 && (
                      <span className="unread-badge">{sender.unread}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conversation sélectionnée */}
      {selectedSender && (
        <div className="conversation">
          <div className="conversation-header">
            <div className="selected-sender">
              <div 
                className="sender-avatar" 
                style={{ backgroundColor: MessageService.getAvatarColor(selectedSender.name) }}
              >
                {selectedSender.avatar}
              </div>
              <div>
                <h4>{selectedSender.name}</h4>
                <p>{selectedSender.email}</p>
              </div>
            </div>
          </div>

          <div className="messages-container">
            {messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-bubble">
                  <p>{message.text}</p>
                  <div className="message-meta">
                    <span className="message-time">{message.time}</span>
                    {message.sender === 'admin' && (
                      <span className="read-status">
                        {message.read ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire d'envoi */}
          <form className="message-form" onSubmit={handleSendMessage}>
            <div className="form-group">
              <input 
                type="text" 
                name="sender_name" 
                placeholder="Votre nom" 
                defaultValue=""
                required
              />
            </div>
            <div className="form-group">
              <input 
                type="email" 
                name="sender_email" 
                placeholder="Votre email" 
                defaultValue=""
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder="Votre message..." 
                required
                rows="3"
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Envoi...' : 'Envoyer'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessageList;
