import { auth, db } from "../../data/firebaseConfig";  
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";  
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../../assets/styles/components/login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, contraseña);
      const uid = userCred.user.uid;

      // Llamada a la base de datos
      const userRef = ref(db, `usuarios/${uid}`);  
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const datos = snapshot.val();
        // Lógica para redirigir según el rol del usuario (admin o cliente)
        if (datos.rol === "admin") {
          navigate(`/admin/${uid}`); 
        } else {
          navigate(`/cliente/${uid}`); 
        }
      } else {
        alert("El usuario no está registrado en la base de datos");
      }
    } catch (error) {
      alert("Error al iniciar sesión ❌: " + error.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <Link to="/" className="back-link">
          <FaArrowLeft size={24} />
          <span>Volver al inicio</span>
        </Link>
        <div className="login-left-content">
          <h1>Rumbo Chapaco</h1>
          <p>Descubre la magia de Tarija</p>
        </div>
      </div>
      <div className="login-right">
        <h2>Bienvenido de nuevo</h2>
        <form onSubmit={iniciarSesion}>
          <div className="input-group">
            <FaUser className="icon" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit">Iniciar Sesión</button>
        </form>

        <div className="links-login">
          <p><Link to="/recuperar">¿Olvidaste tu contraseña?</Link></p>
          <p>¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}
