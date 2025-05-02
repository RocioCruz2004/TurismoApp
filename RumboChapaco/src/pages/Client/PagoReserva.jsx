import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { push, ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarCliente } from "../../components/Client/NavbarCliente";
import { format } from "date-fns";
import "../../assets/styles/components/PagoReserva.css";
import imagenLogo from "../../assets/images/CHAPACONEGRO.png"

const convertirImagenABase64 = (imagenRuta) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
    img.src = imagenRuta;
  });
};

export function PagoReserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [usuario, setUsuario] = useState(null);
  const [ruta, setRuta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reserva) {
      navigate(`/cliente/${id}/rutas`);
      return;
    }
    
    const fetchDatos = async () => {
      try {
        const [userSnap, rutaSnap] = await Promise.all([
          get(ref(db, `usuarios/${reserva.usuarioId}`)),
          get(ref(db, `rutas/${reserva.idRuta}`))
        ]);

        if (userSnap.exists()) setUsuario(userSnap.val());
        if (rutaSnap.exists()) setRuta(rutaSnap.val());
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatos();
  }, [reserva, id, navigate]);

  const generarPDF = async (reservaId) => {
    const doc = new jsPDF();
  
    try {
      const imagenBase64 = await convertirImagenABase64(imagenLogo);
      doc.addImage(imagenBase64, "PNG", 150, 10, 40, 25); // logo en esquina superior derecha
    } catch (error) {
      console.error("Error al cargar imagen:", error);
    }
  
    // Título
    doc.setFontSize(20);
    doc.setTextColor("#FF5B61");
    doc.text("Comprobante de Reserva", 105, 40, { align: "center" });
  
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
  
    // Tabla con estilo personalizado
    autoTable(doc, {
      startY: 60,
      head: [["Campo", "Valor"]],
      body: [
        ["Nombre del Usuario", usuario.nombre],
        ["Correo", usuario.correo],
        ["Ruta", ruta.nombre],
        ["Cantidad de Personas", reserva.cantidadPersonas],
        ["Duración", ruta.duracion],
        ["Hora", reserva.hora],
        ["Precio Total", `Bs. ${reserva.monto}`],
        ["ID de Reserva", reservaId]
      ],
      headStyles: {
        fillColor: [255, 91, 97], // #FF5B61 en RGB
        textColor: 255,
        fontStyle: 'bold',
      },
      bodyStyles: {
        textColor: 50,
      },
      styles: {
        halign: 'left',
        fontSize: 11,
      },
      theme: 'grid',
      margin: { top: 10 }
    });
  
    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Por favor, presente este comprobante al momento del tour.", 14, doc.internal.pageSize.height - 20);
  
    doc.save(`ComprobanteReserva_${reservaId}.pdf`);
  };
  

  const confirmarPago = async () => {
    try {
      const fechaCreado = format(new Date(), "yyyy-MM-dd");
      const reservaCompleta = {
        ...reserva,
        fechaCreado
      };

      const nuevaRef = await push(ref(db, "reservas"), reservaCompleta);
      const reservaId = nuevaRef.key;

      await generarPDF(reservaId);
      alert("¡Reserva confirmada! Se ha descargado tu comprobante. Por favor, preséntalo al momento del tour.");
      navigate(`/cliente/${id}/reservas`);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      alert("Hubo un error al procesar tu reserva. Por favor, intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <p>Cargando información de la reserva...</p>
      </div>
    );
  }

  if (!reserva || !usuario || !ruta) {
    return (
      <div className="loader">
        <p>No se encontró la información de la reserva.</p>
      </div>
    );
  }

  return (
    <>
      <NavbarCliente />
      <div className="pago-reserva-container">
        <div className="pago-section">
          <h2>Confirmación de Pago</h2>

          <div className="reserva-info">
            <p>
              <strong>Ruta</strong>
              {ruta.nombre}
            </p>
            <p>
              <strong>Fecha</strong>
              {reserva.fecha}
            </p>
            <p>
              <strong>Hora</strong>
              {reserva.hora}
            </p>
            <p>
              <strong>Cantidad de Personas</strong>
              {reserva.cantidadPersonas}
            </p>
            <p>
              <strong>Total a Pagar</strong>
              Bs. {reserva.monto}
            </p>
          </div>

          <div className="qr-container">
            <div className="qr-code">
              <QRCodeCanvas 
                value={JSON.stringify(reserva)} 
                size={300}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          <button className="btn-confirmar" onClick={confirmarPago}>
            Confirmar y Descargar Comprobante
          </button>
        </div>
      </div>
    </>
  );
}
