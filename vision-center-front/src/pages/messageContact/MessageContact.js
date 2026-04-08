import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaPaperPlane, FaCheck, FaCheckDouble, FaTimes, FaExpand, FaCompress, FaRobot } from 'react-icons/fa';
import MessageService from '../../services/MessageService';
import './MessageContact.css';

const MessageContact = () => {
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBubbles, setShowBubbles] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('=== RECHERCHE ID UTILISATEUR ===');
    
    let foundUserId = null;
    
    // Chercher dans toutes les clés localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      console.log(`Vérification localStorage.${key}:`, value);
      
      if (value) {
        try {
          const parsed = JSON.parse(value);
          console.log(`  Parsed JSON de ${key}:`, parsed);
          
          // Chercher l'ID dans différentes propriétés possibles
          if (parsed.id || parsed.id_utilisateur || parsed.userId) {
            foundUserId = parsed.id || parsed.id_utilisateur || parsed.userId;
            console.log(`✅ ID trouvé dans ${key}:`, foundUserId);
            console.log(`👤 Utilisateur complet:`, parsed);
            break;
          }
        } catch (e) {
          // Si ce n'est pas du JSON, vérifier si c'est directement l'ID
          if (key.includes('user') || key.includes('id')) {
            foundUserId = value;
            console.log(`✅ ID direct trouvé dans ${key}:`, foundUserId);
            break;
          }
        }
      }
    }
    
    // Si rien trouvé dans localStorage, vérifier sessionStorage
    if (!foundUserId) {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        
        if (value) {
          try {
            const parsed = JSON.parse(value);
            if (parsed.id || parsed.id_utilisateur || parsed.userId) {
              foundUserId = parsed.id || parsed.id_utilisateur || parsed.userId;
              console.log(`✅ ID trouvé dans sessionStorage.${key}:`, foundUserId);
              break;
            }
          } catch (e) {
            if (key.includes('user') || key.includes('id')) {
              foundUserId = value;
              console.log(`✅ ID direct trouvé dans sessionStorage.${key}:`, foundUserId);
              break;
            }
          }
        }
      }
    }
    
    console.log('🎯 ID UTILISATEUR FINAL:', foundUserId);
    
    if (foundUserId && foundUserId !== 'null' && foundUserId !== 'undefined') {
      console.log('✅ Utilisateur connecté avec ID:', foundUserId);
      setCurrentUser(foundUserId);
      fetchCurrentUserMessages(foundUserId);
    } else {
      console.log('❌ Aucun ID utilisateur trouvé');
      setError('Utilisateur non connecté');
      setLoading(false);
    }
    
    console.log('=== FIN RECHERCHE ===');
  }, []);

  const fetchCurrentUserMessages = async (userId) => {
    try {
      setLoading(true);
      const result = await MessageService.getCurrentUserMessages(userId);

      if (result.success) {
        setMessages(result.data);
        setError(null);
      } else {
        setError(result.error || 'Erreur lors du chargement des messages');
      }
    } catch (err) {
      setError('Erreur réseau: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!message.trim() || !currentUser) return;

    try {
      const messageData = {
        message: message.trim(),
        id_utilisateur: currentUser
      };

      const result = await MessageService.sendMessage(messageData);
      
      if (result.success) {
        setMessage('');
        // Rafraîchir les messages après l'envoi
        fetchCurrentUserMessages(currentUser);
        scrollToBottom();
      } else {
        setError(result.error || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      setError('Erreur réseau: ' + err.message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return <div className="loading">Chargement des messages...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className={`message-contact ${isFloating ? 'floating-mode' : ''}`}>
      {/* Bulles flottantes partout dans la page (mode chatbot) */}
      <div className="floating-bubbles chatbot-style">
        {/* {chats.map((chat, index) => (
          <div
            key={chat.id}
            className="floating-bubble chatbot-bubble"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 60 + 20}%`,
              animationDelay: `${index * 0.5}s`
            }}
            onClick={() => {
              setSelectedChat(chat);
              setIsFloating(false); // Fermer le mode flottant quand on clique
            }}
          >
            <div className="bubble-avatar chatbot-avatar">
              <FaRobot className="robot-icon" />
              {chat.online && <div className="online-dot" />}
            </div>
            <div className="bubble-content">
              <div className="bubble-name">{chat.name}</div>
              <div className="bubble-message">{chat.lastMessage}</div>
              <div className="bubble-time">{chat.time}</div>
              {chat.unread > 0 && (
                <div className="bubble-badge chatbot-badge">{chat.unread}</div>
              )}
            </div>
            <div className="bubble-indicator">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        ))} */}
      </div>

      {/* Bouton pour activer/désactiver le mode flottant */}
      <button 
        className="floating-toggle-btn"
        onClick={() => setIsFloating(!isFloating)}
      >
        <FaRobot />
        {isFloating ? 'Fermer' : 'Messages'}
      </button>

      {/* Interface normale (sidebar + chat) */}
      {!isFloating && (
        <>
          {/* Sidebar */}
          <div className={`sidebar ${isExpanded ? 'expanded' : ''}`}>
            <div className="sidebar-header">
              <h3>Messages</h3>
              <button 
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <FaCompress /> : <FaExpand />}
              </button>
            </div>

            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="chat-list">
              {/* {filteredChats.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-avatar">
                    {chat.avatar}
                    {chat.online && <div className="online-dot" />}
                  </div>
                  <div className="chat-info">
                    <div className="chat-name">
                      <h4>{chat.name}</h4>
                      <span className="chat-time">{chat.time}</span>
                    </div>
                    <div className="chat-preview">
                      <p>{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="unread-badge">{chat.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))} */}
            </div>
          </div>

          {/* Zone de chat - AFFICHE LES MESSAGES DE L'UTILISATEUR CONNECTÉ */}
          <div className={`chat-area ${isExpanded ? 'expanded' : ''}`}>
            {currentUser && (
              <>
                <div className="chat-header">
                  <div className="header-user">
                    <div className="header-avatar">
                      {currentUser.charAt(0).toUpperCase()}
                    </div>
                    <div className="header-info">
                      <h3>Messages de {currentUser}</h3>
                      <span className="status">
                        Utilisateur connecté
                      </span>
                    </div>
                  </div>
                </div>

                <div className="messages">
                  {messages.map(msg => {
                    const isUserMessage = !msg.reponse_admin;
                    const messageClass = isUserMessage ? 'user-message' : 'admin-message';
                    const bubbleClass = isUserMessage ? 'user-bubble' : 'admin-bubble';
                    
                    return (
                      <div key={msg.id_message} className={`message-wrapper ${messageClass}`}>
                        <div className={`message-bubble ${bubbleClass}`}>
                          <div className="message-text">{msg.message}</div>
                          <div className="message-meta">
                            <span className="message-time">
                              {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="message-date">
                              {new Date(msg.date_envoi).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            {msg.lu && (
                              <span className="read-status">
                                <i className={`fas ${msg.lu ? 'fa-check-double' : 'fa-check'} ${isUserMessage ? 'text-primary' : 'text-muted'}`}></i>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="input-area">
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="message-input"
                  />
                  <button 
                    className={`send-btn ${message.trim() ? 'active' : ''}`}
                    onClick={sendMessage}
                    disabled={!message.trim()}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessageContact;
