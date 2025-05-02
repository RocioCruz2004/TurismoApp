// src/components/chat/Chatbot.jsx
import React, { useState } from "react";
import { Chatbot } from "react-chatbot-kit"; 
import "react-chatbot-kit/build/main.css";

// Aquí importamos las configuraciones necesarias
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

// Iconos para abrir y cerrar
import { FaComments, FaTimes } from "react-icons/fa";

function ChatbotComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
      {/* Ícono de Chatbot, visible cuando el chat está cerrado */}
      {!isOpen && (
        <div className="chatbot-icon" onClick={toggleChat} style={{ cursor: "pointer" }}>
          <FaComments size={40} color="#FF5B61" />
        </div>
      )}

      {/* Chatbot abierto */}
      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <button className="close-btn" onClick={toggleChat}>
              <FaTimes size={25} color="#FF5B61" />
            </button>
          </div>
          <Chatbot 
            config={config} 
            messageParser={MessageParser} 
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
}

export default ChatbotComponent;
