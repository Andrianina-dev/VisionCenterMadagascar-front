import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import '../../styles/pages/profileMembre.css';

const ProfileMembre = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentMember());
  
  const [formData, setFormData] = useState({
    title: currentUser?.civilite || 'M.',
    firstName: currentUser?.prenom || '',
    lastName: currentUser?.nom || '',
    email: currentUser?.email || '',
    phone: currentUser?.telephone || ''
  });

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Formater les messages du backend pour l'affichage dans la liste
  const formatMessagesForList = (backendMessages) => {
    const conversations = {};
    
    backendMessages.forEach(message => {
      // Regrouper par type : Admin vs Membre
      const conversationKey = message.reponse_admin ? 'admin-conversation' : 'member-conversation';
      
      if (!conversations[conversationKey]) {
        conversations[conversationKey] = {
          id: conversationKey,
          name: message.reponse_admin ? 'Admin Vision Center' : 
                (message.utilisateur ? 
                  `${message.utilisateur.prenom_utilisateur} ${message.utilisateur.nom_utilisateur}` : 
                  'Moi'),
          avatar: message.reponse_admin ? 'AD' : 
                  (message.utilisateur ? 
                    `${message.utilisateur.prenom_utilisateur[0]}${message.utilisateur.nom_utilisateur[0]}`.toUpperCase() : 
                    'MO'),
          lastMessage: message.message.substring(0, 50) + (message.message.length > 50 ? '...' : ''),
          time: new Date(message.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          unread: message.lu ? 0 : 1,
          online: message.reponse_admin,
          message: message,
          // Compter les messages non lus pour cette conversation
          unreadCount: 0,
          totalMessages: 0
        };
      }
      
      // Mettre à jour le dernier message et compter
      const conv = conversations[conversationKey];
      const messageDate = new Date(message.date_envoi);
      
      // Si c'est le premier message ou si ce message est plus récent
      if (!conv.lastMessageDate || messageDate > conv.lastMessageDate) {
        conv.lastMessage = message.message.substring(0, 50) + (message.message.length > 50 ? '...' : '');
        conv.time = messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        conv.lastMessageDate = messageDate; // Stocker la date pour comparaison
        conv.lastMessageFullDate = messageDate.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }); // Ajouter la date complète
      }
      
      // Vérifier si ce message est récent (moins de 24h)
      const isRecent = (new Date() - messageDate) < (24 * 60 * 60 * 1000);
      if (isRecent) {
        conv.recentCount = (conv.recentCount || 0) + 1;
      }
      
      if (!message.lu) {
        conv.unreadCount++;
      }
      conv.totalMessages++;
    });
    
    // Mettre à jour le compteur unread pour l'affichage
    Object.values(conversations).forEach(conv => {
      conv.unread = conv.unreadCount;
    });
    
    // Trier par date du dernier message (plus ancien en haut, plus récent en bas)
    const sortedConversations = Object.values(conversations).sort((a, b) => {
      if (!a.lastMessageDate && !b.lastMessageDate) return 0;
      if (!a.lastMessageDate) return 1;
      if (!b.lastMessageDate) return -1;
      return new Date(a.lastMessageDate) - new Date(b.lastMessageDate);
    });
    
    // Debug: Afficher l'ordre dans la console
    console.log('Ordre des conversations:', sortedConversations.map((conv, index) => ({
      index: index + 1,
      name: conv.name,
      lastMessageDate: conv.lastMessageDate,
      lastMessage: conv.lastMessage,
      position: index === 0 ? 'Haut (ancien)' : index === sortedConversations.length - 1 ? 'Bas (récent)' : 'Milieu'
    })));
    
    return sortedConversations.map(conv => ({
      ...conv,
      // Ajouter la date complète pour les messages récents
      lastMessageFullDate: conv.lastMessageDate ? 
        conv.lastMessageDate.toLocaleDateString('fr-FR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }) : null,
      // Indicateur visuel pour les messages récents (basé sur le compteur)
      isRecent: conv.recentCount > 0,
      recentCount: conv.recentCount || 0
    }));
  };

  // Formater les conversations pour le chat
  const formatConversationsForChat = (backendMessages) => {
    const conversations = {};
    
    backendMessages.forEach(message => {
      // Regrouper par type : Admin vs Membre
      const conversationKey = message.reponse_admin ? 'admin-conversation' : 'member-conversation';
      
      if (!conversations[conversationKey]) {
        conversations[conversationKey] = {
          id: conversationKey,
          name: message.reponse_admin ? 'Admin Vision Center' : 
                (message.utilisateur ? 
                  `${message.utilisateur.prenom_utilisateur} ${message.utilisateur.nom_utilisateur}` : 
                  'Moi'),
          messages: []
        };
      }
      
      conversations[conversationKey].messages.push({
        id: message.id_message,
        sender: message.reponse_admin ? 'Admin' : 'Moi',
        content: message.message,
        time: new Date(message.date_envoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        date_envoi: message.date_envoi, // Ajouter la date d'envoi pour affichage
        full_date: new Date(message.date_envoi).toLocaleDateString('fr-FR', { // Ajouter la date complète
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }),
        isMe: !message.reponse_admin
      });
    });
    
    // Trier les messages par date dans chaque conversation
    Object.values(conversations).forEach(conv => {
      conv.messages.sort((a, b) => new Date(a.date_envoi) - new Date(b.date_envoi));
    });
    
    return Object.values(conversations);
  };

  // Récupérer les vrais messages du backend
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        // Essayer d'abord l'API principale
        let response = await fetch(`http://localhost:8000/api/public/messages/member?member_id=${currentUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        // Si l'API principale ne fonctionne pas, essayer le debug
        if (!response.ok) {
          console.log('API principale indisponible, essai du debug...');
          response = await fetch(`http://localhost:8000/api/public/messages/debug`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
        }

        if (response.ok) {
          const data = await response.json();
          console.log('Données reçues:', data);
          
          if (data.success) {
            // Si c'est la réponse de debug, utiliser les données de test
            if (data.debug) {
              console.log('Mode debug - utilisation des données de test');
              setMessages([
                {
                  id: 1,
                  name: 'Admin Vision',
                  avatar: 'AV',
                  lastMessage: 'Bienvenue sur Vision Center',
                  time: '10:30',
                  unread: 1,
                  online: true
                }
              ]);
              setConversations([
                {
                  id: 1,
                  messages: [
                    { id: 1, sender: 'Admin', content: 'Bienvenue sur Vision Center', time: '10:30', isMe: false },
                    { id: 2, sender: 'Moi', content: 'Merci !', time: '10:32', isMe: true }
                  ]
                }
              ]);
            } else {
              // Utiliser les données réelles de l'API
              const formattedMessages = formatMessagesForList(data.data || []);
              const formattedConversations = formatConversationsForChat(data.data || []);
              setMessages(formattedMessages);
              setConversations(formattedConversations);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error);
        // Utiliser des messages de test si le backend n'est pas disponible
        setMessages([
          {
            id: 1,
            name: 'Admin Vision',
            avatar: 'AV',
            lastMessage: 'Bienvenue sur Vision Center',
            time: '10:30',
            unread: 1,
            online: true
          }
        ]);
        setConversations([
          {
            id: 1,
            messages: [
              { id: 1, sender: 'Admin', content: 'Bienvenue sur Vision Center', time: '10:30', isMe: false },
              { id: 2, sender: 'Moi', content: 'Merci !', time: '10:32', isMe: true }
            ]
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser?.id]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectConversation = (message) => {
    setSelectedConversation(message);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser?.id) return;

    try {
      const response = await fetch('http://localhost:8000/api/public/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: newMessage.trim(),
          id_utilisateur: currentUser.id,
          nom: `${currentUser.prenom} ${currentUser.nom}`,
          email: currentUser.email,
          telephone: currentUser.telephone || '',
          sujet: 'Message depuis le profil'
        })
      });

      if (response.ok) {
        // Ajouter le message localement pour l'affichage immédiat
        const newMsg = {
          id: Date.now(),
          sender: 'Moi',
          content: newMessage.trim(),
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          full_date: new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          isMe: true
        };

        // Mettre à jour la conversation actuelle
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation?.id 
            ? { ...conv, messages: [...(conv.messages || []), newMsg] }
            : conv
        ));

        // Vider le champ de saisie
        setNewMessage('');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'envoi du message:', errorData);
        alert(errorData.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert('Erreur de connexion. Veuillez réessayer.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="account-page">
      {/* Top Navigation Bar */}
      <header className="account-header">
        <div className="header-content">
          <div className="logo">VISION CENTER</div>
          <nav className="header-nav">
            <button className="header-link">Favourite</button>
            <button className="header-link">Bookings</button>
            <div className="user-avatar">{currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}</div>
          </nav>
        </div>
      </header>

      <div className="account-container">
        {/* Left Sidebar */}
        <aside className="account-sidebar">
          <div className="user-info">
            <div className="user-avatar-large">{currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}</div>
            <h3 className="user-name">{currentUser?.prenom} {currentUser?.nom}</h3>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button 
              className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Message
            </button>
            <button 
              className="nav-item logout"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="account-main">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account Information
            </button>
            <button 
              className={`tab ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              Password & Security
            </button>
            <button 
              className={`tab ${activeTab === 'newsletter' ? 'active' : ''}`}
              onClick={() => setActiveTab('newsletter')}
            >
              Newsletter & Promo
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'account' && (
              <div className="account-content">
                {/* About You Section */}
                <section className="about-section">
                  <h2>À propos</h2>
                  <p className="section-description">
                    {currentUser?.prenom} {currentUser?.nom}, membre de Vision Center depuis {new Date().getFullYear()}.
                  </p>
                </section>
                
                <section className="personal-info-section">
                  <h2>Informations personnelles</h2>
                  <p className="section-description">
                    Gérez vos informations personnelles ici.
                  </p>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="title">Titre</label>
                      <select 
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="form-input"
                      >
                        <option value="M.">M.</option>
                        <option value="Mme">Mme</option>
                        <option value="Mlle">Mlle</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="firstName">Nom</label>
                      <input 
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Votre nom"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">Prénom</label>
                      <input 
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Votre prénom"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="votre@email.com"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">Téléphone</label>
                      <input 
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="+261 XX XXX XXX XX"
                      />
                    </div>
                  </div>
                  <div className="social-accounts">
                    <div className="social-item">
                      <div className="social-icon facebook">
                        <span>f</span>
                      </div>
                      <div className="social-info">
                        <h4>Facebook</h4>
                        <button className="connect-button">Connect</button>
                      </div>
                    </div>
                    
                    <div className="social-item">
                      <div className="social-icon google">
                        <span>G</span>
                      </div>
                      <div className="social-info">
                        <h4>Google</h4>
                        <div className="connected-status">
                          <span className="status-text">Connected</span>
                          <span className="checkmark">✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {activeTab === 'bookings' && (
              <div className="messages-content">
                {loading ? (
                  <div className="loading-messages">
                    <div className="loading-spinner"></div>
                    <p>Chargement des messages...</p>
                  </div>
                ) : (
                  <div className="messages-container">
                    {/* Liste des messages */}
                    <div className="messages-list">
                      <h3>Messages</h3>
                      <div className="message-items">
                        {messages.map(message => (
                          <div 
                            key={message.id} 
                            className={`message-item ${selectedConversation?.id === message.id ? 'active' : ''}`}
                            onClick={() => handleSelectConversation(message)}
                          >
                            <div className="message-avatar">
                              {message.avatar}
                              {message.online && <span className="online-indicator"></span>}
                            </div>
                            <div className="message-info">
                              <div className="message-header">
                                <span className="message-name">{message.name}</span>
                                <div className="message-time-container">
                                  <span className="message-time">{message.time}</span>
                                  {message.isRecent && message.lastMessageFullDate && (
                                    <span className="message-date"> {message.lastMessageFullDate}</span>
                                  )}
                                </div>
                              </div>
                              <div className="message-preview">{message.lastMessage}</div>
                            </div>
                            {message.unread > 0 && (
                              <span className="unread-count">{message.unread}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Boîte de discussion */}
                    {selectedConversation && (
                      <div className="chat-container">
                        <div className="chat-header">
                          <div className="chat-avatar">
                            {selectedConversation.avatar}
                            {selectedConversation.online && <span className="online-indicator"></span>}
                          </div>
                          <div className="chat-info">
                            <h4>{selectedConversation.name}</h4>
                            <span className="chat-status">
                              {selectedConversation.online ? 'En ligne' : 'Hors ligne'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="chat-messages">
                          {conversations
                            .find(conv => conv.id === selectedConversation.id)
                            ?.messages.map(msg => (
                              <div 
                                key={msg.id} 
                                className={`chat-message ${msg.isMe ? 'sent' : 'received'}`}
                              >
                                <div className="message-content">
                                  <p>{msg.content}</p>
                                  <div className="message-time-container">
                                    <span className="message-time">{msg.time}</span>
                                    <span className="message-date"> {msg.full_date}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                        
                        <div className="chat-input">
                          <input 
                            type="text" 
                            placeholder="Tapez votre message..."
                            className="message-input"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <button className="send-button" onClick={handleSendMessage}>Envoyer</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-content">
                <h2>Password & Security</h2>
                <p>Manage your password and security settings here.</p>
                {/* Security form content */}
              </div>
            )}

            {activeTab === 'newsletter' && (
              <div className="newsletter-content">
                <h2>Newsletter & Promo</h2>
                <p>Manage your newsletter preferences and promotional settings.</p>
                {/* Newsletter form content */}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileMembre;
