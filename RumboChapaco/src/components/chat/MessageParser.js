// src/components/chat/MessageParser.js
class MessageParser {
    constructor(actions) {
      this.actions = actions;
    }
  
    parse(message) {
      const lowerCaseMessage = message.toLowerCase();

       // Detectar consultas sobre el precio de cualquier ruta
    if (lowerCaseMessage.includes("cuánto cuesta")) {
        // Extraer el nombre de la ruta de la consulta
        const ruta = lowerCaseMessage.split("cuánto cuesta")[1].trim(); // Obtiene el texto después de "cuánto cuesta"
        if (ruta) {
          this.actions.handlePrecioRutaQuery(ruta);  // Pasa la ruta al action provider
        } else {
          this.actions.updateChatBotState(
            this.actions.createChatBotMessage("Lo siento, no pude identificar la ruta.")
          );
        }
      } else {
  
            if (lowerCaseMessage.includes("qué es rumbo chapaco")) {
                this.actions.handleRumboChapacoQuery();
            } else if (lowerCaseMessage.includes("rutas") || lowerCaseMessage.includes("qué rutas ofrece")) {
                this.actions.handleRutasQuery();
            } else if (lowerCaseMessage.includes("historia de tarija") || lowerCaseMessage.includes("tarija")) {
                this.actions.handleHistoriaQuery();
            } else if (lowerCaseMessage.includes("cómo puedo reservar una ruta")) {
                this.actions.handleReservaQuery();
            } else if (lowerCaseMessage.includes("tengo problemas para hacer la reserva")) {
                this.actions.handleProblemasReservaQuery();
            } else if (lowerCaseMessage.includes("gracias") || lowerCaseMessage.includes("adiós")) {
                this.actions.handleDespedida();
            } else if (lowerCaseMessage.includes("clima")) {
                this.actions.handleClimaQuery();
            } else {
                this.actions.updateChatBotState(
                this.actions.createChatBotMessage("Lo siento, no entendí tu pregunta.")
                );
            }
        }
    }
  }
  
  export default MessageParser;
  