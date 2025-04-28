import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ref, update, get, remove } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
// Importar estilos
import "../../assets/styles/components/EditarRuta.css";

export function EditarRuta() {
  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const rutaInicial = state?.ruta || {};

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenActual, setImagenActual] = useState("");
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [paradas, setParadas] = useState([]);
  const [nuevaParada, setNuevaParada] = useState({
    nombre: "",
    lat: "",
    lng: "",
    imagen: ""
  });

  useEffect(() => {
    if (rutaInicial) {
      setNombre(rutaInicial.nombre || "");
      setDescripcion(rutaInicial.descripcion || "");
      setPrecio(rutaInicial.precio || "");
      setCategoria(rutaInicial.categoria || "");
      setImagenActual(rutaInicial.imagen || "");
      setParadas(Object.entries(rutaInicial.paradas || {}).map(([key, parada]) => ({
        ...parada,
        id: key
      })));
    }
  }, [rutaInicial]);

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaImagen(file);
    }
  };

  const subirImagenAImgur = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:4000/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    if (data.url) {
      return data.url;
    } else {
      throw new Error(data.error || "Error al subir imagen");
    }
  };

  const handleGuardar = async () => {
    let imagenURL = imagenActual;

    if (nuevaImagen) {
      try {
        const nuevaURL = await subirImagenAImgur(nuevaImagen);
        imagenURL = nuevaURL;
      } catch (error) {
        alert("Error subiendo imagen: " + error.message);
        return;
      }
    }

    const rutaActualizada = {
      nombre,
      descripcion,
      precio,
      categoria,
      imagen: imagenURL,
      paradas
    };

    await update(ref(db, `rutas/${idRuta}`), rutaActualizada);
    alert("Ruta actualizada correctamente");
    navigate(`/admin/rutas`);
  };

  const handleEliminarParada = (paradaId) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta parada?");
    if (confirmar) {
      const nuevasParadas = paradas.filter((parada) => parada.id !== paradaId);
      setParadas(nuevasParadas);
    }
  };

  const handleAgregarParada = () => {
    setParadas((prevParadas) => [
      ...prevParadas,
      { ...nuevaParada, id: `parada${prevParadas.length + 1}` }
    ]);
    setNuevaParada({ nombre: "", lat: "", lng: "", imagen: "" });  // Limpiar formulario de nueva parada
  };

  const handleEditarParada = (paradaId) => {
    const paradaAEditar = paradas.find(parada => parada.id === paradaId);
    if (paradaAEditar) {
      setNuevaParada(paradaAEditar);  // Cargar datos de la parada en el formulario
      setParadas(paradas.filter(parada => parada.id !== paradaId));  // Eliminarla temporalmente de la lista
    }
  };

  return (
    <>
    <NavbarAdmin/>
    <div className="editar-ruta-container">
      <h1 className="editar-ruta-title">Editar Ruta</h1>

      <div className="editar-ruta-form">
        <div className="form-group">
          <label className="form-label">Nombre:</label>
          <input 
            type="text" 
            className="form-input" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción:</label>
          <textarea 
            className="form-textarea" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Precio:</label>
          <input 
            type="number" 
            className="form-input" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Categoría:</label>
          <input 
            type="text" 
            className="form-input" 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Imagen actual:</label>
          {imagenActual && (
            <div className="imagen-preview">
              <img src={imagenActual} alt="Imagen actual" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Subir nueva imagen:</label>
          <input 
            type="file" 
            className="form-input" 
            accept="image/*" 
            onChange={handleImagenChange} 
          />
        </div>
      </div>

      <div className="paradas-section">
        <h2 className="paradas-title">Paradas de la Ruta</h2>
        
        {paradas.length > 0 ? (
          <div className="paradas-list">
            {paradas.map((parada) => (
              <div key={parada.id} className="parada-card">
                <div className="parada-info">
                  <div className="parada-nombre">{parada.nombre}</div>
                  <div className="parada-coord">Latitud: {parada.lat}</div>
                  <div className="parada-coord">Longitud: {parada.lng}</div>
                </div>
                <img src={parada.imagen} alt={parada.nombre} className="parada-imagen" />
                <div className="parada-actions">
                  <button className="btn btn-danger" onClick={() => handleEliminarParada(parada.id)}>
                    Eliminar
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleEditarParada(parada.id)}>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mensaje-vacio">No hay paradas añadidas</p>
        )}

        <div className="nueva-parada-form">
          <h3 className="nueva-parada-title">Añadir Nueva Parada</h3>
          <div className="nueva-parada-grid">
            <div className="form-group">
              <label className="form-label">Nombre de la parada:</label>
              <input
                type="text"
                className="form-input"
                value={nuevaParada.nombre}
                onChange={(e) => setNuevaParada({ ...nuevaParada, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Latitud:</label>
              <input
                type="text"
                className="form-input"
                value={nuevaParada.lat}
                onChange={(e) => setNuevaParada({ ...nuevaParada, lat: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitud:</label>
              <input
                type="text"
                className="form-input"
                value={nuevaParada.lng}
                onChange={(e) => setNuevaParada({ ...nuevaParada, lng: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Imagen de la parada:</label>
              <input
                type="file"
                className="form-input"
                accept="image/*"
                onChange={(e) => setNuevaParada({ ...nuevaParada, imagen: e.target.files[0] })}
              />
            </div>
          </div>
          
          <button className="btn" onClick={handleAgregarParada}>Añadir Parada</button>
        </div>
      </div>

      <button className="btn btn-success btn-large" onClick={handleGuardar}>
        Guardar Cambios
      </button>
    </div>
    </>
  );
}