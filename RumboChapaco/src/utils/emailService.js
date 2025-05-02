// backend/src/utils/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",  // Usar el servicio de correo que prefieras (por ejemplo, Gmail, SendGrid, etc.)
  auth: {
    user: "rocio.cruz.rcz@gmail.com",  // Tu correo de Gmail
    pass: "npuv gvgk opmb bcbd"  // Contraseña o token de la aplicación
  }
});

const sendReminderEmail = (email, nombreRuta, fechaReserva) => {
  const mailOptions = {
    from: "rocio.cruz.rcz@gmail.com",  // Remitente
    to: email,  // Destinatario
    subject: "Recordatorio de tu reserva en Rumbo Chapaco",  // Asunto
    text: `¡Hola! Te recordamos que tienes una reserva para la ruta ${nombreRuta} el ${fechaReserva}. Nos vemos pronto en Rumbo Chapaco. ¡Disfruta tu experiencia!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo: ", error);
    } else {
      console.log("Correo enviado: " + info.response);
    }
  });
};

export { sendReminderEmail };
