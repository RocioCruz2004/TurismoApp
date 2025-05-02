//import { HF_API_URL, HF_API_TOKEN, SYSTEM_PROMPT } from '../config/huggingface';

// Sistema de respuestas predefinidas para Rumbo Chapaco
const predefinedResponses = {
  // Saludos y despedidas
  saludos: {
    hola: '¡Hola! Bienvenido a Rumbo Chapaco. ¿En qué puedo ayudarte hoy?',
    buenosDias: '¡Buenos días! ¿Cómo puedo ayudarte con tu viaje por Tarija?',
    buenasTardes: '¡Buenas tardes! ¿En qué puedo asistirte con tu experiencia turística?',
    buenasNoches: '¡Buenas noches! Estoy aquí para ayudarte con cualquier consulta sobre nuestros servicios.'
  },

  // Información general de Rumbo Chapaco
  empresa: {
    general: 'Rumbo Chapaco es una empresa de turismo especializada en mostrar la belleza y cultura de Tarija. Ofrecemos tours personalizados, transporte seguro y guías expertos.',
    mision: 'Nuestra misión es promover el turismo sostenible en Tarija, mostrando su riqueza cultural, gastronómica y natural.',
    experiencia: 'Con más de 10 años de experiencia, hemos llevado a miles de turistas a descubrir los rincones más hermosos de Tarija.'
  },

  // Rutas turísticas principales
  rutas: {
    general: 'Ofrecemos varias rutas turísticas: Ruta del Vino, Valle de la Concepción, Cordillera de Sama, y más. ¿Cuál te interesa conocer?',
    vino: {
      descripcion: 'La Ruta del Vino te lleva por las mejores bodegas de Tarija, donde podrás degustar vinos y singanis de alta calidad.',
      duracion: 'Duración: 4-6 horas',
      incluye: 'Incluye: Transporte, guía, degustaciones y almuerzo típico',
      precio: 'Precio: Bs. 250 por persona'
    },
    valle: {
      descripcion: 'El Valle de la Concepción es famoso por sus viñedos y paisajes. Visita bodegas tradicionales y disfruta de la gastronomía local.',
      duracion: 'Duración: 5-7 horas',
      incluye: 'Incluye: Transporte, guía, degustaciones y almuerzo',
      precio: 'Precio: Bs. 280 por persona'
    },
    sama: {
      descripcion: 'La Cordillera de Sama ofrece paisajes impresionantes, lagunas y una rica biodiversidad. Ideal para amantes de la naturaleza.',
      duracion: 'Duración: 8-10 horas',
      incluye: 'Incluye: Transporte, guía, almuerzo y equipo básico',
      precio: 'Precio: Bs. 300 por persona'
    }
  },

  // Horarios y disponibilidad
  horarios: {
    general: 'Nuestros tours salen diariamente. La Ruta del Vino y Valle de la Concepción tienen salidas a las 9:00 AM y 2:00 PM. La Cordillera de Sama sale a las 7:00 AM.',
    vino: 'Salidas: 9:00 AM y 2:00 PM',
    valle: 'Salidas: 9:00 AM y 2:00 PM',
    sama: 'Salida única: 7:00 AM'
  },

  // Reservas y pagos
  reservas: {
    general: 'Para reservar, puedes contactarnos por WhatsApp al +591 12345678, por teléfono al 123-456-789 o visitar nuestra oficina en Calle Madrid #123, Tarija.',
    proceso: 'Proceso de reserva: 1) Elige tu ruta 2) Selecciona fecha 3) Indica número de personas 4) Realiza el pago',
    pagos: 'Aceptamos: Efectivo, transferencias bancarias y tarjetas de crédito/débito',
    cancelacion: 'Política de cancelación: Reembolso del 100% con 48 horas de anticipación, 50% con 24 horas'
  },

  // Información de Tarija
  tarija: {
    general: 'Tarija es conocida como la "Andalucía de Bolivia" por su clima templado, viñedos y arquitectura colonial. Es famosa por su vino, singani y gastronomía.',
    clima: 'Clima: Templado todo el año, con temperaturas entre 15°C y 25°C',
    gastronomia: 'Platos típicos: Saice, Ranga Ranga, Chancho a la Cruz, Empanadas de Queso',
    cultura: 'Eventos importantes: Fiesta de la Vendimia (Marzo), Festival de la Uva (Enero)'
  },

  // Contacto y ubicación
  contacto: {
    general: 'Puedes contactarnos por:',
    telefono: 'Teléfono: 123-456-789',
    whatsapp: 'WhatsApp: +591 12345678',
    email: 'Email: info@rumbochapaco.com',
    direccion: 'Dirección: Calle Madrid #123, Tarija, Bolivia',
    horario: 'Horario de atención: Lunes a Sábado de 9:00 AM a 6:00 PM'
  }
};

