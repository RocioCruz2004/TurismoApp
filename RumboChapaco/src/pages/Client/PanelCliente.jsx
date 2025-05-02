import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import { FaArrowRight, FaMapMarkerAlt, FaStar, FaUsers, FaClock } from "react-icons/fa";
import { Footer } from "../../components/common/Footer";

// Importa el CSS del PanelCliente
import "../../assets/styles/components/PanelCliente.css";

export function PanelCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
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
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <>
      <NavbarCliente />
      <div className="panel-cliente-wrapper">
        {/* Hero Section */}
        <div className="panel-cliente-hero-section">
          <div className="panel-cliente-hero-overlay"></div>
          <div className="panel-cliente-hero-content">
            <h1>Descubre Tarija</h1>
            <p>El mejor destino turístico de Bolivia</p>
            <button 
              className="panel-cliente-hero-button"
              onClick={() => navigate(`/cliente/${id}/rutas`)}
            >
              Explorar rutas
            </button>
          </div>
        </div>

        {/* Rutas Populares Section */}
        <section className="panel-cliente-rutas-section">
          <div className="panel-cliente-section-header">
            <h2>Rutas Populares</h2>
            <Link to={`/cliente/${id}/rutas`} className="panel-cliente-view-all">
              Ver todas <FaArrowRight />
            </Link>
          </div>

          <div className="panel-cliente-rutas-grid">
            {rutasPopulares.map((ruta) => (
              <div
                key={ruta.idRuta}
                className="panel-cliente-ruta-card"
                onClick={() => navigate(`/cliente/${id}/rutas/detalleruta/${ruta.idRuta}`)}
              >
                <div className="panel-cliente-ruta-image">
                  <img src={ruta.imagen} alt={ruta.nombre} />
                </div>
                <div className="panel-cliente-ruta-info">
                  <h3>{ruta.nombre}</h3>
                  <div className="panel-cliente-ruta-meta">
                    <span><FaUsers /> {ruta.totalReservas}</span>
                    <span><FaClock /> {ruta.duracion}</span>
                    <span className="difficulty"><FaStar /> {ruta.dificultad}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}