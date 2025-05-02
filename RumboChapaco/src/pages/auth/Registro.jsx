import { useState } from "react";
import { auth, db } from "../../data/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhoneAlt, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../../assets/styles/components/registro.css";

export function Registro() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const registrarUsuario = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, contraseña);
      const uid = userCred.user.uid;

      await set(ref(db, `usuarios/${uid}`), {
        nombre,
        correo: email,
        telefono,
        rol: "cliente"
      });

      alert("Registro exitoso ✅");
      navigate("/login");
    } catch (error) {
      alert("Error en el registro ❌: " + error.message);
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-left">
        <Link to="/login" className="back-link">
          <FaArrowLeft size={24} />
          <span>Volver al login</span>
        </Link>
        <div className="login-left-content">
          <h1>Rumbo Chapaco</h1>
          <p>Descubre la magia de Tarija</p>
        </div>
      </div>
      <div className="registro-right">
        <h2>Crear cuenta</h2>
        <form onSubmit={registrarUsuario}>
          <div className="input-group">
            <FaUser className="icon" size={18} />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
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
          <div className="input-group">
            <FaPhoneAlt className="icon" size={18} />
            <input
              type="tel"
              placeholder="Número de teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </div>
          </div>
          <button type="submit">Crear cuenta</button>
        </form>

        <div className="links-registro">
          <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}
