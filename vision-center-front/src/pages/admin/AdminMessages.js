import React, { useState, useEffect } from 'react';
import './AdminMessages.css';

const AdminMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/admin/messages/chat/conversations`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include' // Important pour les cookies de session admin
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Non authentifié - Veuillez vous connecter en tant qu\'administrateur');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setConversations(data.conversations || []);
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || sendingMessage) {
      return;
    }

    try {
      setSendingMessage(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      const response = await fetch(`${apiUrl}/api/admin/messages/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          membre_id: selectedConversation.recipient_id,
          message: messageInput.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setMessageInput('');
        // Optionnel: recharger les conversations ou mettre à jour l'interface
      } else {
        throw new Error(data.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err.message);
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-messages">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement des conversations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-messages">
        <div className="error">
          <h2>❌ Erreur</h2>
          <p>{error}</p>
          <button onClick={loadConversations} className="retry-btn">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-messages">
      <header className="messages-header">
        <h1>💬 Messagerie Admin</h1>
        <button onClick={loadConversations} className="refresh-btn">
          🔄 Actualiser
        </button>
      </header>

      <div className="messages-container">
        {/* Liste des conversations */}
        <div className="conversations-list">
          <h2>Conversations</h2>
          {conversations.length === 0 ? (
            <div className="no-conversations">
              <p>Aucune conversation trouvée</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-avatar">
                  <div className="avatar">
                    {conversation.recipient_name ? conversation.recipient_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {conversation.unread_count > 0 && (
                    <div className="unread-badge">{conversation.unread_count}</div>
                  )}
                </div>
                
                <div className="conversation-content">
                  <div className="conversation-header">
                    <h3>{conversation.recipient_name || 'Utilisateur inconnu'}</h3>
                    <span className="conversation-time">
                      {formatDate(conversation.last_message_time)} • {formatTime(conversation.last_message_time)}
                    </span>
                  </div>
                  <p className="conversation-email">{conversation.recipient_email}</p>
                  <p className="last-message">{conversation.last_message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Zone de chat */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-contact-info">
                  <div className="chat-avatar">
                    {selectedConversation.recipient_name ? selectedConversation.recipient_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="chat-contact-details">
                    <h3>{selectedConversation.recipient_name || 'Utilisateur inconnu'}</h3>
                    <p>{selectedConversation.recipient_email}</p>
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                <div className="no-messages">
                  <p>Historique des messages non disponible</p>
                  <p>Envoyez un nouveau message pour commencer la conversation</p>
                </div>
              </div>

              <div className="chat-input-area">
                <textarea
                  className="message-input"
                  placeholder="Tapez votre message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={3}
                />
                <button
                  className={`send-btn ${sendingMessage ? 'sending' : ''}`}
                  onClick={sendMessage}
                  disabled={!messageInput.trim() || sendingMessage}
                >
                  {sendingMessage ? (
                    <div className="spinner"></div>
                  ) : (
                    'Envoyer'
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-icon">💬</div>
              <h3>Sélectionnez une conversation</h3>
              <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
