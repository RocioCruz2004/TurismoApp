import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import { useParams } from "react-router-dom";
import "../../assets/styles/components/ListarReservas.css";

export function ListarReservas() {
  const { idAdmin: idadmin } = useParams();
  const [reservas, setReservas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtrosMes, setFiltrosMes] = useState([]);
  const [filtroAnioDesde, setFiltroAnioDesde] = useState("");
  const [filtroAnioHasta, setFiltroAnioHasta] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const [resSnap, rutaSnap, userSnap] = await Promise.all([
        get(ref(db, "reservas")),
        get(ref(db, "rutas")),
        get(ref(db, "usuarios")),
      ]);

      if (resSnap.exists() && rutaSnap.exists() && userSnap.exists()) {
        const reservasData = resSnap.val();
        const rutasData = rutaSnap.val();
        const usuariosData = userSnap.val();

        const arrayReservas = Object.entries(reservasData).map(([id, res]) => ({
          id,
          ...res,
          nombreRuta: rutasData[res.idRuta]?.nombre || "Ruta desconocida",
          nombreUsuario: usuariosData[res.usuarioId]?.nombre || "Usuario desconocido",
        }));

        setReservas(arrayReservas);
      }
    };

    fetchData();
  }, []);

  const eliminarReserva = async (id) => {
    const confirmar = confirm("¿Estás seguro de eliminar esta reserva?");
    if (confirmar) {
      await remove(ref(db, `reservas/${id}`));
      setReservas((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleFilters = () => {
    setFiltersExpanded(!filtersExpanded);
  };

  const reservasFiltradas = reservas.filter((res) => {
    const texto = filtroTexto.toLowerCase();
    const coincideTexto =
      res.nombreUsuario.toLowerCase().includes(texto) ||
      res.nombreRuta.toLowerCase().includes(texto);

    const [anio, mes] = res.fechaCreado?.split("-") || [];
    const coincideMes = filtrosMes.length > 0 ? filtrosMes.includes(mes) : true;

    const anioActual = new Date().getFullYear().toString();

    const usarAnioActual = filtrosMes.length > 0 && !filtroAnioDesde && !filtroAnioHasta;
    const anioDesde = usarAnioActual ? anioActual : filtroAnioDesde;
    const anioHasta = usarAnioActual ? anioActual : filtroAnioHasta;

    const anioNum = parseInt(anio);
    const desde = anioDesde ? parseInt(anioDesde) : null;
    const hasta = anioHasta ? parseInt(anioHasta) : null;

    const coincideAnio = (!desde || anioNum >= desde) && (!hasta || anioNum <= hasta);

    return coincideTexto && coincideMes && coincideAnio;
  });

  return (
    <>
      <NavbarAdmin />
      <div className="listar-reservas-container">
        <div className="listar-reservas-header">
          <h1 className="listar-reservas-title">
            <span className="title-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path>
                <path d="M16 2v4"></path>
                <path d="M8 2v4"></path>
                <path d="M3 10h18"></path>
              </svg>
            </span>
            Listado de Reservas
          </h1>
          
          <button
            onClick={() => navigate(`/admin/${idadmin}/reservas/añadir`)}
            className="nueva-reserva-btn"
          >
            <svg className="add-icon-reserva" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Nueva Reserva
          </button>
        </div>

        <div className="search-and-filter-container">
          <div className="search-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Buscar por usuario o ruta..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="listar-reservas-search"
            />
            {filtroTexto && (
              <button 
                className="clear-search-btn" 
                onClick={() => setFiltroTexto("")}
                aria-label="Limpiar búsqueda"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>

          <button className="filter-toggle" onClick={toggleFilters}>
            <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {filtersExpanded ? 'Ocultar filtros' : 'Mostrar filtros'} 
            <svg className={`arrow-icon ${filtersExpanded ? 'arrow-up' : 'arrow-down'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points={filtersExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </button>
        </div>

        <div className={`listar-reservas-filtros ${filtersExpanded ? 'filters-expanded' : ''}`}>
          <div className="filters-grid">
            <div className="month-filter">
              <h3>
                <svg className="filter-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Filtrar por mes
              </h3>
              <div className="month-checkboxes">
                {[...Array(12)].map((_, i) => {
                  const mesValor = (i + 1).toString().padStart(2, "0");
                  const mesNombre = new Date(0, i).toLocaleString("default", { month: "short" });

                  return (
                    <label key={mesValor} className="month-label">
                      <input
                        type="checkbox"
                        value={mesValor}
                        checked={filtrosMes.includes(mesValor)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFiltrosMes([...filtrosMes, mesValor]);
                          } else {
                            setFiltrosMes(filtrosMes.filter((m) => m !== mesValor));
                          }
                        }}
                        className="month-checkbox"
                      />
                      <span className="month-name">{mesNombre}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="year-filter">
              <h3>
                <svg className="filter-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Filtrar por año
              </h3>
              <div className="year-inputs">
                <div className="input-group">
                  <label>Desde:</label>
                  <input
                    type="number"
                    placeholder="2020"
                    value={filtroAnioDesde}
                    onChange={(e) => setFiltroAnioDesde(e.target.value)}
                    min="2000"
                    max="2100"
                    className="year-input"
                  />
                </div>
                <div className="input-group">
                  <label>Hasta:</label>
                  <input
                    type="number"
                    placeholder="2025"
                    value={filtroAnioHasta}
                    onChange={(e) => setFiltroAnioHasta(e.target.value)}
                    min="2000"
                    max="2100"
                    className="year-input"
                  />
                </div>
              </div>
            </div>

            <div className="clear-filter-container">
              <button
                onClick={() => {
                  setFiltroTexto("");
                  setFiltrosMes([]);
                  setFiltroAnioDesde("");
                  setFiltroAnioHasta("");
                }}
                className="listar-reservas-clear-btn"
                disabled={!filtroTexto && filtrosMes.length === 0 && !filtroAnioDesde && !filtroAnioHasta}
              >
                <svg className="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="results-counter">
          <span className="results-text">
            <svg className="results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            {reservasFiltradas.length} {reservasFiltradas.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
          </span>
        </div>

        {/* Tabla de Reservas */}
        <div className="table-container">
          <table className="listar-reservas-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha Creación</th>
                <th>Usuario</th>
                <th>Ruta</th>
                <th>Fecha Reserva</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-results">
                    <div className="no-results-content">
                      <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>No hay reservas para mostrar</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((res) => (
                  <tr key={res.id}>
                    <td className="truncate">{res.id}</td>
                    <td>{res.fechaCreado}</td>
                    <td>
                      <div className="table-cell-with-icon">

                        {res.nombreUsuario}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-with-icon">

                        {res.nombreRuta}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-with-icon">

                        {res.fecha}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-with-icon">

                        {res.hora}
                      </div>
                    </td>
                    <td>
                      <div className="table-cell-with-icon">
                   
                        {res.cantidadPersonas}
                      </div>
                    </td>
                    <td className="actions-cell">
                      <div className="actions-buttons">
                        <button
                          onClick={() =>
                            navigate(`/admin/${idadmin}/reservas/editar/${res.id}`, {
                              state: { reserva: res },
                            })
                          }
                          className="edit-boton"
                          aria-label="Editar"
                        >
                          <svg className="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => eliminarReserva(res.id)}
                          className="delete-btn"
                          aria-label="Eliminar"
                        >
                          <svg className="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                          <span>Eliminar</span>
                        </button>
                      </div>
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