import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { onValue, ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import "../../assets/styles/components/PanelAdmin.css";

export function PanelAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rutaPopular, setRutaPopular] = useState(null);
  const [mesPopular, setMesPopular] = useState("");

  useEffect(() => {
    const reservasRef = ref(db, "reservas");
    const rutasRef = ref(db, "rutas");

    const unsubscribe = onValue(reservasRef, async (snapshot) => {
      if (snapshot.exists()) {
        const reservasData = snapshot.val();
        const anioActual = new Date().getFullYear().toString();

        // Convertir a array y filtrar por año actual
        const reservasArray = Object.values(reservasData).filter(
          (res) => res.fechaCreado && res.fechaCreado.startsWith(anioActual)
        );

        // Contar reservas por ruta (solo si idRuta existe)
        const conteoPorRuta = {};
        reservasArray.forEach((res) => {
          if (res.idRuta) {
            conteoPorRuta[res.idRuta] = (conteoPorRuta[res.idRuta] || 0) + 1;
          }
        });

        // Obtener la ruta con más reservas
        const rutaIdPopular = Object.entries(conteoPorRuta)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (rutaIdPopular) {
          const rutaSnap = await get(ref(db, `rutas/${rutaIdPopular}`));
          if (rutaSnap.exists()) {
            setRutaPopular({
              ...rutaSnap.val(),
              totalReservas: conteoPorRuta[rutaIdPopular], // Opcional: mostrar el total
            });
          }
        }

        // Contar reservas por mes (solo si fechaCreado existe)
        const conteoPorMes = {};
        reservasArray.forEach((res) => {
          if (res.fechaCreado) {
            const mes = res.fechaCreado.split("-")[1];
            if (mes) conteoPorMes[mes] = (conteoPorMes[mes] || 0) + 1;
          }
        });

        // Obtener el mes con más reservas
        const mesConMasReservas = Object.entries(conteoPorMes)
          .sort((a, b) => b[1] - a[1])[0]?.[0];

        if (mesConMasReservas) {
          const meses = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ];
          setMesPopular(meses[parseInt(mesConMasReservas, 10) - 1]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <NavbarAdmin />
      <div className="panel-admin-container">
        <h1 className="panel-admin-title">Panel de Administración</h1>
  
        <div className="panel-admin-content">
          {/* Columna izquierda - Ruta popular */}
          <div className="panel-admin-ruta-col">
            <div className="panel-admin-ruta">
              <h2 className="panel-admin-heading">Ruta más popular de este año</h2>
              {rutaPopular ? (
                <div className="panel-admin-ruta-content">
                  <img
                    src={rutaPopular.imagen}
                    alt={rutaPopular.nombre}
                    className="panel-admin-ruta-img"
                  />
                  <h3>{rutaPopular.nombre}</h3>
                </div>
              ) : (
                <p>Cargando...</p>
              )}
            </div>
          </div>
  
          {/* Columna derecha - Mes + Botones */}
          <div className="panel-admin-side-col">
            <div className="panel-admin-mes">
              <h2 className="panel-admin-heading">Mes con más reservas</h2>
              {mesPopular ? (
                <h1 className="panel-admin-month">{mesPopular}</h1>
              ) : (
                <p>Cargando...</p>
              )}
            </div>
  
            <div className="panel-admin-buttons">
              <button onClick={() => navigate(`/admin/${id}/rutas`)}>Administrar Rutas</button>
              <button onClick={() => navigate(`/admin/${id}/reservas`)}>Administrar Reservas</button>
              <button onClick={() => navigate(`/admin/${id}/reportes`)}>Generar Reportes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
