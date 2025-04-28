import { useEffect, useState } from "react";
import { ref, get, remove } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import { useParams } from "react-router-dom";
import "../../assets/styles/components/ListarReservas.css";

export function ListarReservas() {
  const { idAdmin: idadmin } = useParams();
  const { id } = useParams();
  const [reservas, setReservas] = useState([]);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtrosMes, setFiltrosMes] = useState([]);
  const [filtroAnioDesde, setFiltroAnioDesde] = useState("");
  const [filtroAnioHasta, setFiltroAnioHasta] = useState("");
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
          <h1 className="listar-reservas-title">Listado de Reservas</h1>
          <button
            onClick={() => navigate(`/admin/${idadmin}/reservas/añadir`)}
            className="listar-reservas-add-btn"
          >
            <span className="plus-icon">+</span> Nueva Reserva
          </button>
        </div>

        {/* Filtros */}
        <div className="listar-reservas-filtros">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por usuario o ruta..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="listar-reservas-search"
            />
            <svg className="search-icon" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </div>

          <div className="filters-grid">
            <div className="month-filter">
              <h3>Filtrar por mes</h3>
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
              <h3>Filtrar por año</h3>
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

            <button
              onClick={() => {
                setFiltroTexto("");
                setFiltrosMes([]);
                setFiltroAnioDesde("");
                setFiltroAnioHasta("");
              }}
              className="listar-reservas-clear-btn"
            >
              <svg className="clear-icon" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
              Limpiar filtros
            </button>
          </div>
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
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-results">
                    <div className="no-results-content">
                      <span>No hay reservas para mostrar</span>
                    </div>
                  </td>
                </tr>
              ) : (
                reservasFiltradas.map((res) => (
                  <tr key={res.id}>
                    <td className="truncate">{res.id}</td>
                    <td>{res.fechaCreado}</td>
                    <td>{res.nombreUsuario}</td>
                    <td>{res.nombreRuta}</td>
                    <td>{res.fecha}</td>
                    <td>{res.hora}</td>
                    <td>{res.cantidadPersonas}</td>
                    <td className="actions-cell">
                      <button
                        onClick={() =>
                          navigate(`/admin/${idadmin}/reservas/editar/${res.id}`, {
                            state: { reserva: res },
                          })
                        }
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarReserva(res.id)}
                        className="delete-btn"
                      >
                        Eliminar
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
