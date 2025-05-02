import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ref, update, get, remove } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
// Importar íconos
import { 
  FaEdit, 
  FaInfo, 
  FaMapMarkerAlt, 
  FaImage, 
  FaPlus, 
  FaSave, 
  FaTrash, 
  FaPencilAlt,
  FaClock,
  FaMoneyBillWave,
  FaListAlt,
  FaToggleOn
} from "react-icons/fa";
// Importar estilos
import "../../assets/styles/components/EditarRuta.css";

export function EditarRuta() {
  const { idRuta } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const rutaInicial = state?.ruta || {};

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("");
  const [duracion, setDuracion] = useState("");
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
  const [imagenParadaFile, setImagenParadaFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rutaInicial) {
      setNombre(rutaInicial.nombre || "");
      setDescripcion(rutaInicial.descripcion || "");
      setPrecio(rutaInicial.precioBs || "");
      setCategoria(rutaInicial.categoria || "");
      setImagenActual(rutaInicial.imagen || "");
      setEstado(rutaInicial.estado || "activo");
      setDuracion(rutaInicial.duracion || "");

      // Convertir el objeto de paradas a un array
      if (rutaInicial.paradas) {
        const paradasArray = [];
        for (const [id, parada] of Object.entries(rutaInicial.paradas)) {
          paradasArray.push({
            id,
            ...parada
          });
        }
        setParadas(paradasArray);
      }
    }
  }, [rutaInicial]);
  
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaImagen(file);
    }
  };

  const handleImagenParadaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenParadaFile(file);
    }
  };

  const subirImagenAImgur = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
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
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw error;
    }
  };

  const handleGuardar = async () => {
    try {
      setLoading(true);
      let imagenURL = imagenActual;
    
      if (nuevaImagen) {
        try {
          const nuevaURL = await subirImagenAImgur(nuevaImagen);
          imagenURL = nuevaURL;
        } catch (error) {
          alert("Error subiendo imagen principal: " + error.message);
          setLoading(false);
          return;
        }
      }
    
      // Convertir el array de paradas a un objeto para Firebase
      const paradasObj = {};
      paradas.forEach(parada => {
        // Solo guardar las propiedades necesarias, no el ID
        paradasObj[parada.id] = {
          nombre: parada.nombre,
          lat: parada.lat,
          lng: parada.lng,
          imagen: parada.imagen
        };
      });
      
      const rutaActualizada = {
        nombre,
        descripcion,
        precioBs: precio,
        categoria,
        imagen: imagenURL,
        duracion,  
        estado,  
        paradas: paradasObj
      };
      
      console.log("Guardando ruta:", rutaActualizada);
    
      await update(ref(db, `rutas/${idRuta}`), rutaActualizada);
      alert("Ruta actualizada correctamente");
      setLoading(false);
      navigate(`/admin/rutas`);
    } catch (error) {
      setLoading(false);
      alert("Error al guardar la ruta: " + error.message);
    }
  };
  
  const handleEliminarParada = (paradaId) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta parada?");
    if (confirmar) {
      const nuevasParadas = paradas.filter((parada) => parada.id !== paradaId);
      setParadas(nuevasParadas);
    }
  };

  const handleAgregarParada = async () => {
    if (!nuevaParada.nombre || !nuevaParada.lat || !nuevaParada.lng) {
      alert("Por favor completa todos los campos de la parada");
      return;
    }
    
    if (!imagenParadaFile) {
      alert("Por favor selecciona una imagen para la parada");
      return;
    }
    
    try {
      setLoading(true);
      
      // Subir la imagen de parada
      const imagenURL = await subirImagenAImgur(imagenParadaFile);
      
      // Crear ID único para la parada
      const paradaId = `parada_${Date.now()}`;
      
      // Crear el objeto de parada con la URL de la imagen
      const nuevaParadaCompleta = {
        id: paradaId,
        nombre: nuevaParada.nombre,
        lat: nuevaParada.lat,
        lng: nuevaParada.lng,
        imagen: imagenURL
      };
      
      // Añadir la parada al array de paradas
      setParadas(prevParadas => [...prevParadas, nuevaParadaCompleta]);
      
      // Resetear el formulario
      setNuevaParada({
        nombre: "",
        lat: "",
        lng: "",
        imagen: ""
      });
      setImagenParadaFile(null);
      
      // Log para depuración
      console.log("Parada añadida:", nuevaParadaCompleta);
      console.log("Total paradas:", [...paradas, nuevaParadaCompleta]);
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Error al añadir parada: " + error.message);
    }
  };

  const handleEditarParada = (paradaId) => {
    const parada = paradas.find(p => p.id === paradaId);
    if (parada) {
      setNuevaParada({
        nombre: parada.nombre,
        lat: parada.lat,
        lng: parada.lng,
        imagen: parada.imagen
      });
      setParadas(paradas.filter(p => p.id !== paradaId));
    }
  };

  return (
    <>
    <NavbarAdmin/>
    <div className="editar-ruta-container">
      <h1 className="editar-ruta-title">
        <FaEdit className="title-icon"/> Editar Ruta
      </h1>

      <div className="editar-ruta-form">
        <div className="form-group">
          <label className="form-label">
            <FaInfo className="icon-label"/> Nombre:
          </label>
          <input 
            type="text" 
            className="form-input" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaInfo className="icon-label"/> Descripción:
          </label>
          <textarea 
            className="form-textarea" 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaToggleOn className="icon-label"/> Estado:
          </label>
          <select
            className="form-input"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaClock className="icon-label"/> Duración:
          </label>
          <input
            type="text"
            className="form-input"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaMoneyBillWave className="icon-label"/> Precio (Bs):
          </label>
          <input 
            type="number" 
            className="form-input" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaListAlt className="icon-label"/> Categoría:
          </label>
          <input 
            type="text" 
            className="form-input" 
            value={categoria} 
            onChange={(e) => setCategoria(e.target.value)} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaImage className="icon-label"/> Imagen actual:
          </label>
          {imagenActual && (
            <div className="imagen-preview">
              <img src={imagenActual} alt="Imagen actual" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">
            <FaImage className="icon-label"/> Subir nueva imagen:
          </label>
          <input 
            type="file" 
            className="form-input" 
            accept="image/*" 
            onChange={handleImagenChange} 
          />
        </div>
      </div>

      <div className="paradas-section">
        <h2 className="paradas-title">
          <FaMapMarkerAlt className="icon-subtitle"/> Paradas de la Ruta ({paradas.length})
        </h2>
        
        {paradas.length > 0 ? (
          <div className="paradas-list">
            {paradas.map((parada) => (
              <div key={parada.id} className="parada-card">
                <div className="parada-info">
                  <div className="parada-nombre">{parada.nombre}</div>
                  <div className="parada-coord">
                    <FaMapMarkerAlt className="icon-small"/> Latitud: {parada.lat}
                  </div>
                  <div className="parada-coord">
                    <FaMapMarkerAlt className="icon-small"/> Longitud: {parada.lng}
                  </div>
                </div>
                <img src={parada.imagen} alt={parada.nombre} className="parada-imagen" />
                <div className="parada-actions">
                  <div className="parada-action-btn">
                    <button className="btn btn-danger small-btn" onClick={() => handleEliminarParada(parada.id)}>
                      <FaTrash className="icon-btn"/> Eliminar
                    </button>
                  </div>
                  <div className="parada-action-btn">
                    <button className="btn btn-secondary small-btn" onClick={() => handleEditarParada(parada.id)}>
                      <FaPencilAlt className="icon-btn"/> Editar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mensaje-vacio">No hay paradas añadidas</p>
        )}

        <div className="nueva-parada-form">
          <h3 className="nueva-parada-title">
            <FaPlus className="icon-subtitle"/> Añadir Nueva Parada
          </h3>
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
                onChange={handleImagenParadaChange}
              />
              {imagenParadaFile && (
                <div className="file-selected">
                  Imagen seleccionada: {imagenParadaFile.name}
                </div>
              )}
            </div>
          </div>
          
          <button 
            className="btn btn-primary" 
            onClick={handleAgregarParada}
            disabled={loading}
          >
            {loading ? 'Procesando...' : <><FaPlus className="icon-btn"/> Añadir Parada</>}
          </button>
        </div>
      </div>

      <button 
        className="btn btn-success btn-large" 
        onClick={handleGuardar}
        disabled={loading}
      >
        {loading ? 'Guardando...' : <><FaSave className="icon-btn"/> Guardar Cambios</>}
      </button>
    </div>
    </>
  );
}