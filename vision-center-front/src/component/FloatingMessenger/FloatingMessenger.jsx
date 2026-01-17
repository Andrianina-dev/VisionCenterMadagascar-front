import React, { useState } from "react";
import "./FloatingMessenger.css";

const FloatingMessenger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageInput, setMessageInput] = useState("");

  const toggleMessenger = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessageInput("");
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
            {/* Message reçu */}
            <div className="message-group received">
              <div className="avatar-message">AI</div>
              <div className="message-content">
                <div className="message-bubble">
                  <p className="message-text">Jereo tsara ne e eo amle icompletena nom sns reo misi tsipika</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="message-group received">
              <div className="avatar-message">AI</div>
              <div className="message-bubble">
                <p className="message-text">ahh.hiotisoa@gmail.com</p>
              </div>
            </div>

            {/* Message avec actions */}
            <div className="message-group received">
              <div className="avatar-message">AI</div>
              <div className="message-content">
                <div className="message-actions">
                  <button className="action-button video-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M23 8V4c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v4h2V4h18v4h2zm0 8v4c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-4h2v4h18v-4h2zM1 12h22V8H1v4z"/>
                    </svg>
                    Appel vidéo
                  </button>
                  <button className="action-button call-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M17.3 13.3c-1.2-1.2-3.1-1.9-5.3-1.9 1.2-1.2 1.9-3.1 1.9-5.3 0-4.1-3.3-7.4-7.4-7.4S-1.9 1.8-1.9 5.9c0 2.2.8 4.1 1.9 5.3-2.1 0-4.1.7-5.3 1.9C-7 14.5-7.6 16.4-7.6 18.6c0 4.1 3.3 7.4 7.4 7.4s7.4-3.3 7.4-7.4c0-2.2-.7-4.1-1.9-5.3zm-5.3 1.9c-1.3 0-2.4 1.1-2.4 2.4s1.1 2.4 2.4 2.4 2.4-1.1 2.4-2.4-1.1-2.4-2.4-2.4z"/>
                    </svg>
                    Rappeler
                  </button>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="message-timestamp">Ven 13:40</div>

            {/* Message flottant en bas à gauche */}
            <div className="message-group received floating-bottom">
              <div className="avatar-message">AI</div>
              <div className="message-bubble">
                <p className="message-text">D'aon e 😊😊</p>
              </div>
            </div>

            <div className="message-group received floating-bottom">
              <div className="avatar-message">AI</div>
              <div className="message-bubble">
                <p className="message-text">Envoyé il y a 8 h</p>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Tapez un message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button className="send-btn" onClick={handleSendMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16151496 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99 L3.03521743,10.4309931 C3.03521743,10.5880905 3.34915502,10.7451879 3.50612381,10.7451879 L16.6915026,11.5306749 C16.6915026,11.5306749 17.1624089,11.5306749 17.1624089,12.0019671 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingMessenger;
