import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
import { auth, db } from "../../data/firebaseConfig";
import { get, ref, update } from "firebase/database";
import { sendPasswordResetEmail } from "firebase/auth";
import "../../assets/styles/components/MiPerfil.css";
import { Footer } from "../../components/Footer.jsx"; // Asegúrate de que la ruta es correcta

export function MiPerfil() {
  const { id } = useParams(); // UID del usuario
  const [datos, setDatos] = useState({});
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const obtenerDatos = async () => {
      const refUsuario = ref(db, `usuarios/${id}`);
      const snap = await get(refUsuario);
      if (snap.exists()) {
        const userData = snap.val();
        setDatos(userData);
        setNombre(userData.nombre);
        setTelefono(userData.telefono);
      }
    };
    obtenerDatos();
  }, [id]);

  const actualizarPerfil = async () => {
    await update(ref(db, `usuarios/${id}`), {
      nombre,
      telefono
    });
    alert("Perfil actualizado ✅");
  };

  const cambiarContrasena = async () => {
    try {
      await sendPasswordResetEmail(auth, datos.correo);
      alert("Te enviamos un correo para cambiar tu contraseña 🔒");
    } catch (error) {
      alert("Hubo un error al enviar el correo ❌");
    }
  };

  return (
    <>
      <NavbarCliente />
      <div className="main-content">
        <div className="mi-perfil-container">
          <h3>Actualizar Datos</h3>
          <h2>Mi Perfil</h2>
          <p><strong>Correo:</strong> {datos.correo}</p>
          <input 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            placeholder="Nombre" 
          />
          <input 
            value={telefono} 
            onChange={(e) => setTelefono(e.target.value)} 
            placeholder="Teléfono" 
          />
          <button onClick={actualizarPerfil}>Guardar Cambios</button>
          <br /><br />
          <button onClick={cambiarContrasena}>Cambiar Contraseña</button>
        </div>
      </div>

      {/* Footer al final */}
      <Footer />
    </>
  );
}
