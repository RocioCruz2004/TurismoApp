import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, get, push } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale';
import { format, isBefore, startOfToday } from 'date-fns';
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import "../../assets/styles/components/AñadirReserva.css";

export function AñadirReserva() {
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
      if (rutaElegida) setMontoTotal(rutaElegida.precioBs * cantidad);
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
    navigate(-1);
  };

  return (
    <div className="añadir-reserva-container">
      <NavbarAdmin />
      <h1>Añadir Reserva</h1>

      <form>
        <label>Seleccionar Usuario:</label>
        <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
          <option value="">-- Selecciona un usuario --</option>
          {usuarios.map(([id, u]) => (
            <option key={id} value={id}>{u.nombre}</option>
          ))}
        </select>

        <label>Seleccionar Ruta:</label>
        <select value={idRuta} onChange={(e) => setIdRuta(e.target.value)}>
          <option value="">-- Selecciona una ruta --</option>
          {rutas.map(([id, r]) => (
            <option key={id} value={id}>{r.nombre}</option>
          ))}
        </select>

        {ruta && (
          <>
            <p><strong>Duración:</strong> {ruta.duracion}</p>
            <p><strong>Precio por persona:</strong> Bs. {ruta.precioBs}</p>
          </>
        )}

        <label>Seleccionar Fecha:</label>
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
        />

        <label>Seleccionar Hora:</label>
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

        <label>Cantidad de personas:</label>
        <input
          type="number"
          min="1"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
        />

        <p><strong>Total a pagar:</strong> Bs. {montoTotal}</p>

        <button type="button" onClick={handleReserva}>Añadir Reserva</button>
      </form>
    </div>
  );
}
