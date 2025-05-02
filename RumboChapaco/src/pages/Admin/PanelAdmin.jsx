"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { onValue, ref, get } from "firebase/database"
import { db } from "../../data/firebaseConfig"
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin"
import "../../assets/styles/components/PanelAdmin.css"
import { FaRoute, FaCalendar, FaMapMarkedAlt, FaCalendarCheck, FaChartBar } from 'react-icons/fa'

export function PanelAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [rutaPopular, setRutaPopular] = useState(null)
  const [mesPopular, setMesPopular] = useState("")

  useEffect(() => {
    const reservasRef = ref(db, "reservas")
    const rutasRef = ref(db, "rutas")

    const unsubscribe = onValue(reservasRef, async (snapshot) => {
      if (snapshot.exists()) {
        const reservasData = snapshot.val()
        const anioActual = new Date().getFullYear().toString()

        // Convertir a array y filtrar por año actual
        const reservasArray = Object.values(reservasData).filter(
          (res) => res.fechaCreado && res.fechaCreado.startsWith(anioActual),
        )

        // Contar reservas por ruta (solo si idRuta existe)
        const conteoPorRuta = {}
        reservasArray.forEach((res) => {
          if (res.idRuta) {
            conteoPorRuta[res.idRuta] = (conteoPorRuta[res.idRuta] || 0) + 1
          }
        })

        // Obtener la ruta con más reservas
        const rutaIdPopular = Object.entries(conteoPorRuta).sort((a, b) => b[1] - a[1])[0]?.[0]

        if (rutaIdPopular) {
          const rutaSnap = await get(ref(db, `rutas/${rutaIdPopular}`))
          if (rutaSnap.exists()) {
            setRutaPopular({
              ...rutaSnap.val(),
              totalReservas: conteoPorRuta[rutaIdPopular], // Opcional: mostrar el total
            })
          }
        }

        // Contar reservas por mes (solo si fechaCreado existe)
        const conteoPorMes = {}
        reservasArray.forEach((res) => {
          if (res.fechaCreado) {
            const mes = res.fechaCreado.split("-")[1]
            if (mes) conteoPorMes[mes] = (conteoPorMes[mes] || 0) + 1
          }
        })

        // Obtener el mes con más reservas
        const mesConMasReservas = Object.entries(conteoPorMes).sort((a, b) => b[1] - a[1])[0]?.[0]

        if (mesConMasReservas) {
          const meses = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ]
          setMesPopular(meses[Number.parseInt(mesConMasReservas, 10) - 1])
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <NavbarAdmin />
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="admin-title">Panel de Administración</h1>
        </div>

        <div className="admin-dashboard">
          {/* Contenido principal */}
          <div className="admin-content">
            {/* Columna izquierda - Ruta popular */}
            <div className="admin-card ruta-card">
              <div className="card-header">
                <h2><FaRoute /> Ruta más popular de este año</h2>
              </div>
              <div className="card-body">
                {rutaPopular ? (
                  <div className="ruta-details">
                    <div className="ruta-image-container">
                      <img
                        src={rutaPopular.imagen || "/placeholder.svg"}
                        alt={rutaPopular.nombre}
                        className="ruta-image"
                      />
                    </div>
                    <div className="ruta-info">
                      <h3>{rutaPopular.nombre}</h3>
                      {rutaPopular.totalReservas && (
                        <div className="ruta-stats">
                          <span className="reservas-count">{rutaPopular.totalReservas}</span>
                          <span className="reservas-label">reservas</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="loading-state">Cargando...</div>
                )}
              </div>
            </div>

            {/* Columna derecha - Mes + Botones */}
            <div className="admin-card mes-card">
              <div className="card-header">
                <h2><FaCalendar /> Mes con más reservas</h2>
              </div>
              <div className="card-body">
                {mesPopular ? (
                  <div className="mes-display">
                    <span className="mes-nombre">{mesPopular}</span>
                  </div>
                ) : (
                  <div className="loading-state">Cargando...</div>
                )}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="admin-actions">
            <button className="admin-action-btn" onClick={() => navigate(`/admin/${id}/rutas`)}>
              <span className="btn-icon">
                <i className="fas fa-map-marked-alt"></i>
              </span>
              <span className="btn-text">Administrar Rutas</span>
            </button>

            <button className="admin-action-btn" onClick={() => navigate(`/admin/${id}/reservas`)}>
              <span className="btn-icon">
                <i className="fas fa-calendar-check"></i>
              </span>
              <span className="btn-text">Administrar Reservas</span>
            </button>

            <button className="admin-action-btn" onClick={() => navigate(`/admin/${id}/reportes`)}>
              <span className="btn-icon">
                <i className="fas fa-chart-bar"></i>
              </span>
              <span className="btn-text">Generar Reportes</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
