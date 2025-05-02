import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, get, push } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { format, isBefore, startOfToday } from 'date-fns';
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import "../../assets/styles/components/AñadirReserva.css";

export function AñadirReserva() {
  const { idAdmin } = useParams();
  const [usuarios, setUsuarios] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [usuarioId, setUsuarioId] = useState("");
  const [idRuta, setIdRuta] = useState("");
  const [ruta, setRuta] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [montoTotal, setMontoTotal] = useState(0);
  const [imagenRuta, setImagenRuta] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      const [usuariosSnap, rutasSnap, reservasSnap] = await Promise.all([
        get(ref(db, "usuarios")),
        get(ref(db, "rutas")),
        get(ref(db, "reservas")),
      ]);

      if (usuariosSnap.exists()) setUsuarios(Object.entries(usuariosSnap.val()).filter(([_, u]) => u.rol === "cliente"));
      if (rutasSnap.exists()) setRutas(Object.entries(rutasSnap.val()));
      if (reservasSnap.exists()) setReservas(Object.values(reservasSnap.val()));
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (idRuta) {
      const rutaElegida = rutas.find(([key]) => key === idRuta)?.[1];
      setRuta(rutaElegida || null);
      if (rutaElegida) {
        setMontoTotal(rutaElegida.precioBs * cantidad);
        setImagenRuta(rutaElegida.imagen || "https://via.placeholder.com/400x250?text=Seleccione+una+ruta");
      }
    }
  }, [idRuta]);

  useEffect(() => {
    if (ruta && cantidad) {
      setMontoTotal(ruta.precioBs * cantidad);
    }
  }, [cantidad, ruta]);

  const generarHoras = () => {
    const horas = [];
    for (let h = 8; h <= 16; h++) {
      horas.push(`${String(h).padStart(2, '0')}:00`);
    }
    return horas;
  };

  const horasDelDia = generarHoras();

  const isFechaDisponible = (date) => {
    if (isBefore(date, startOfToday())) return false;
    const fechaStr = format(date, 'yyyy-MM-dd');
    const reservasDelDia = reservas.filter(r => r.idRuta === idRuta && r.fecha === fechaStr);
    return reservasDelDia.length < horasDelDia.length;
  };

  const horasReservadasHoy = reservas
    .filter(r => r.idRuta === idRuta && r.fecha === (fechaSeleccionada ? format(fechaSeleccionada, "yyyy-MM-dd") : ""))
    .map(r => r.hora);

  const handleReserva = async () => {
    if (!usuarioId || !idRuta || !fechaSeleccionada || !horaSeleccionada || cantidad < 1) {
      alert("Completa todos los campos correctamente");
      return;
    }

    const nuevaReserva = {
      usuarioId,
      idRuta,
      fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
      hora: horaSeleccionada,
      cantidadPersonas: cantidad,
      monto: montoTotal,
      fechaCreado: format(new Date(), "yyyy-MM-dd")
    };

    await push(ref(db, "reservas"), nuevaReserva);
    alert("Reserva añadida correctamente ✅");
    navigate(`/admin/${idAdmin}/reservas`);
  };

  const usuario = usuarioId ? usuarios.find(([id]) => id === usuarioId)?.[1] : null;

  return (
    <>
      <NavbarAdmin />
      <div className="añadir-reserva-container">
        <h2 className="añadir-reserva-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FF5B61">
            <circle cx="12" cy="12" r="10" fill="#FF5B61"/>
            <path d="M8.5 12.5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="2" fill="none"/>
          </svg>
          Añadir Reserva
        </h2>

        <div className="form-container">
        <div className="left-section">
            <div className="image-container">
              {imagenRuta ? (
                <img src={imagenRuta} alt={ruta?.nombre || "Imagen de ruta"} />
              ) : (
                <div className="placeholder-image">
                  <span>Seleccione una ruta para ver la imagen</span>
                </div>
              )}
            </div>
          </div>

          <div className="right-section">
            <form>
              <div className="input-group">
                <label className="info-label">
                  <i className="fas fa-user"></i> Seleccionar Usuario:
                </label>
                <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
                  <option value="">-- Selecciona un usuario --</option>
                  {usuarios.map(([id, u]) => (
                    <option key={id} value={id}>{u.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="info-label">
                  <i className="fas fa-map-marked-alt"></i> Seleccionar Ruta:
                </label>
                <select value={idRuta} onChange={(e) => setIdRuta(e.target.value)}>
                  <option value="">-- Selecciona una ruta --</option>
                  {rutas.map(([id, r]) => (
                    <option key={id} value={id}>{r.nombre}</option>
                  ))}
                </select>
              </div>

              {ruta && (
                <div className="route-info">
                  <div className="route-info-item">
                    <span className="label">Duración:</span>
                    <span className="value">{ruta.duracion}</span>
                  </div>
                  <div className="route-info-item">
                    <span className="label">Precio por persona:</span>
                    <span className="value">Bs. {ruta.precioBs}</span>
                  </div>
                </div>
              )}

              <div className="input-group">
                <label className="info-label">
                  <i className="fas fa-calendar"></i> Seleccionar Fecha:
                </label>
                <DatePicker
                  selected={fechaSeleccionada}
                  onChange={(date) => {
                    setFechaSeleccionada(date);
                    setHoraSeleccionada("");
                  }}
                  minDate={new Date()}
                  filterDate={isFechaDisponible}
                  placeholderText="Selecciona una fecha"
                  locale={es}
                  dateFormat="yyyy-MM-dd"
                  className="date-picker"
                />
              </div>

              <div className="input-group">
                <label className="info-label">
                  <i className="fas fa-clock"></i> Seleccionar Hora:
                </label>
                <select 
                  value={horaSeleccionada} 
                  onChange={(e) => setHoraSeleccionada(e.target.value)}
                  disabled={!fechaSeleccionada}
                  className={!fechaSeleccionada ? "disabled" : ""}
                >
                  <option value="">Selecciona una hora</option>
                  {horasDelDia.map((hora) => {
                    const hoy = new Date();
                    const esHoy = fechaSeleccionada && format(fechaSeleccionada, 'yyyy-MM-dd') === format(hoy, 'yyyy-MM-dd');
                    const horaActual = hoy.getHours();
                    const horaInt = parseInt(hora.split(":")[0]);
                    const yaReservada = horasReservadasHoy.includes(hora);
                    const estaPasada = esHoy && horaInt <= horaActual;
                    return (
                      <option key={hora} value={hora} disabled={yaReservada || estaPasada}>
                        {hora} {yaReservada ? '(No disponible)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="input-group">
                <label className="info-label">
                  <i className="fas fa-users"></i> Cantidad de personas:
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Number(e.target.value))}
                  className="quantity-input"
                />
              </div>

              <div className="total-section">
                <div className="total-text">
                  <span className="total-label">Total a pagar:</span>
                  <span className="total-amount">Bs. {montoTotal}</span>
                </div>
                <button type="button" className="submit-btn" onClick={handleReserva}>
                  Añadir Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}