// Función para encontrar la mejor respuesta
const findBestResponse = (message) => {
  const lowerMessage = message.toLowerCase();
  
  // Saludos
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas')) {
    return predefinedResponses.saludos.hola;
  }

  // Información de la empresa
  if (lowerMessage.includes('empresa') || lowerMessage.includes('quienes son') || lowerMessage.includes('qué es')) {
    return predefinedResponses.empresa.general;
  }

  // Rutas turísticas
  if (lowerMessage.includes('ruta') || lowerMessage.includes('tour') || lowerMessage.includes('viaje')) {
    if (lowerMessage.includes('vino')) {
      return `${predefinedResponses.rutas.vino.descripcion}\n${predefinedResponses.rutas.vino.duracion}\n${predefinedResponses.rutas.vino.incluye}\n${predefinedResponses.rutas.vino.precio}`;
    }
    if (lowerMessage.includes('valle') || lowerMessage.includes('concepción')) {
      return `${predefinedResponses.rutas.valle.descripcion}\n${predefinedResponses.rutas.valle.duracion}\n${predefinedResponses.rutas.valle.incluye}\n${predefinedResponses.rutas.valle.precio}`;
    }
    if (lowerMessage.includes('sama')) {
      return `${predefinedResponses.rutas.sama.descripcion}\n${predefinedResponses.rutas.sama.duracion}\n${predefinedResponses.rutas.sama.incluye}\n${predefinedResponses.rutas.sama.precio}`;
    }
    return predefinedResponses.rutas.general;
  }

  // Horarios
  if (lowerMessage.includes('hora') || lowerMessage.includes('horario') || lowerMessage.includes('salida')) {
    return predefinedResponses.horarios.general;
  }

  // Reservas
  if (lowerMessage.includes('reserva') || lowerMessage.includes('reservar') || lowerMessage.includes('pagar')) {
    return `${predefinedResponses.reservas.general}\n${predefinedResponses.reservas.proceso}\n${predefinedResponses.reservas.pagos}\n${predefinedResponses.reservas.cancelacion}`;
  }

  // Información de Tarija
  if (lowerMessage.includes('tarija') || lowerMessage.includes('ciudad')) {
    return `${predefinedResponses.tarija.general}\n${predefinedResponses.tarija.clima}\n${predefinedResponses.tarija.gastronomia}\n${predefinedResponses.tarija.cultura}`;
  }

  // Contacto
  if (lowerMessage.includes('contacto') || lowerMessage.includes('teléfono') || lowerMessage.includes('dirección')) {
    return `${predefinedResponses.contacto.general}\n${predefinedResponses.contacto.telefono}\n${predefinedResponses.contacto.whatsapp}\n${predefinedResponses.contacto.email}\n${predefinedResponses.contacto.direccion}\n${predefinedResponses.contacto.horario}`;
  }

  // Respuesta por defecto
  return 'Puedo ayudarte con información sobre nuestras rutas turísticas, precios, horarios, reservas y más. ¿Sobre qué tema te gustaría saber?';
};

export const getChatResponse = async (message) => {
  return findBestResponse(message);
}; 