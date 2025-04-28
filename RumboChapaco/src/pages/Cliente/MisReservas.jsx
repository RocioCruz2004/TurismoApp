import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../data/firebaseConfig";
import { ref, get } from "firebase/database";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
// Importar los estilos
import "../../assets/styles/components/MisReservas.css";
import { Footer } from "../../components/Footer";

export function MisReservas() {
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [rutas, setRutas] = useState({});

  useEffect(() => {
    const obtener = async () => {
      // Obtener reservas
      const snapReservas = await get(ref(db, "reservas"));
      if (snapReservas.exists()) {
        const data = Object.values(snapReservas.val());
        const soloMias = data.filter(r => r.usuarioId === id);
        setReservas(soloMias);
      }
      
      // Obtener información de rutas para mostrar el nombre
      const snapRutas = await get(ref(db, "rutas"));
      if (snapRutas.exists()) {
        setRutas(snapRutas.val());
      }
    };
    obtener();
  }, [id]);

  // Formatear fecha para mejor visualización
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-BO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <NavbarCliente />
      <div className="mis-reservas-container">
        <h2 className="mis-reservas-titulo">Mis Reservas</h2>
        
        {reservas.length === 0 ? (
          <div className="no-reservas">
            <p>No tienes reservas registradas.</p>
            <p>¡Explora nuestras rutas y vive la experiencia Rumbo Chapacho!</p>
          </div>
        ) : (
          reservas.map((res, i) => (
            <div key={i} className="reserva-card">
              <p><strong>Ruta:</strong> {rutas[res.idRuta]?.nombre || `Ruta ${res.idRuta}`}</p>
              <p><strong>Fecha para la Reserva:</strong> {formatearFecha(res.fecha)}</p>
              <p><strong>Hora:</strong> {res.hora}</p>
              <p><strong>Cantidad de personas:</strong> {res.cantidadPersonas}</p>
              <p className="reserva-monto"><strong>Total:</strong> Bs. {res.monto}</p>
              <p><strong>Fecha en que se reservó:</strong> {formatearFecha(res.fechaCreado)}</p>
            </div>
          ))
        )}

        <div className="cambios-section">
          <h3 className="cambios-titulo">¿Cambios o cancelaciones?</h3>
          <p className="cambios-info">Para modificar una reserva, acércate a nuestras oficinas en:</p>
          <div className="mapa-container">
            <iframe
              title="Ubicación oficina"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3811.840709929712!2d-64.73430802569324!3d-21.53521548017317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x93e9516a45786375%3A0xa3ff215b3c6e91a7!2sPlaza%20Luis%20de%20Fuentes%20y%20Vargas!5e0!3m2!1ses!2sbo!4v1682939835632"
              width="100%"
              height="300"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}