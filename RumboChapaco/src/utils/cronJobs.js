// backend/src/utils/cronJobs.js
import cron from "node-cron";
import { get } from "firebase/database";  // Usamos Firebase para acceder a las reservas
import { ref } from "firebase/database";
import { db } from "../../data/firebaseConfig"; // Configuración de Firebase
import { sendReminderEmail } from "./emailService"; // Importamos la función para enviar el correo

// Programar el cron job para que se ejecute cada hora
cron.schedule("0 * * * *", async () => {
  console.log("Verificando reservas para enviar recordatorios...");

  try {
    const reservasSnap = await get(ref(db, "reservas"));
    if (reservasSnap.exists()) {
      const reservas = reservasSnap.val();
      const ahora = new Date();

      Object.entries(reservas).forEach(([id, reserva]) => {
        const fechaReserva = new Date(reserva.fecha + " " + reserva.hora); // Se asume que fecha y hora están combinadas en la reserva
        const diferenciaHoras = (fechaReserva - ahora) / 1000 / 60 / 60; // Diferencia en horas

        // Si la diferencia es de 2 horas, enviar el recordatorio
        if (diferenciaHoras <= 2 && diferenciaHoras > 1) {
          sendReminderEmail(reserva.email, reserva.nombreRuta, `${reserva.fecha} a las ${reserva.hora}`);
        }
      });
    }
  } catch (error) {
    console.log("Error al verificar las reservas: ", error);
  }
});
