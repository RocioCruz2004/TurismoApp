// src/components/chat/config.js
import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

// Configuración del chatbot con un mensaje inicial
const config = {
  initialMessages: [
    createChatBotMessage("¡Hola! Soy tu guía virtual de Rumbo Chapaco. ¿Cómo puedo ayudarte hoy?")
  ],
  customComponents: {},
  botName: "RumboBot",
  messageParser: MessageParser,
  actionProvider: ActionProvider,
};

export default config;
