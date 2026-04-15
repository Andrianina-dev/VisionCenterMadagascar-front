import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaPaperPlane, FaTimes } from 'react-icons/fa';
import MessageService from '../../services/MessageService';
import FloatingMessenger from '../../component/FloatingMessenger/FloatingMessenger';
import './MessageContact.css';

const GlobalMessageContact = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showFloatingMessage, setShowFloatingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const hiddenPathPrefixes = [
    '/login',
    '/signup',
    '/admin'
  ];

  const detectAuth = () => {
    const hasMember = !!localStorage.getItem('member');
    const hasNonMember = !!localStorage.getItem('non_membre');
    const hasUser = !!localStorage.getItem('user');
    const hasToken = !!localStorage.getItem('token');
    const hasAuthFlag = localStorage.getItem('auth') === 'true';

    return hasMember || hasNonMember || hasUser || hasToken || hasAuthFlag;
  };

  const shouldHideWidget = hiddenPathPrefixes.some(
    (prefix) => currentPath === prefix || currentPath.startsWith(`${prefix}/`)
  ) || !isAuthenticated;

  useEffect(() => {
    const updateState = () => {
      setCurrentPath(window.location.pathname);
      setIsAuthenticated(detectAuth());
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const result = originalPushState.apply(this, args);
      updateState();
      return result;
    };

    window.history.replaceState = function (...args) {
      const result = originalReplaceState.apply(this, args);
      updateState();
      return result;
    };

    window.addEventListener('popstate', updateState);
    window.addEventListener('storage', updateState);
    updateState();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener('popstate', updateState);
      window.removeEventListener('storage', updateState);
    };
  }, []);

  useEffect(() => {
    console.log('=== RECHERCHE ID UTILISATEUR ===');
    
    let foundUserId = null;
    
    // Chercher dans toutes les clés localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      
      if (value) {
        try {
          const parsed = JSON.parse(value);
          
          // Chercher l'ID dans différentes propriétés possibles
          if (parsed.id || parsed.id_utilisateur || parsed.userId) {
            foundUserId = parsed.id || parsed.id_utilisateur || parsed.userId;
            console.log(`✅ ID trouvé dans ${key}:`, foundUserId);
            console.log(`� Utilisateur complet:`, parsed);
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
    
    console.log('🎯 ID UTILISATEUR FINAL:', foundUserId);
    
    if (foundUserId && foundUserId !== 'null' && foundUserId !== 'undefined') {
      console.log('✅ Utilisateur connecté avec ID:', foundUserId);
      setCurrentUser(foundUserId);
      fetchCurrentUserMessages(foundUserId);
    } else {
      console.log('❌ Aucun ID utilisateur trouvé');
      setLoading(false);
    }
  }, []);

  // Afficher le message flottant seulement quand il y a plus de 1 message utilisateur réel
  useEffect(() => {
    // Compter seulement les messages utilisateur (pas les messages IA)
    const userMessages = messages.filter(msg => !msg.reponse_admin);
    
    // Afficher TOUS les messages (utilisateur + admin) dans la bulle
    const allMessages = messages; // Utiliser tous les messages directement
    
    if (userMessages.length > 1 && !loading) {
      setShowFloatingMessage(true);
    } else {
      setShowFloatingMessage(false);
    }
  }, [messages, loading]);

  const fetchCurrentUserMessages = async (userId) => {
    try {
      setLoading(true);
      const result = await MessageService.getCurrentUserMessages(userId);
      console.log('=== MESSAGES REÇUS DU BACKEND ===');
      console.log('Result complet:', result);
      console.log('Success:', result.success);
      console.log('Nombre de messages:', result.data?.length);
      console.log('Détails messages:', result.data);
      
      // Analyser chaque message
      if (result.data && result.data.length > 0) {
        result.data.forEach((msg, index) => {
          console.log(`Message ${index + 1}:`, {
            id_message: msg.id_message,
            message: msg.message,
            id_utilisateur: msg.id_utilisateur,
            reponse_admin: msg.reponse_admin,
            date_envoi: msg.date_envoi,
            utilisateur: msg.utilisateur
          });
        });
        
        // Compter les messages admin vs utilisateur
        const userMsgs = result.data.filter(msg => !msg.reponse_admin);
        const adminMsgs = result.data.filter(msg => msg.reponse_admin);
        console.log(`Messages utilisateur: ${userMsgs.length}`);
        console.log(`Messages admin: ${adminMsgs.length}`);
      }

      if (result.success) {
        setMessages(result.data);
        setLoading(false);
      } else {
        console.log('Erreur:', result.error);
        setLoading(false);
      }
    } catch (err) {
      console.log('Erreur réseau:', err);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log('=== DÉBUT ENVOI MESSAGE ===');
    console.log('inputMessage:', inputMessage);
    console.log('currentUser:', currentUser);
    console.log('inputMessage.trim():', inputMessage.trim());
    
    if (inputMessage.trim() && currentUser) {
      console.log('✅ Conditions validées, envoi en cours...');
      try {
        const messageData = {
          message: inputMessage.trim(),
          id_utilisateur: currentUser
        };
        
        console.log('📤 messageData à envoyer:', messageData);

        const result = await MessageService.sendMessage(messageData);
        
        console.log('📥 Résultat API:', result);
        
        if (result.success) {
          console.log('✅ Message envoyé avec succès');
          setInputMessage('');
          fetchCurrentUserMessages(currentUser);
        } else {
          console.log('❌ Erreur retournée par API:', result.error);
        }
      } catch (err) {
        console.log('❌ Erreur exception:', err);
        console.log('Détails erreur:', err.response?.data || err.message);
      }
    } else {
      console.log('❌ Conditions non validées');
      console.log('- inputMessage.trim() vide?', !inputMessage.trim());
      console.log('- currentUser vide?', !currentUser);
    }
    console.log('=== FIN ENVOI MESSAGE ===');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (shouldHideWidget) {
    return null;
  }

  return (
    <div className="message-contact simple-ai">
      {/* Bulle fixe simple */}
      <button 
        className="simple-ai-bubble"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <FaEnvelope />
      </button>
      
      {/* Badge à côté du chatbot */}
      
      {/* Fenêtre de chat simple */}
      {isChatOpen && (
        <div className="simple-chat-window">
          <div className="simple-chat-header">
            <div className="simple-header-info">
              <FaEnvelope className="simple-robot-icon" />
              <span>Contacter l'admin</span>
            </div>
            <button 
              className="simple-close-btn"
              onClick={() => setIsChatOpen(false)}
            >
              <FaTimes />
            </button>
          </div>

          <div className="simple-chat-content">
            {loading ? (
              <div className="simple-loading">Chargement...</div>
            ) : (
              <div className="simple-messages">
                {messages.map(msg => (
                  <div key={msg.id_message} className={`simple-message ${msg.reponse_admin ? 'admin' : 'user'}`}>
                    <div className="simple-message-text">{msg.message}</div>
                    <div className="simple-message-time">
                      {new Date(msg.date_envoi).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="simple-input-area">
            <input
              type="text"
              placeholder="Écrivez votre message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="simple-message-input"
              autoFocus
            />
            <button 
              className={`simple-send-btn ${inputMessage.trim() ? 'active' : ''}`}
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}

      {/* Message flottant à côté du chatbot IA */}
      {showFloatingMessage && (
        <FloatingMessenger />
      )}
    </div>
  );
};

export default GlobalMessageContact;
