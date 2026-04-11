import React, { useState, useRef, useEffect } from 'react';
import { FaSearch, FaPaperPlane, FaCheck, FaCheckDouble, FaTimes, FaExpand, FaCompress, FaRobot } from 'react-icons/fa';
import './MessageContact.css';

const MessageContact = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBubbles, setShowBubbles] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // Données de test
  const chats = [
    {
      id: 1,
      name: 'Sophie Martin',
      avatar: 'SM',
      lastMessage: 'Bonjour, comment allez-vous ?',
      time: '14:30',
      unread: 2,
      online: true,
      messages: [
        { id: 1, text: 'Bonjour admin', sender: 'user', time: '14:25', read: true },
        { id: 2, text: 'Bonjour Sophie !', sender: 'admin', time: '14:26', read: true },
        { id: 3, text: 'Comment allez-vous ?', sender: 'user', time: '14:30', read: false }
      ]
    },
    {
      id: 2,
      name: 'Jean Dubois',
      avatar: 'JD',
      lastMessage: 'Merci pour votre aide',
      time: 'Hier',
      unread: 0,
      online: false,
      messages: [
        { id: 1, text: 'J\'ai besoin d\'aide', sender: 'user', time: '13:00', read: true },
        { id: 2, text: 'Je suis là pour vous aider', sender: 'admin', time: '13:05', read: true },
        { id: 3, text: 'Merci pour votre aide', sender: 'user', time: '13:10', read: true }
      ]
    },
    {
      id: 3,
      name: 'Alice Bernard',
      avatar: 'AB',
      lastMessage: 'Super service !',
      time: '12:15',
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: 'Merci pour votre aide', sender: 'user', time: '12:10', read: true },
        { id: 2, text: 'De rien Alice !', sender: 'admin', time: '12:12', read: true },
        { id: 3, text: 'Super service !', sender: 'user', time: '12:15', read: false }
      ]
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'admin',
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        read: false
      };
      
      selectedChat.messages.push(newMessage);
      setMessage('');
      scrollToBottom();
    }
  };

  // Bulles flottantes pour toute la page (mode chatbot)
  const FloatingBubbles = () => {
    if (!showBubbles || !isFloating) return null;

    return (
      <div className="floating-bubbles chatbot-style">
        {chats.map((chat, index) => (
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
        ))}
      </div>
    );
  };

  return (
    <div className={`message-contact ${isFloating ? 'floating-mode' : ''}`}>
      {/* Bulles flottantes partout dans la page (mode chatbot) */}
      <FloatingBubbles />

      {/* Bouton pour activer/désactiver le mode flottant */}
      <button 
        className="floating-toggle-btn"
        onClick={() => setIsFloating(!isFloating)}
      >
        <FaRobot />
        {isFloating ? 'Fermer' : 'Messages'}
      </button>

      {/* Bouton pour afficher/masquer les bulles */}
      {isFloating && (
        <button 
          className="bubble-toggle-btn"
          onClick={() => setShowBubbles(!showBubbles)}
        >
          {showBubbles ? <FaTimes /> : <FaExpand />}
        </button>
      )}

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
              {filteredChats.map(chat => (
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
              ))}
            </div>
          </div>

          {/* Zone de chat */}
          <div className={`chat-area ${isExpanded ? 'expanded' : ''}`}>
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <div className="header-user">
                    <div className="header-avatar">
                      {selectedChat.avatar}
                    </div>
                    <div className="header-info">
                      <h3>{selectedChat.name}</h3>
                      <span className="status">
                        {selectedChat.online ? 'En ligne' : 'Hors ligne'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="messages">
                  {selectedChat.messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} />
                  ))}
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
            ) : (
              <div className="empty-state">
                <h3>Sélectionnez une conversation</h3>
                <p>Choisissez un utilisateur pour commencer à discuter</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// Composant pour la bulle de message
const MessageBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`message ${isUser ? 'user' : 'admin'}`}>
      <div className="bubble">
        <p>{message.text}</p>
        <div className="bubble-meta">
          <span className="time">{message.time}</span>
          {message.sender === 'admin' && (
            <span className="read-status">
              {message.read ? <FaCheckDouble /> : <FaCheck />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContact;
