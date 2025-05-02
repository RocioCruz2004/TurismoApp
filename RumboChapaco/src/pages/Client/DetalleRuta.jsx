import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import "../../assets/styles/components/DetalleRuta.css";
import { Footer } from "../../components/common/Footer";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaMoneyBillWave, 
  FaRoute, 
  FaInfoCircle, 
  FaCalendarCheck,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSun,
  FaShieldAlt
} from 'react-icons/fa';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useMap } from 'react-leaflet';

// Corregir el ícono de marcador de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: iconShadow
});

// Crear ícono rojo personalizado
const redIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="%23FF5B61" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24]
});

// Función para calcular la distancia entre dos puntos geográficos (usando la fórmula de Haversine)
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Resultado en km
};

// Función para generar puntos intermedios entre dos puntos
const generarPuntosIntermedios = (punto1, punto2, cantidad = 3) => {
  const puntos = [];
  const [lat1, lng1] = punto1;
  const [lat2, lng2] = punto2;
  
  for (let i = 1; i <= cantidad; i++) {
    const fraccion = i / (cantidad + 1);
    const latIntermedio = lat1 + (lat2 - lat1) * fraccion;
    const lngIntermedio = lng1 + (lng2 - lng1) * fraccion;
    puntos.push([latIntermedio, lngIntermedio]);
  }
  
  return puntos;
};

// Función para dividir la ruta en segmentos más pequeños para evitar límites de API
const dividirRutaEnSegmentos = (puntos, maxPuntosPorSegmento = 8) => {
  const segmentos = [];
  
  if (puntos.length <= maxPuntosPorSegmento) {
    segmentos.push(puntos);
    return segmentos;
  }
  
  for (let i = 0; i < puntos.length - 1; i += maxPuntosPorSegmento - 1) {
    const finSegmento = Math.min(i + maxPuntosPorSegmento, puntos.length);
    segmentos.push(puntos.slice(i, finSegmento));
  }
  
  return segmentos;
};

