import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";

// Importa el CSS del PanelCliente
import "../../assets/styles/components/PanelCliente.css";
import { Footer } from "../../components/Footer";



export function PanelCliente() {
  const { id } = useParams(); // UID del usuario
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      const snapRutas = await get(ref(db, "rutas"));
      const snapReservas = await get(ref(db, "reservas"));

      if (snapRutas.exists()) {
        const rutasData = snapRutas.val();
        const rutasArray = Object.entries(rutasData)
          .filter(([_, val]) => val.estado === "activo")
          .map(([idRuta, data]) => ({ idRuta, ...data }));
        setRutas(rutasArray);
      }

      if (snapReservas.exists()) {
        const reservasData = Object.values(snapReservas.val());
        setReservas(reservasData);
      }
    };

    obtenerDatos();
  }, []);

  const contarReservasPorRuta = () => {
    const conteo = {};
    reservas.forEach((res) => {
      conteo[res.idRuta] = (conteo[res.idRuta] || 0) + 1;
    });
    return conteo;
  };

  const obtenerRutasPopulares = () => {
    const conteo = contarReservasPorRuta();
    return rutas
      .map((ruta) => ({
        ...ruta,
        totalReservas: conteo[ruta.idRuta] || 0,
      }))
      .sort((a, b) => b.totalReservas - a.totalReservas)
      .slice(0, 6);
  };

  const rutasPopulares = obtenerRutasPopulares();

  return (
    <>
      <NavbarCliente />

      {/* Imagen de portada con mensaje */}
      <div className="panel-cliente-header">
        <img
          src="https://www.opinion.com.bo/media/opinion/images/2024/08/01/2024080120420424478.jpg"
          alt="Bienvenida"
        />
        <div className="welcome-message">
          <h1>Bienvenido a Tarija</h1>
          <h3>Explora la belleza de la región</h3>
          <button onClick={() => navigate(`/cliente/${id}/rutas`)}>
            Explorar actividades
          </button>
        </div>
      </div>

      {/* Sección de rutas populares */}
      <section className="rutas-populares-section">
        <div className="rutas-populares-header">
          <h2>Rutas Populares</h2>
          <Link to={`/cliente/${id}/rutas`}>Ver todas</Link>
        </div>

        <div className="rutas-populares-container">
          {rutasPopulares.map((ruta) => (
            <div
              key={ruta.idRuta}
              className="ruta-card"
              onClick={() =>
                navigate(`/cliente/${id}/rutas/detalleruta/${ruta.idRuta}`)
              }
            >
              <img
                src={ruta.imagen}
                alt={ruta.nombre}
                className="ruta-card-img"
              />
              <h3>{ruta.nombre}</h3>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </>
  );
}
