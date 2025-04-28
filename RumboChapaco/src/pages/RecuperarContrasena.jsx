import { useState } from "react";
import { auth } from "../data/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../assets/styles/components/recuperarContrasena.css";

export function RecuperarContrasena() {
  const [email, setEmail] = useState("");

  const enviarRecuperacion = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Correo enviado ✅ Revisa tu bandeja para restablecer tu contraseña.");
    } catch (error) {
      alert("Error al enviar el correo ❌: " + error.message);
    }
  };

  return (
    <div className="recuperar-wrapper">
      <Link to="/login" className="back-link">
        <FaArrowLeft size={32} color="white" />
      </Link>
      <div className="recuperar-container">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={enviarRecuperacion}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Tu correo registrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar correo de recuperación</button>
        </form>
      </div>
    </div>
  );
}