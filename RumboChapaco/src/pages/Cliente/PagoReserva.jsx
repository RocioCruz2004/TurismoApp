import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { push, ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
import { format } from "date-fns";
import "../../assets/styles/components/PagoReserva.css"; // Asegúrate de importar el archivo CSS

export function PagoReserva() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reserva = location.state?.reserva;

  const [usuario, setUsuario] = useState(null);
  const [ruta, setRuta] = useState(null);

  useEffect(() => {
    if (!reserva) return navigate(`/cliente/${id}/rutas`);
    const fetchDatos = async () => {
      const userSnap = await get(ref(db, `usuarios/${reserva.usuarioId}`));
      const rutaSnap = await get(ref(db, `rutas/${reserva.idRuta}`));
      if (userSnap.exists()) setUsuario(userSnap.val());
      if (rutaSnap.exists()) setRuta(rutaSnap.val());
    };
    fetchDatos();
  }, [reserva]);

  const generarPDF = (reservaId) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Empresa de Turismo: Rumbo Chapaco", 14, 20);

    autoTable(doc, {
      startY: 30,
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
      styles: { halign: "left" },
    });

    doc.save(`ComprobanteReserva_${reservaId}.pdf`);
  };

  const confirmarPago = async () => {
    const fechaCreado = format(new Date(), "yyyy-MM-dd");
    const reservaCompleta = {
      ...reserva,
      fechaCreado
    };

    const nuevaRef = await push(ref(db, "reservas"), reservaCompleta);
    const reservaId = nuevaRef.key;

    generarPDF(reservaId);
    alert("Reserva confirmada. Presente el comprobante al momento del tour.");
    navigate(`/cliente/${id}/reservas`);
  };

  if (!reserva || !usuario || !ruta) return <p>Cargando...</p>;

  return (
    <div className="pago-reserva-container">
      <NavbarCliente />
      <h2>Confirmación de Pago</h2>

      <p><strong>Ruta:</strong> {ruta.nombre}</p>
      <p><strong>Fecha:</strong> {reserva.fecha}</p>
      <p><strong>Hora:</strong> {reserva.hora}</p>
      <p><strong>Cantidad:</strong> {reserva.cantidadPersonas}</p>
      <p><strong>Total:</strong> Bs. {reserva.monto}</p>

      <div className="qr-code">
        <QRCodeCanvas value={JSON.stringify(reserva)} size={400} />
      </div>

      <button onClick={confirmarPago}>Confirmar y Descargar Comprobante</button>
    </div>
  );
}
