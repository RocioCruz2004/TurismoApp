import { auth, db } from "../data/firebaseConfig";  // Importa 'db' correctamente
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";  // Asegúrate de que 'ref' y 'get' estén importados desde Firebase
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import "../assets/styles/components/login.css";

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
      const userRef = ref(db, `usuarios/${uid}`);  // Asegúrate de que esta línea sea correcta
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const datos = snapshot.val();
        // Lógica para redirigir según el rol del usuario (admin o cliente)
        if (datos.rol === "admin") {
          navigate(`/admin/${uid}`); // Redirigir a la página de admin
        } else {
          navigate(`/cliente/${uid}`); // Redirigir a la página de cliente
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
          <FaArrowLeft size={32} color="white" />
        </Link>
      </div>
      <div className="login-right">
        <h2>INICIAR SESIÓN</h2>
        <form onSubmit={iniciarSesion}>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <button type="submit">INICIAR SESIÓN</button>
        </form>

        <div className="links-login">
          <p><Link to="/recuperar">¿Olvidaste la contraseña?</Link></p>
          <p><Link to="/registro">No tienes una cuenta?</Link></p>
        </div>
      </div>
    </div>
  );
}
