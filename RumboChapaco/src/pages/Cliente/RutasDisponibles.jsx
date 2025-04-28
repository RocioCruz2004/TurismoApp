import { useEffect, useState } from "react";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
import "../../assets/styles/components/RutasDisponibles.css";
import { Footer } from "../../components/Footer";
export function RutasDisponibles() {
  const { id } = useParams(); // UID
  const [rutas, setRutas] = useState([]);

  useEffect(() => {
    const obtenerRutas = async () => {
      const rutasRef = ref(db, "rutas");
      const snapshot = await get(rutasRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arrayRutas = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value
        }));
        setRutas(arrayRutas);
      }
    };
    obtenerRutas();
  }, []);

  return (
    <>
      <NavbarCliente />
      <section className="rutas-disponibles-container">
        <h2 className="rutas-disponibles-title">Rutas Disponibles</h2>
        <div className="rutas-list">
          {rutas.map((ruta) => (
            <div key={ruta.id} className="ruta-card">
              <img src={ruta.imagen} alt={ruta.nombre} className="ruta-card-img" />
              <h3 className="ruta-card-title">{ruta.nombre}</h3>
              <p className="ruta-card-description">{ruta.descripcion}</p>
              <p className="ruta-card-duration">Duración: {ruta.duracion}</p>
              <p className="ruta-card-price">Precio: Bs. {ruta.precioBs}</p>
              <Link to={`/cliente/${id}/rutas/detalleruta/${ruta.id}`} className="ruta-card-link">Ver Detalles</Link>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </>
  );
}
