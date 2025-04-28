import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
import "../../assets/styles/components/DetalleRuta.css";

// para mapa (Leaflet)
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

export function DetalleRuta() {
  const { id, idRuta } = useParams();
  const [ruta, setRuta] = useState(null);
  const [mostrarParadas, setMostrarParadas] = useState(false);
  const [mostrarRecomendaciones, setMostrarRecomendaciones] = useState(false);

  useEffect(() => {
    const fetchRuta = async () => {
      const snap = await get(ref(db, `rutas/${idRuta}`)); 
      if (snap.exists()) {
        setRuta(snap.val());
      }
    };
    fetchRuta();
  }, [idRuta]);

  if (!ruta) return <p>Cargando ruta...</p>;

  const puntos = Object.values(ruta.paradas).map(p => [p.lat, p.lng]);

  return (
    <>
      <NavbarCliente />
      <div className="detalle-ruta-container">
        {/* Titulo de la Ruta - Arriba del mapa */}
        <h2 className="map-title">{ruta.nombre}</h2> {/* Título sobre el mapa */}

        {/* Contenedor para el mapa */}
        <div className="map-container">
          <MapContainer center={puntos[0]} zoom={12} style={{ height: "400px", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.entries(ruta.paradas).map(([key, parada], index) => (
              <Marker key={key} position={[parada.lat, parada.lng]}>
                <Popup>
                  <strong>{parada.nombre}</strong><br />
                  <img src={parada.imagen} alt={parada.nombre} width="100" />
                </Popup>
              </Marker>
            ))}
            <Polyline positions={puntos} color="red" />
          </MapContainer>
        </div>

        {/* Descripción, Duración y Precio */}
        <div className="informacion-ruta">
          <p><strong>Descripción:</strong> {ruta.descripcion}</p>
          <p><strong>Duración:</strong> {ruta.duracion}</p>
          <p><strong>Precio:</strong> Bs. {ruta.precioBs}</p>
        </div>

        {/* Botón de reserva */}
        <Link to={`/cliente/${id}/rutas/detalleruta/${idRuta}/reservar/${idRuta}`}>
          <button>Reservar esta ruta</button>
        </Link>
      </div>

      {/* Sección de "Paradas/Actividades que tendremos" */}
      <div className="detalles-seccion">
        <details open={mostrarParadas} onClick={() => setMostrarParadas(!mostrarParadas)}>
          <summary>Paradas/Actividades que tendremos:</summary>
          <div className="paradas-container">
            {Object.values(ruta.paradas).map((parada, i) => (
              <div key={i} className="parada-item">
                <img src={parada.imagen} alt={parada.nombre} />
                <p>{parada.nombre}</p>
              </div>
            ))}
          </div>
        </details>
      </div>

      {/* Sección de "Recomendaciones para la Ruta" */}
      <div className="detalles-seccion">
        <details open={mostrarRecomendaciones} onClick={() => setMostrarRecomendaciones(!mostrarRecomendaciones)}>
          <summary>Recomendaciones para la Ruta:</summary>
          <p>{ruta.precauciones}</p>
        </details>
      </div>
    </>
  );
}
