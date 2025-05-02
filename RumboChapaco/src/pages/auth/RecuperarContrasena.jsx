import { useState } from "react";
import { auth } from "../../data/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import "../../assets/styles/components/recuperarContrasena.css";

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
      <div className="recuperar-left">
        <Link to="/login" className="back-link">
          <FaArrowLeft size={24} />
          <span>Volver al login</span>
        </Link>
        <div className="login-left-content">
          <h1>Rumbo Chapaco</h1>
          <p>Descubre la magia de Tarija</p>
        </div>
      </div>
      <div className="recuperar-right">
        <h2>Recuperar Contraseña</h2>
        <p>
          Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>
        <form onSubmit={enviarRecuperacion}>
          <div className="input-group">
            <FaEnvelope className="icon" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar instrucciones</button>
        </form>
      </div>
    </div>
  );
}