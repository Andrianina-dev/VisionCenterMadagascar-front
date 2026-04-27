import React, { useState, useEffect, useRef } from "react";
import "./FloatingMessenger.css";
import { sendMessage } from "../../services/huggingface.service";

const FloatingMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Salut ! Je suis l'assistant IA de Vision. Comment puis-je vous aider ?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);


  // Suggestions prédéfinies
  const suggestions = [
    "Quelles sont les activités à venir ?",
    "Comment m'inscrire à une activité ?",
    "Où se trouvent vos locaux ?",
    "Quels sont les horaires d'ouverture ?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleMessenger = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      const userMessage = {
        id: Date.now(),
        text: messageInput,
        sender: "user",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setMessageInput("");
      
      try {
        // Appel au service backend
        const response = await sendMessage(messageInput);
        const aiMessage = {
          id: Date.now() + 1,
          text: response.message || response.response || "Désolé, je n'ai pas pu traiter votre demande.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        // En cas d'erreur, réponse de secours
        const aiMessage = {
          id: Date.now() + 1,
          text: "Désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
          sender: "ai",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessageInput(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Bonjour ! Je suis votre assistant IA pour le Centre de Vision. Je peux vous aider concernant les activités, les inscriptions, et les événements à venir. Comment puis-je vous aider ?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  };

  // const handleRetry = async (messageToRetry) => {
  //   // Fonction retry désactivée en mode statique
  // };

  return (
    <div className="floating-messenger">
      {/* Icône flottante */}
      <button
        className="messenger-toggle"
        onClick={toggleMessenger}
        title="Messagerie"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6l-2-2H9l-2 2H1c-.55 0-1 .45-1 1s.45 1 1 1h1v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h1c.55 0 1-.45 1-1s-.45-1-1-1zM7 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
      </button>

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="messenger-window">
          {/* Header - Contact Info */}
          <div className="chat-header">
            <div className="contact-info">
              <div className="avatar-large">AI</div>
              <div className="contact-details">
                <h3 className="contact-name">Assistant Centre de Vision</h3>
                <p className="contact-status">En ligne</p>
              </div>
            </div>
            
            <div className="chat-header-actions">
              <button className="chat-action-btn chat-close-btn" onClick={toggleMessenger} title="Fermer" aria-label="Fermer la messagerie">
                &times;
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message-group ${message.sender === "user" ? "sent" : "received"}`}>
                {message.sender === "ai" && <div className="avatar-message">AI</div>}
                <div className="message-content">
                  <div className={`message-bubble ${message.isError ? "error" : ""}`}>
                    <p className="message-text">{message.text}</p>
                    {message.isError && (
                      {/* <button 
                        className="retry-btn" 
                        onClick={() => handleRetry(message)}
                        disabled={isLoading}
                        title="Réessayer"
                      >
                        🔄 Réessayer
                      </button> */}
                    )}
                  </div>
                </div>
                {message.sender === "user" && <div className="avatar-message">You</div>}
              </div>
            ))}
            
            {/* {isLoading && (
              <div className="message-group received">
                <div className="avatar-message typing-avatar">AI</div>
                <div className="message-content">
                  <div className="message-bubble loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="typing-text">L'IA réfléchit...</div>
                  </div>
                </div>
              </div>
            )} */}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="suggestions-container">
              <p className="suggestions-title">Questions fréquentes :</p>
              <div className="suggestions-grid">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-btn"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Tapez un message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="send-btn"
              onClick={handleSendMessage}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99 L3.03521743,10.4309931 C3.03521743,10.5880905 3.34915502,10.7451879 3.50612381,10.7451879 L16.6915026,11.5306749 C16.6915026,11.5306749 17.1624089,11.5306749 17.1624089,12.0019671 C17.1625089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMessenger;
