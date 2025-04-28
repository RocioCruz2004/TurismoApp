import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { format, isBefore, startOfToday } from 'date-fns';
import '../../assets/styles/components/EditarReservaAdmin.css';
import { FaUser, FaMapMarkedAlt, FaClock, FaMoneyBillWave, FaUsers, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

export function EditarReserva() {
  const { idReserva } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [rutas, setRutas] = useState({});
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null);
  const [reservasRuta, setReservasRuta] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [montoTotal, setMontoTotal] = useState(0);
  const [actualizado, setActualizado] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      const [rutasSnap, reservasSnap] = await Promise.all([
        get(ref(db, "rutas")),
        get(ref(db, "reservas"))
      ]);

      if (rutasSnap.exists()) {
        const rutasData = rutasSnap.val();
        setRutas(rutasData);
        setRutaSeleccionada(rutasData[reserva.idRuta]);
      }

      if (reservasSnap.exists()) {
        const reservasData = Object.entries(reservasSnap.val())
          .filter(([id, r]) =>
            r.idRuta === reserva.idRuta &&
            id !== idReserva
          )
          .map(([_, r]) => r);

        setReservasRuta(reservasData);
      }

      // Set valores iniciales
      setFechaSeleccionada(new Date(reserva.fecha));
      setHoraSeleccionada(reserva.hora);
      setCantidad(reserva.cantidadPersonas);
      setMontoTotal(reserva.monto);
    };

    obtenerDatos();
  }, [reserva, idReserva]);

  useEffect(() => {
    if (rutaSeleccionada && cantidad) {
      setMontoTotal(rutaSeleccionada.precioBs * cantidad);
    }
  }, [cantidad, rutaSeleccionada]);

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
    const reservasDelDia = reservasRuta.filter(r => r.fecha === fechaStr);
    const horasReservadas = reservasDelDia.map(r => r.hora);
    return horasReservadas.length < horasDelDia.length;
  };

  const horasReservadasHoy = reservasRuta
    .filter(r => r.fecha === (fechaSeleccionada ? format(fechaSeleccionada, "yyyy-MM-dd") : ""))
    .map(r => r.hora);

  const handleActualizar = async () => {
    if (!fechaSeleccionada || !horaSeleccionada || cantidad < 1) {
      alert("Completa todos los campos correctamente");
      return;
    }

    const actualizada = {
      ...reserva,
      fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
      hora: horaSeleccionada,
      cantidadPersonas: cantidad,
      monto: montoTotal,
    };

    await update(ref(db, `reservas/${idReserva}`), actualizada);
    setActualizado(true);
    setTimeout(() => {
      setActualizado(false);
      navigate(-1);
    }, 1200);
  };

  if (!rutaSeleccionada) return <p>Cargando...</p>;

  return (
    <>
      <NavbarAdmin />
      <div className="editar-reserva-admin-container">
        <h2><FaCheckCircle style={{color:'#FF5B61', marginRight:8, verticalAlign:'middle'}}/>Editar Reserva</h2>
        <div className="editar-reserva-admin-datosruta">
          <div className="editar-reserva-admin-imgwrap">
            <img src={rutaSeleccionada.imagen} alt={rutaSeleccionada.nombre} />
          </div>
          <div className="editar-reserva-admin-datoslist-scroll">
            <div className="editar-reserva-admin-datoslist">
              <p><FaUser className="icon"/> <strong>Usuario:</strong> {reserva.nombreUsuario}</p>
              <p><FaMapMarkedAlt className="icon"/> <strong>Ruta:</strong> {rutaSeleccionada.nombre}</p>
              <p><FaClock className="icon"/> <strong>Duración:</strong> {rutaSeleccionada.duracion}</p>
              <p><FaMoneyBillWave className="icon"/> <strong>Precio/persona:</strong> Bs. {rutaSeleccionada.precioBs}</p>
            </div>
            <hr />
            <label><FaCalendarAlt className="icon"/> Seleccionar Fecha:</label>
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
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
            <label><FaClock className="icon"/> Seleccionar Hora:</label>
            <select value={horaSeleccionada} onChange={(e) => setHoraSeleccionada(e.target.value)}>
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
                    {hora}
                  </option>
                );
              })}
            </select>
            <label><FaUsers className="icon"/> Cantidad de personas:</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
            />
            <p className="editar-reserva-admin-total"><FaMoneyBillWave className="icon"/> <strong>Total a pagar:</strong> Bs. {montoTotal}</p>
            <button onClick={handleActualizar} disabled={actualizado}>
              {actualizado ? <><FaCheckCircle style={{marginRight:8}}/>¡Actualizado!</> : "Actualizar Reserva"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
