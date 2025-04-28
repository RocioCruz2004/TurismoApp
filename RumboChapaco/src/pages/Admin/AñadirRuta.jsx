"use client"

import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ref, push, set } from "firebase/database"
import { db } from "../../data/firebaseConfig"
import "../../assets/styles/components/AñadirRuta.css"
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";

export function AñadirRuta() {
  const { idAdmin } = useParams()
  const navigate = useNavigate()

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [categoria, setCategoria] = useState("")
  const [imagen, setImagen] = useState(null)
  const [paradas, setParadas] = useState([])
  const [nuevaParada, setNuevaParada] = useState({
    nombre: "",
    lat: "",
    lng: "",
    imagen: null,
    imagenPreview: "",
  })
  const [previewImagen, setPreviewImagen] = useState("")
  const [cargando, setCargando] = useState(false)

  // Manejar cambio de imagen principal
  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImagen(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImagen(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Manejar cambio de imagen para parada
  const handleImagenParadaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNuevaParada({
          ...nuevaParada,
          imagen: file,
          imagenPreview: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Subir imagen a Imgur
  const subirImagenAImgur = async (file) => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const res = await fetch("http://localhost:4000/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (data.url) {
        return data.url
      } else {
        throw new Error(data.error || "Error al subir imagen")
      }
    } catch (error) {
      console.error("Error al subir imagen a Imgur:", error)
      throw error
    }
  }

  // Agregar nueva parada a la lista
  const handleAgregarParada = async () => {
    if (!nuevaParada.nombre || !nuevaParada.lat || !nuevaParada.lng || !nuevaParada.imagen) {
      alert("Por favor completa todos los campos de la parada")
      return
    }

    try {
      setCargando(true)
      // Subir imagen de la parada a Imgur
      const imagenURL = await subirImagenAImgur(nuevaParada.imagen)

      // Agregar parada con la URL de la imagen
      const nuevaParadaCompleta = {
        ...nuevaParada,
        imagen: imagenURL,
        id: `parada${Date.now()}`,
      }

      setParadas([...paradas, nuevaParadaCompleta])

      // Limpiar formulario de nueva parada
      setNuevaParada({
        nombre: "",
        lat: "",
        lng: "",
        imagen: null,
        imagenPreview: "",
      })
    } catch (error) {
      alert("Error al subir la imagen de la parada: " + error.message)
    } finally {
      setCargando(false)
    }
  }

  // Eliminar parada de la lista
  const handleEliminarParada = (paradaId) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar esta parada?")
    if (confirmar) {
      const nuevasParadas = paradas.filter((parada) => parada.id !== paradaId)
      setParadas(nuevasParadas)
    }
  }

  // Guardar la ruta completa
  const handleGuardar = async () => {
    // Validar campos obligatorios
    if (!nombre || !descripcion || !precio || !categoria || !imagen) {
      alert("Por favor completa todos los campos obligatorios")
      return
    }

    try {
      setCargando(true)

      // Subir imagen principal a Imgur
      const imagenURL = await subirImagenAImgur(imagen)

      // Crear objeto de paradas para Firebase
      const paradasObj = {}
      paradas.forEach((parada, index) => {
        paradasObj[`parada${index + 1}`] = {
          nombre: parada.nombre,
          lat: parada.lat,
          lng: parada.lng,
          imagen: parada.imagen,
        }
      })

      // Crear nueva ruta en Firebase
      const nuevaRutaRef = push(ref(db, "rutas"))

      await set(nuevaRutaRef, {
        nombre,
        descripcion,
        precio,
        categoria,
        imagen: imagenURL,
        paradas: paradasObj,
        fechaCreacion: new Date().toISOString(),
      })

      alert("Ruta creada correctamente")
      navigate(`/admin/${idAdmin}/rutas`)
    } catch (error) {
      alert("Error al crear la ruta: " + error.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <>
     <NavbarAdmin />
    <div className="anadir-ruta-container">
      <h1 className="anadir-ruta-title">Añadir Nueva Ruta</h1>

      <div className="anadir-ruta-form">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la ruta"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción detallada de la ruta"
            className="form-control"
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio:</label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="0.00"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              placeholder="Categoría de la ruta"
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Imagen principal:</label>
          <input type="file" accept="image/*" onChange={handleImagenChange} className="form-control-file" />
          {previewImagen && (
            <div className="imagen-preview">
              <img src={previewImagen || "/placeholder.svg"} alt="Vista previa" />
            </div>
          )}
        </div>

        <div className="paradas-section">
          <h2>Paradas de la Ruta</h2>

          {paradas.length > 0 ? (
            <div className="paradas-list">
              {paradas.map((parada) => (
                <div key={parada.id} className="parada-item">
                  <div className="parada-info">
                    <h3>{parada.nombre}</h3>
                    <p>
                      <strong>Coordenadas:</strong> {parada.lat}, {parada.lng}
                    </p>
                    <div className="parada-imagen">
                      <img src={parada.imagen || "/placeholder.svg"} alt={parada.nombre} />
                    </div>
                  </div>
                  <div className="parada-actions">
                    <button onClick={() => handleEliminarParada(parada.id)} className="btn-eliminar">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-paradas">No hay paradas añadidas</p>
          )}

          <div className="nueva-parada-form">
            <h3>Añadir Nueva Parada</h3>

            <div className="form-group">
              <label>Nombre de la parada:</label>
              <input
                type="text"
                value={nuevaParada.nombre}
                onChange={(e) => setNuevaParada({ ...nuevaParada, nombre: e.target.value })}
                placeholder="Nombre del punto de interés"
                className="form-control"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Latitud:</label>
                <input
                  type="text"
                  value={nuevaParada.lat}
                  onChange={(e) => setNuevaParada({ ...nuevaParada, lat: e.target.value })}
                  placeholder="Ej: 40.416775"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Longitud:</label>
                <input
                  type="text"
                  value={nuevaParada.lng}
                  onChange={(e) => setNuevaParada({ ...nuevaParada, lng: e.target.value })}
                  placeholder="Ej: -3.703790"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Imagen de la parada:</label>
              <input type="file" accept="image/*" onChange={handleImagenParadaChange} className="form-control-file" />
              {nuevaParada.imagenPreview && (
                <div className="imagen-preview">
                  <img src={nuevaParada.imagenPreview || "/placeholder.svg"} alt="Vista previa parada" />
                </div>
              )}
            </div>

            <button onClick={handleAgregarParada} className="btn-agregar-parada" disabled={cargando}>
              {cargando ? "Subiendo..." : "Añadir Parada"}
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button onClick={() => navigate(`/admin/${idAdmin}/rutas`)} className="btn-cancelar">
            Cancelar
          </button>
          <button onClick={handleGuardar} className="btn-guardar" disabled={cargando}>
            {cargando ? "Guardando..." : "Crear Ruta"}
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
