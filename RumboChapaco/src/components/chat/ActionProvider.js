// src/components/chat/ActionProvider.js
class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
  
    handleRutasQuery = () => {
      const message = this.createChatBotMessage(
        "Tenemos diversas rutas, como la 'Ruta del Vino & Singani', 'Ruta del Vino Industrial' y más. ¿Te gustaría saber más sobre alguna?"
      );
      this.updateChatBotState(message);
    };
  
    handleHistoriaQuery = () => {
      const message = this.createChatBotMessage(
        "Tarija tiene una rica historia llena de cultura, vino y paisajes impresionantes. ¿Te gustaría saber más sobre su historia?"
      );
      this.updateChatBotState(message);
    };
  
    handleRumboChapacoQuery = () => {
      const message = this.createChatBotMessage(
        "Rumbo Chapaco es tu guía de turismo en Tarija, ofreciendo rutas personalizadas para explorar lo mejor de la región."
      );
      this.updateChatBotState(message);
    };
  
    // Responder a la consulta general sobre Rumbo Chapaco
    handleRumboChapacoQuery = () => {
      const message = this.createChatBotMessage(
        "Rumbo Chapaco es tu guía de turismo en Tarija, ofreciendo rutas personalizadas para explorar lo mejor de la región."
      );
      this.updateChatBotState(message);
    };
  
    // Responder a la consulta sobre el proceso de reserva
    handleReservaQuery = () => {
      const message = this.createChatBotMessage(
        "Para reservar una ruta, puedes visitar nuestra página de reservas y seleccionar la ruta de tu interés."
      );
      this.updateChatBotState(message);
    };
  
  
    // Responder a la consulta de ayuda para la reserva
    handleProblemasReservaQuery = () => {
      const message = this.createChatBotMessage(
        "Si tienes problemas para hacer una reserva, por favor asegúrate de estar en la página correcta y que los datos sean correctos. Si sigues teniendo problemas, contáctanos."
      );
      this.updateChatBotState(message);
    };
  
    // Despedirse al final de la conversación
    handleDespedida = () => {
      const message = this.createChatBotMessage(
        "¡Hasta pronto! Si tienes más preguntas, no dudes en regresar."
      );
      this.updateChatBotState(message);
    };
  
    // Responder a la consulta del clima
    handleClimaQuery = () => {
      const message = this.createChatBotMessage(
        "Lo siento, no puedo acceder a los datos climáticos en este momento. ¿Te gustaría saber más sobre nuestras rutas?"
      );
      this.updateChatBotState(message);
    };
  
    // Actualizar el estado del chatbot
    updateChatBotState = (message) => {
        this.setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, message],
        }));
      };
    }
    
    export default ActionProvider;