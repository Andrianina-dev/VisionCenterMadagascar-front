import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie } from 'react-icons/fa';
import AuthService from '../../services/auth.service';
import '../../styles/pages/Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const member = AuthService.getCurrentUser();
    if (!member) {
      navigate('/login');
      return;
    }
    setCurrentUser(member);
    loadMessages();
  }, [navigate]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      
      // Récupérer les infos du membre connecté
      const member = AuthService.getCurrentUser();
      if (!member) {
        navigate('/login');
        return;
      }

      // Récupérer les messages envoyés par l'admin pour le membre connecté
      const response = await fetch(`${apiUrl}/public/messages/member?member_id=${member.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'omit'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      } else {
        throw new Error('Erreur lors du chargement des messages');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const markAsRead = async (messageId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/public/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });

      // Mettre à jour l'état local
      setMessages(prev => 
        prev.map(msg => 
          msg.id_message === messageId ? { ...msg, lu: true } : msg
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };

  const unreadCount = messages.filter(msg => !msg.lu).length;

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-container">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={loadMessages} className="retry-btn">Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <header className="messages-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Messages</h1>
            {unreadCount > 0 && (
              <span className="unread-badge">{unreadCount} non lu{unreadCount > 1 ? 's' : ''}</span>
            )}
          </div>
          <button onClick={loadMessages} className="refresh-btn">
            🔄 Actualiser
          </button>
        </div>
      </header>

      <main className="messages-main">
        {messages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">📭</div>
            <h2>Aucun message</h2>
            <p>L'administrateur ne vous a envoyé aucun message pour le moment.</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((message) => (
              <div 
                key={message.id_message} 
                className={`message-item ${!message.lu ? 'unread' : ''}`}
                onClick={() => !message.lu && markAsRead(message.id_message)}
              >
                <div className="message-avatar">
                  <div className="admin-avatar"><FaUserTie /></div>
                  {!message.lu && <div className="unread-indicator"></div>}
                </div>
                
                <div className="message-content">
                  <div className="message-header">
                    <div className="message-info">
                      <span className="sender-name">Administrateur</span>
                      <span className="message-date">
                        {formatDate(message.date_envoi)} • {formatTime(message.date_envoi)}
                      </span>
                    </div>
                    {!message.lu && (
                      <span className="unread-label">Nouveau</span>
                    )}
                  </div>
                  
                  <h3 className="message-title">{message.titre || 'Message'}</h3>
                  <p className="message-text">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
