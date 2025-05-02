import { useEffect, useState } from "react";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { useParams, Link } from "react-router-dom";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import { FaMapMarkedAlt, FaClock, FaMoneyBillWave, FaStar, FaArrowRight, FaSearch } from "react-icons/fa";
import "../../assets/styles/components/RutasDisponibles.css";
import { Footer } from "../../components/common/Footer";

export function RutasDisponibles() {
  const { id } = useParams();
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRutas, setFilteredRutas] = useState([]);

  useEffect(() => {
    const obtenerRutas = async () => {
      try {
        const rutasRef = ref(db, "rutas");
        const snapshot = await get(rutasRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arrayRutas = Object.entries(data)
            .map(([key, value]) => ({
              id: key,
              ...value
            }))
            .filter(ruta => ruta.estado === "activo");
          setRutas(arrayRutas);
          setFilteredRutas(arrayRutas);
        }
      } catch (error) {
        console.error("Error al cargar las rutas:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerRutas();
  }, []);

  useEffect(() => {
    const filtered = rutas.filter(ruta =>
      ruta.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ruta.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRutas(filtered);
  }, [searchTerm, rutas]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando rutas disponibles...</p>
      </div>
    );
  }

  return (
    <>
      <NavbarCliente />
      <div className="rutas-disponibles-wrapper">
        <section className="rutas-disponibles-header">
          <div className="header-overlay">
            <div className="header-content">
              <h1>Explora Nuestras Rutas</h1>
              <p>Descubre las mejores experiencias turísticas en Tarija</p>
            </div>
          </div>
        </section>

        <div className="search-container">
          <div className="search-box">
            <div className="search-icon-wrapper">
              <FaSearch className="search-icon" />
            </div>
            <input
              type="text"
              placeholder="Buscar rutas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <p className="results-count">
            {filteredRutas.length} {filteredRutas.length === 1 ? 'ruta encontrada' : 'rutas encontradas'}
          </p>
        </div>

        <section className="rutas-disponibles-container">
          <div className="rutas-grid">
            {filteredRutas.map((ruta) => (
              <div key={ruta.id} className="ruta-card">
                <div className="ruta-card-image">
                  <img src={ruta.imagen} alt={ruta.nombre} />
                  <div className="ruta-card-badges">
                    <div className="badges-container">
                      <span className="duration-badge">
                        <FaClock /> {ruta.duracion}
                      </span>
                      <span className="difficulty-badge">
                        <FaStar /> {ruta.dificultad}
                      </span>
                      <span className="price-badge">
                        <FaMoneyBillWave /> Bs. {ruta.precioBs}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ruta-card-content">
                  <h3 className="ruta-title">{ruta.nombre}</h3>
                  <p className="ruta-description">{ruta.descripcion}</p>
                  <Link 
                    to={`/cliente/${id}/rutas/detalleruta/${ruta.id}`}
                    className="details-button"
                  >
                    Ver más información <FaArrowRight />
                  </Link>
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
