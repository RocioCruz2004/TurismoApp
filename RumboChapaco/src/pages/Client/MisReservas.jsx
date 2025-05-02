import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import "../../assets/styles/components/MisReservas.css";
import { Footer } from "../../components/common/Footer";

// Importar Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importar L para crear el ícono del marcador
import "leaflet/dist/leaflet.css";
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23FF5B61" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>',
  iconSize: [45, 45], // Tamaño del ícono
  iconAnchor: [12, 24], // Donde se ancla el ícono
  popupAnchor: [0, -24]  // Posición del Popup respecto al ícono
});

export function MisReservas() {
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [rutas, setRutas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const [snapReservas, snapRutas] = await Promise.all([
          get(ref(db, "reservas")),
          get(ref(db, "rutas"))
        ]);

        if (snapReservas.exists()) {
          const todasLasReservas = snapReservas.val();
          const misReservas = Object.entries(todasLasReservas)
            .filter(([_, reserva]) => reserva.usuarioId === id)
            .map(([key, reserva]) => ({
              ...reserva,
              id: key
            }))
            .sort((a, b) => new Date(b.fechaCreado) - new Date(a.fechaCreado));
          
          setReservas(misReservas);
        }

        if (snapRutas.exists()) {
          setRutas(snapRutas.val());
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Hubo un problema al cargar tus reservas. Por favor, intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, [id]);

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <NavbarCliente />
        <div className="loader">
          <p>Cargando tus reservas...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarCliente />
        <div className="error-message">
          <p>{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarCliente />
      <div className="mis-reservas-container">
        <h2 className="mis-reservas-titulo">Mis Reservas</h2>
        
        {reservas.length === 0 ? (
          <div className="no-reservas">
            <p>No tienes reservas registradas</p>
            <p>¡Explora nuestras rutas y vive la experiencia Rumbo Chapaco!</p>
          </div>
        ) : (
          <div className="reservas-grid">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reserva-card">
                <p>
                  <strong>Ruta</strong>
                  {rutas[reserva.idRuta]?.nombre || `Ruta ${reserva.idRuta}`}
                </p>
                <p>
                  <strong>Fecha de la Reserva</strong>
                  {formatearFecha(reserva.fecha)}
                </p>
                <p>
                  <strong>Hora</strong>
                  {reserva.hora}
                </p>
                <p>
                  <strong>Cantidad de Personas</strong>
                  {reserva.cantidadPersonas}
                </p>
                <p className="reserva-monto">
                  <strong>Total</strong>
                  Bs. {reserva.monto}
                </p>
                <p>
                  <strong>Fecha de Reservación</strong>
                  {formatearFecha(reserva.fechaCreado)}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="cambios-section">
          <h3 className="cambios-titulo">¿Necesitas hacer cambios?</h3>
          <p className="cambios-info">
            Para modificar o cancelar una reserva, visítanos en nuestras oficinas:
          </p>
          <div className="mapa-container">
            {/* Mapa con Leaflet */}
            <MapContainer 
              center={[-21.53359899925681, -64.73415509196471]} // Coordenadas del mapa
              zoom={18} 
              style={{ width: "100%", height: "400px" }} // Definir tamaño del mapa
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Colocamos el marcador con el ícono rojo personalizado */}
              <Marker 
                position={[-21.53359899925681, -64.73415509196471]} 
                icon={redIcon} // Usamos el ícono rojo aquí
              >
                <Popup>
                  <strong>Oficina Rumbo Chapaco</strong><br />
                  Dirección: Plaza Luis de Fuentes y Vargas
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
