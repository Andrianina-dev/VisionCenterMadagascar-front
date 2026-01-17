import React, { useState, useEffect, useRef } from "react";
import "./FloatingMessenger.css";
import geminiService from "../../services/gemini.service";

const FloatingMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! Je suis votre assistant IA pour Vision Center Madagascar. Je peux vous aider concernant les activités religieuses et culturelles, les inscriptions, et les événements à venir. Comment puis-je vous aider ?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

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
    if (messageInput.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: messageInput,
        sender: "user",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setMessageInput("");
      setIsLoading(true);

      try {
        const response = await geminiService.sendMessage(messageInput, conversationHistory);
        
        if (response.success) {
          const aiMessage = {
            id: Date.now() + 1,
            text: response.response,
            sender: "ai",
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, aiMessage]);
          
          // Update conversation history
          setConversationHistory(prev => [
            ...prev,
            { role: "user", content: messageInput },
            { role: "assistant", content: response.response }
          ]);
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            text: response.error || "Désolé, une erreur s'est produite. Veuillez réessayer.",
            sender: "ai",
            timestamp: new Date(),
            isError: true
          };
          
          setMessages(prev => [...prev, errorMessage]);
        }
      } catch (error) {
        const errorMessage = {
          id: Date.now() + 1,
          text: "Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.",
          sender: "ai",
          timestamp: new Date(),
          isError: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
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
                <h3 className="contact-name">Assistant IA</h3>
                <p className="contact-status">En ligne</p>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="action-btn" title="Appel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.3 13.3c-1.2-1.2-3.1-1.9-5.3-1.9 1.2-1.2 1.9-3.1 1.9-5.3 0-4.1-3.3-7.4-7.4-7.4S-1.9 1.8-1.9 5.9c0 2.2.8 4.1 1.9 5.3-2.1 0-4.1.7-5.3 1.9C-7 14.5-7.6 16.4-7.6 18.6c0 4.1 3.3 7.4 7.4 7.4s7.4-3.3 7.4-7.4c0-2.2-.7-4.1-1.9-5.3zm-5.3 1.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
                </svg>
              </button>
              <button className="action-btn" title="Vidéo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 8V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v4h2V4h18v4h2zm0 8v4c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-4h2v4h18v-4h2zM1 12h22V8H1v4z"/>
                </svg>
              </button>
              <button className="action-btn close-btn" onClick={toggleMessenger} title="Fermer">
                ×
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
                  </div>
                </div>
                {message.sender === "user" && <div className="avatar-message">You</div>}
              </div>
            ))}
            
            {isLoading && (
              <div className="message-group received">
                <div className="avatar-message">AI</div>
                <div className="message-content">
                  <div className="message-bubble loading">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder={isLoading ? "L'IA réfléchit..." : "Tapez un message..."}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) handleSendMessage();
              }}
              disabled={isLoading}
            />
            <button 
              className={`send-btn ${isLoading ? 'loading' : ''}`} 
              onClick={handleSendMessage}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99 L3.03521743,10.4309931 C3.03521743,10.5880905 3.34915502,10.7451879 3.50612381,10.7451879 L16.6915026,11.5306749 C16.6915026,11.5306749 17.1624089,11.5306749 17.1624089,12.0019671 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMessenger;
