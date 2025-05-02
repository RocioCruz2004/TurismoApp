import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import { auth, db } from "../../data/firebaseConfig";
import { get, ref, update } from "firebase/database";
import { sendPasswordResetEmail } from "firebase/auth";
import "../../assets/styles/components/MiPerfil.css";
import { Footer } from "../../components/common/Footer";
import { FaUser, FaEnvelope, FaPhone, FaKey, FaSave } from 'react-icons/fa';

export function MiPerfil() {
  const { id } = useParams();
  const [datos, setDatos] = useState({});
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const refUsuario = ref(db, `usuarios/${id}`);
        const snap = await get(refUsuario);
        if (snap.exists()) {
          const userData = snap.val();
          setDatos(userData);
          setNombre(userData.nombre);
          setTelefono(userData.telefono);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("Error al cargar los datos del perfil");
      }
    };
    obtenerDatos();
  }, [id]);

  const actualizarPerfil = async () => {
    try {
      setIsLoading(true);
      await update(ref(db, `usuarios/${id}`), {
        nombre,
        telefono
      });
      alert("¡Perfil actualizado exitosamente! ✅");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const cambiarContrasena = async () => {
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, datos.correo);
      alert("Te hemos enviado un correo para cambiar tu contraseña 🔒");
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("Error al enviar el correo de cambio de contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavbarCliente />
      <div className="main-content">
        <div className="mi-perfil-container">
          <div className="perfil-header">
            <h2>Mi Perfil</h2>
          </div>
          
          <div className="perfil-form">
            <div className="correo-display">
              <FaEnvelope /> <strong>Correo:</strong> {datos.correo}
            </div>

            <div className="form-group">
              <label htmlFor="nombre">
                <FaUser /> Nombre
              </label>
              <input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefono">
                <FaPhone /> Teléfono
              </label>
              <input
                id="telefono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Tu número de teléfono"
              />
            </div>

            <div className="buttons-container">
              <button 
                className="btn btn-primary"
                onClick={actualizarPerfil}
                disabled={isLoading}
              >
                <FaSave /> Guardar Cambios
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={cambiarContrasena}
                disabled={isLoading}
              >
                <FaKey /> Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
