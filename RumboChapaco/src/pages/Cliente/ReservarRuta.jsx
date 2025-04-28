"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { db } from "../../data/firebaseConfig"
import { ref, get } from "firebase/database"
import { NavbarCliente } from "../../components/Cliente/NavbarCliente"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { es } from "date-fns/locale"
import { format, isBefore, startOfToday } from "date-fns"
import "../../assets/styles/components/reservarruta.css"

export function ReservarRuta() {
  const { id, idRuta } = useParams()
  const navigate = useNavigate()
  const [ruta, setRuta] = useState(null)
  const [reservas, setReservas] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const [horaSeleccionada, setHoraSeleccionada] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [montoTotal, setMontoTotal] = useState(0)

  useEffect(() => {
    const obtenerRuta = async () => {
      const snap = await get(ref(db, `rutas/${idRuta}`))
      if (snap.exists()) {
        setRuta(snap.val())
        setMontoTotal(snap.val().precioBs)
      }
    }

    const obtenerReservas = async () => {
      const snap = await get(ref(db, "reservas"))
      if (snap.exists()) {
        const data = snap.val()
        const reservasRuta = Object.values(data).filter((r) => r.idRuta === idRuta)
        setReservas(reservasRuta)
      }
    }

    obtenerRuta()
    obtenerReservas()
  }, [idRuta])

  useEffect(() => {
    if (ruta && cantidad) {
      setMontoTotal(ruta.precioBs * cantidad)
    }
  }, [cantidad, ruta])

  const generarHoras = () => {
    const horas = []
    for (let h = 8; h <= 16; h++) {
      horas.push(`${String(h).padStart(2, "0")}:00`)
    }
    return horas
  }

  const horasDelDia = generarHoras()

  const isFechaDisponible = (date) => {
    if (isBefore(date, startOfToday())) return false
    const fechaStr = format(date, "yyyy-MM-dd")
    const reservasDelDia = reservas.filter((r) => r.fecha === fechaStr)
    const horasReservadas = reservasDelDia.map((r) => r.hora)
    return horasReservadas.length < horasDelDia.length
  }

  const horasReservadasHoy = reservas
    .filter((r) => r.fecha === (fechaSeleccionada ? format(fechaSeleccionada, "yyyy-MM-dd") : ""))
    .map((r) => r.hora)

  const handleReserva = () => {
    if (!fechaSeleccionada || !horaSeleccionada || cantidad < 1) {
      alert("Completa todos los campos correctamente")
      return
    }

    const reserva = {
      usuarioId: id,
      idRuta,
      fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
      hora: horaSeleccionada,
      cantidadPersonas: cantidad,
      monto: montoTotal,
    }

    navigate(`/cliente/${id}/pago`, { state: { reserva } })
  }

  if (!ruta)
    return (
      <div className="loader">
        <p>Cargando...</p>
      </div>
    )

  return (
    <>
      <NavbarCliente />
      <div className="reserva-container">
        <div className="ruta-header">
          <h2>Reserva para: {ruta.nombre}</h2>
          <img src={ruta.imagen || "/placeholder.svg"} alt={ruta.nombre} className="ruta-imagen" />

          <div className="ruta-info">
            <div className="ruta-info-item">
              <strong>Duración</strong>
              <span>{ruta.duracion}</span>
            </div>
            <div className="ruta-info-item">
              <strong>Precio por pesona</strong>
              <span>Bs. {ruta.precioBs}</span>
            </div>
          </div>
        </div>

        <div className="reserva-form">
          <div className="form-section">
            <div className="form-group">
              <label>Seleccionar Fecha:</label>
              <DatePicker
                selected={fechaSeleccionada}
                onChange={(date) => {
                  setFechaSeleccionada(date)
                  setHoraSeleccionada("")
                }}
                minDate={new Date()}
                filterDate={isFechaDisponible}
                placeholderText="Selecciona una fecha"
                locale={es}
                dateFormat="yyyy-MM-dd"
                className="fecha-input"
              />
            </div>

            <div className="form-group">
              <label>Seleccionar Hora:</label>
              <select
                value={horaSeleccionada}
                onChange={(e) => setHoraSeleccionada(e.target.value)}
                className="hora-select"
              >
                <option value="">Selecciona una hora</option>
                {horasDelDia.map((hora) => {
                  const hoy = new Date()
                  const esHoy =
                    fechaSeleccionada && format(fechaSeleccionada, "yyyy-MM-dd") === format(hoy, "yyyy-MM-dd")
                  const horaActual = hoy.getHours()
                  const horaInt = Number.parseInt(hora.split(":")[0])
                  const yaReservada = horasReservadasHoy.includes(hora)
                  const estaPasada = esHoy && horaInt <= horaActual
                  return (
                    <option key={hora} value={hora} disabled={yaReservada || estaPasada}>
                      {hora} {yaReservada ? "(No disponible)" : ""}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label>Cantidad de personas:</label>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="cantidad-input"
              />
            </div>

            <div className="reserva-resumen">
              <h3>Resumen de la reserva</h3>
              <p>
                <strong>Ruta:</strong> {ruta.nombre}
              </p>
              {fechaSeleccionada && (
                <p>
                  <strong>Fecha:</strong> {format(fechaSeleccionada, "dd/MM/yyyy")}
                </p>
              )}
              {horaSeleccionada && (
                <p>
                  <strong>Hora:</strong> {horaSeleccionada}
                </p>
              )}
              <p>
                <strong>Personas:</strong> {cantidad}
              </p>
              <div className="monto-total">
                <strong>Total a pagar:</strong> Bs. {montoTotal}
              </div>
            </div>
          </div>
        </div>

        <button className="btn-reservar" onClick={handleReserva}>
          Continuar al Pago
        </button>
      </div>
    </>
  )
}
