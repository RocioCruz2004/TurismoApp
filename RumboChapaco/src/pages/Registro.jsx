import { useState } from "react";
import { auth, db } from "../data/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaPhoneAlt, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa"; // Iconos de usuario, correo, teléfono, ojo y flecha
import "../assets/styles/components/registro.css";

export function Registro() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
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
          <FaArrowLeft size={32} color="white" />
        </Link>
      </div>
      <div className="registro-right">
        <h2>REGISTRO</h2>
        <form onSubmit={registrarUsuario}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaPhoneAlt className="icon" />
            <input
              type="text"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
            />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button type="submit">Registrarse</button>
        </form>

        <div className="links-registro">
          <p><Link to="/login">¿Ya tienes una cuenta? Iniciar sesión</Link></p>
        </div>
      </div>
    </div>
  );
}
