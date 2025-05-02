import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import "../../assets/styles/components/ListarRutas.css";

export function ListarRutas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rutas, setRutas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    const obtenerRutas = async () => {
      const snap = await get(ref(db, "rutas"));
      if (snap.exists()) {
        const data = snap.val();
        const array = Object.entries(data).map(([id, ruta]) => ({
          id,
          ...ruta
        }));
        setRutas(array);
      }
    };
    obtenerRutas();
  }, []);

  const rutasFiltradas = rutas.filter(r => {
    const coincideTexto = r.nombre.toLowerCase().includes(filtroTexto.toLowerCase());
    const coincideEstado = filtroEstado ? r.estado === filtroEstado : true;
    return coincideTexto && coincideEstado;
  });

  return (
    <>
      <NavbarAdmin />
      <div className="listar-rutas-container">
        <h1 className="listar-rutas-title-center">
          <span className="icon-title">
            {/* Icono de ruta/mapa */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C7.03 2 3 6.03 3 11c0 5.25 7.05 10.45 8.09 11.21a1 1 0 0 0 1.18 0C13.95 21.45 21 16.25 21 11c0-4.97-4.03-9-9-9zm0 17.88C9.14 18.09 5 14.39 5 11c0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.39-4.14 7.09-7 8.88z" fill="#FF5B61"/>
              <circle cx="12" cy="11" r="3.2" fill="#FF5B61"/>
            </svg>
          </span>
          Lista de todas las Rutas:
        </h1>
        <div className="listar-rutas-filtros-row">
          <div className="filtro-buscar">
            <input
              className="search-input"
              type="text"
              placeholder="Buscar..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
            />
          </div>
          <div className="filtro-estado">
            <span className="filtro-label">
              {/* Icono de filtro */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 5h18M6 10h12M10 15h4" stroke="#FF5B61" strokeWidth="2" strokeLinecap="round"/></svg>
              APLICAR FILTROS:
            </span>
            <select
              className="select-filter"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Activo/Inactivo</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <div className="add-route-btn-row">
          <button
            className="add-route-btn add-route-btn-large"
            onClick={() => navigate(`/admin/${id}/rutas/añadir`)}
          >
            <span className="add-icon">
              {/* Icono de añadir */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M12 8v8M8 12h8" stroke="#FF5B61" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            AÑADIR RUTA
          </button>
        </div>
        <div className="tabla-rutas-wrapper">
          <table className="rutas-table rutas-table-rounded">
            <thead>
              <tr>
                <th>ID</th>
                <th>NOMBRE DE RUTA</th>
                <th>ESTADO</th>
                <th>PRECIO</th>
                <th>DURAC.</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {rutasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-rutas-message">
                    No hay rutas para mostrar.
                  </td>
                </tr>
              ) : (
                rutasFiltradas.map(ruta => (
                  <tr key={ruta.id}>
                    <td>{ruta.id}</td>
                    <td>{ruta.nombre}</td>
                    <td className={ruta.estado === "activo" ? "estado-activo" : "estado-inactivo"}>{ruta.estado?.toUpperCase()}</td>
                    <td>{ruta.precioBs}Bs.</td>
                    <td>{ruta.duracion || "-"}</td>
                    <td>
                    <button
                      className="edit-btn"
                      onClick={() => navigate(`/admin/${id}/rutas/editar/${ruta.id}`, { state: { ruta } })}
                    >
                      <span className="edit-icon-ruta">
                        {/* Icono de editar */}
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                          <path d="M4 21h4.586a1 1 0 0 0 .707-.293l10.414-10.414a2 2 0 0 0 0-2.828l-2.172-2.172a2 2 0 0 0-2.828 0L4.293 15.586A1 1 0 0 0 4 16.293V21z" stroke="#FFFFFF" strokeWidth="2"/>
                          <path d="M14.828 7.757l1.415 1.415" stroke="#FFFFFF" strokeWidth="2"/>
                        </svg>
                      </span>
                      Editar
                    </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