// Componente para manejar el enrutamiento
function RutaLinea({ puntos }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !puntos.length || puntos.length < 2) return;

    const dibujarRuta = async () => {
      try {
        // Crear array para almacenar todas las polilíneas
        const polylines = [];
        
        // Dividir la ruta en segmentos más pequeños para evitar problemas con la API
        const segmentos = dividirRutaEnSegmentos(puntos);
        
        // Para cada segmento...
        for (const segmento of segmentos) {
          try {
            // Generar más puntos intermedios para rutas largas
            let puntosExpandidos = [];
            for (let i = 0; i < segmento.length - 1; i++) {
              puntosExpandidos.push(segmento[i]);
              
              const distancia = calcularDistancia(
                segmento[i][0], segmento[i][1], 
                segmento[i+1][0], segmento[i+1][1]
              );
              
              // Si la distancia es grande, crear puntos intermedios
              if (distancia > 50) {
                // Más puntos para distancias más grandes
                const cantidadPuntos = Math.min(5, Math.ceil(distancia / 50));
                const intermedios = generarPuntosIntermedios(segmento[i], segmento[i+1], cantidadPuntos);
                puntosExpandidos = [...puntosExpandidos, ...intermedios];
              }
            }
            
            // Añadir el último punto del segmento
            puntosExpandidos.push(segmento[segmento.length - 1]);
            
            // Construir la URL de la API con los waypoints
            const waypointsStr = puntosExpandidos
              .slice(1, -1)
              .map((punto) => `&intermediate=${punto[1]},${punto[0]}`)
              .join('');
            
            const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62480c633207a8a940c2acf67e206ea4bcc2&start=${puntosExpandidos[0][1]},${puntosExpandidos[0][0]}&end=${puntosExpandidos[puntosExpandidos.length - 1][1]},${puntosExpandidos[puntosExpandidos.length - 1][0]}${waypointsStr}&geometry_format=geojson`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.features && data.features[0]) {
              const rutaCoords = data.features[0].geometry.coordinates;
              
              // Convertir las coordenadas de [lon, lat] a [lat, lon] para Leaflet
              const rutaConvertida = rutaCoords.map(coord => [coord[1], coord[0]]);
              
              // Crear y añadir la polilínea al mapa
              const polyline = L.polyline(rutaConvertida, {
                color: '#FF5B61',
                weight: 5,
                opacity: 0.8,
                smoothFactor: 1
              }).addTo(map);
              
              polylines.push(polyline);
            }
          } catch (error) {
            console.error('Error al procesar segmento de ruta:', error);
            
            // Si hay error, dibujar líneas directas entre los puntos del segmento como fallback
            for (let i = 0; i < segmento.length - 1; i++) {
              const polyline = L.polyline([segmento[i], segmento[i+1]], {
                color: '#FF5B61',
                weight: 5,
                opacity: 0.8,
                smoothFactor: 1,
                dashArray: '5, 10'  // Línea punteada para indicar que es aproximada
              }).addTo(map);
              
              polylines.push(polyline);
            }
          }
        }
        
        // Crear un grupo con todas las polilíneas para ajustar la vista
        const routeGroup = L.featureGroup(polylines);
        map.fitBounds(routeGroup.getBounds(), { padding: [50, 50] });
        
        // Limpiar al desmontar
        return () => {
          polylines.forEach(polyline => {
            if (map) map.removeLayer(polyline);
          });
        };
      } catch (error) {
        console.error('Error global al obtener la ruta:', error);
        
        // Como último recurso, dibujar líneas directas entre todos los puntos
        const polylines = [];
        
        for (let i = 0; i < puntos.length - 1; i++) {
          const polyline = L.polyline([puntos[i], puntos[i+1]], {
            color: '#FF5B61',
            weight: 5,
            opacity: 0.8,
            smoothFactor: 1,
            dashArray: '5, 10'
          }).addTo(map);
          
          polylines.push(polyline);
        }
        
        const routeGroup = L.featureGroup(polylines);
        map.fitBounds(routeGroup.getBounds(), { padding: [50, 50] });
        
        // Limpiar al desmontar
        return () => {
          polylines.forEach(polyline => {
            if (map) map.removeLayer(polyline);
          });
        };
      }
    };

    dibujarRuta();
  }, [map, puntos]);

  return null;
}

export function DetalleRuta() {
  const { id, idRuta } = useParams();
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuta = async () => {
      try {
        const snap = await get(ref(db, `rutas/${idRuta}`));
        if (snap.exists()) {
          setRuta(snap.val());
        }
      } catch (error) {
        console.error("Error al cargar la ruta:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRuta();
  }, [idRuta]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando ruta...</p>
      </div>
    );
  }

  if (!ruta) {
    return (
      <div className="loading-container">
        <p>No se encontró la ruta solicitada.</p>
      </div>
    );
  }

  const puntos = Object.values(ruta.paradas).map(p => [p.lat, p.lng]);
  const centro = puntos[0];

  const recomendaciones = ruta.precauciones.split('\n').filter(rec => rec.trim());

  const recomendacionesIcons = [
    FaExclamationTriangle,
    FaCheckCircle,
    FaSun,
    FaShieldAlt,
    FaInfoCircle
  ];

  return (
    <>
      <NavbarCliente />
      <div className="detalle-ruta-container">
        <h2 className="map-title">{ruta.nombre}</h2>

        <div className="map-container">
          <MapContainer 
            center={centro} 
            zoom={13}
            bounds={L.latLngBounds(puntos).pad(0.1)}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.entries(ruta.paradas).map(([key, parada], index) => (
              <Marker 
                key={key} 
                position={[parada.lat, parada.lng]}
                icon={redIcon}
              >
                <Popup>
                  <strong>{parada.nombre}</strong>
                  <img src={parada.imagen} alt={parada.nombre} />
                </Popup>
              </Marker>
            ))}
            <RutaLinea puntos={puntos} />
          </MapContainer>
        </div>

        <div className="informacion-ruta">
          <p><strong><FaInfoCircle /> Descripción:</strong> {ruta.descripcion}</p>
          <p><strong><FaClock /> Duración:</strong> {ruta.duracion}</p>
          <p><strong><FaMoneyBillWave /> Precio:</strong> Bs. {ruta.precioBs}</p>
        </div>

        <Link 
          to={`/cliente/${id}/rutas/detalleruta/${idRuta}/reservar/${idRuta}`}
          className="reservar-button"
        >
          <FaCalendarCheck /> Reservar esta ruta
        </Link>

        <div className="detalles-seccion">
          <details>
            <summary>
              <FaRoute /> Paradas/Actividades que tendremos
            </summary>
            <div className="paradas-container">
              {Object.values(ruta.paradas).map((parada, i) => (
                <div key={i} className="parada-item">
                  <img src={parada.imagen} alt={parada.nombre} />
                  <p><FaMapMarkerAlt /> {parada.nombre}</p>
                </div>
              ))}
            </div>
          </details>
        </div>

        <div className="detalles-seccion">
          <details>
            <summary>
              <FaInfoCircle /> Recomendaciones para la Ruta
            </summary>
            <div className="recomendaciones-content">
              {recomendaciones.map((recomendacion, index) => {
                const IconComponent = recomendacionesIcons[index % recomendacionesIcons.length];
                return (
                  <div key={index} className="recomendacion-item">
                    <IconComponent className="recomendacion-icon" />
                    <div className="recomendacion-text">
                      {recomendacion.trim()}
                    </div>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      </div>
      <Footer />
    </>
  );
}