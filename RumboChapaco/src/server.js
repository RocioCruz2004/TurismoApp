// backend/src/server.js
import express from "express";
import cors from "cors"; // Para manejar las peticiones entre el frontend y el backend
import { config } from "dotenv"; // Si usas variables de entorno
import "./utils/cronJobs.js";  // Importar y ejecutar el cron job

const app = express();
const port = process.env.PORT || 3001;  // Usar el puerto 3001 por defecto

// Habilitar CORS para permitir peticiones del frontend (React)
app.use(cors());

// Una ruta básica para verificar que el servidor esté corriendo
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando correctamente!");
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
