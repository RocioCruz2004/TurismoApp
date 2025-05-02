import { useEffect, useRef, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../data/firebaseConfig";
import { NavbarAdmin } from "../../components/Admin/NavbarAdmin";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "../../assets/styles/components/Reportes.css";
import logo from "../../assets/images/CHAPACONEGRO.png";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Reportes() {
  const [reservas, setReservas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [reporteMensual, setReporteMensual] = useState({ resumen: [], detalles: [] });
  // Estados para sección ANUAL
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFin, setAnioFin] = useState("");
  const [reporteAnual, setReporteAnual] = useState({ resumen: [], detalles: [] });

  // Estados para sección DIARIA
  const [fechaDiaInicio, setFechaDiaInicio] = useState("");
  const [fechaDiaFin, setFechaDiaFin] = useState("");
  const [reporteDiario, setReporteDiario] = useState({ resumen: [], detalles: [] });

  // Estados para sección RUTA
  const [reporteRuta, setReporteRuta] = useState({ resumen: [], detalles: [] });
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);

  const chartRef = useRef(null);
  const chartRefAnual = useRef(null);
  const chartRefDiario = useRef(null);
  const chartRefRuta = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await get(ref(db, "reservas"));
      if (snap.exists()) {
        const data = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
        setReservas(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    get(ref(db, "rutas")).then(snap => {
      if (snap.exists()) {
        const rutas = Object.values(snap.val());
        const categoriasUnicas = [...new Set(rutas.map(r => r.categoria).filter(Boolean))];
        setCategorias(categoriasUnicas);
      }
    });
  }, []);
  
  const generarReporteMensual = () => {
    const conteo = {};
    const detalles = [];

    reservas.forEach(res => {
      const fecha = new Date(res.fechaCreado);
      const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`;
      const inicio = fechaInicio ? new Date(`${fechaInicio}-01`) : null;
      const fin = fechaFin ? new Date(`${fechaFin}-01`) : null;

      if (
        (!inicio || fecha >= inicio) &&
        (!fin || fecha <= fin)
      ) {
        conteo[clave] = (conteo[clave] || 0) + 1;
        detalles.push(res);
      }
    });

    const resumen = Object.entries(conteo).map(([mes, cantidad]) => ({ mes, cantidad }));
    setReporteMensual({ resumen, detalles });
  };

  const descargarPDF = async () => {
    const doc = new jsPDF();
    
    // Agregar logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    
    doc.setFontSize(16);
    doc.text("Reporte de Reservas Mensuales", 60, 20);
    doc.setFontSize(12);
    doc.text(`Desde: ${fechaInicio || "todos"} Hasta: ${fechaFin || "actual"}`, 60, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Mes", "Cantidad"]],
      body: reporteMensual.resumen.map(r => [r.mes, r.cantidad])
    });

    if (chartRef.current) {
      const canvas = chartRef.current.canvas;
      const image = await html2canvas(canvas);
      const imgData = image.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 15, doc.lastAutoTable.finalY + 10, 180, 90);
    }

    doc.text("Detalle de reservas:", 20, doc.lastAutoTable.finalY + 110);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 115,
      head: [["ID", "Usuario", "Ruta", "Fecha creado", "Fecha reserva", "Monto"]],
      body: reporteMensual.detalles.map(r => [
        r.id,
        r.usuarioId,
        r.idRuta,
        r.fechaCreado,
        r.fecha,
        `Bs. ${r.monto}`
      ])
    });

    doc.save("reporte_reservas_mensual.pdf");
  };

  const descargarPDFAnual = async () => {
    const doc = new jsPDF();
    
    // Agregar logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    
    doc.setFontSize(16);
    doc.text("Reporte de Reservas por Año", 60, 20);
    doc.text(`Desde: ${anioInicio || "todos"} Hasta: ${anioFin || "actual"}`, 60, 30);
  
    autoTable(doc, {
      startY: 40,
      head: [["Año", "Cantidad"]],
      body: reporteAnual.resumen.map(r => [r.anio, r.cantidad])
    });
  
    if (chartRefAnual.current) {
      const canvas = chartRefAnual.current.canvas;
      const image = await html2canvas(canvas);
      const imgData = image.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 15, doc.lastAutoTable.finalY + 10, 180, 90);
    }
  
    doc.text("Detalle de reservas:", 20, doc.lastAutoTable.finalY + 110);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 115,
      head: [["ID", "Usuario", "Ruta", "Fecha creado", "Fecha reserva", "Monto"]],
      body: reporteAnual.detalles.map(r => [
        r.id, r.usuarioId, r.idRuta, r.fechaCreado, r.fecha, `Bs. ${r.monto}`
      ])
    });
  
    doc.save("reporte_reservas_anual.pdf");
  }; 
  
  const descargarPDFDiario = async () => {
    const doc = new jsPDF();
    
    // Agregar logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    
    doc.setFontSize(16);
    doc.text("Reporte de Reservas Diarias", 60, 20);
    doc.text(`Desde: ${fechaDiaInicio || "todos"} Hasta: ${fechaDiaFin || "actual"}`, 60, 30);
  
    autoTable(doc, {
      startY: 40,
      head: [["Fecha", "Cantidad"]],
      body: reporteDiario.resumen.map(r => [r.fecha, r.cantidad])
    });
  
    if (chartRefDiario.current) {
      const canvas = chartRefDiario.current.canvas;
      const image = await html2canvas(canvas);
      const imgData = image.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 15, doc.lastAutoTable.finalY + 10, 180, 90);
    }
  
    doc.text("Detalle de reservas:", 20, doc.lastAutoTable.finalY + 110);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 115,
      head: [["ID", "Usuario", "Ruta", "Fecha creado", "Fecha reserva", "Monto"]],
      body: reporteDiario.detalles.map(r => [
        r.id, r.usuarioId, r.idRuta, r.fechaCreado, r.fecha, `Bs. ${r.monto}`
      ])
    });
  
    doc.save("reporte_reservas_diario.pdf");
  };  
 
  const descargarPDFRuta = async () => {
    const doc = new jsPDF();
    
    // Agregar logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 20);
    
    doc.setFontSize(16);
    doc.text("Reporte de Reservas por Ruta", 60, 20);
  
    autoTable(doc, {
      startY: 40,
      head: [["Ruta", "Cantidad"]],
      body: reporteRuta.resumen.map(r => [r.nombreRuta, r.cantidad])
    });
  
    if (chartRefRuta.current) {
      const canvas = chartRefRuta.current.canvas;
      const image = await html2canvas(canvas);
      const imgData = image.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 15, doc.lastAutoTable.finalY + 10, 180, 90);
    }
  
    doc.text("Detalle de reservas:", 20, doc.lastAutoTable.finalY + 110);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 115,
      head: [["ID", "Usuario", "Ruta", "Fecha creado", "Fecha reserva", "Monto"]],
      body: reporteRuta.detalles.map(r => [
        r.id, r.usuarioId, r.idRuta, r.fechaCreado, r.fecha, `Bs. ${r.monto}`
      ])
    });
  
    doc.save("reporte_reservas_ruta.pdf");
  };

  const generarReporteAnual = () => {
    const conteo = {};
    const detalles = [];
  
    reservas.forEach(res => {
      const anio = new Date(res.fechaCreado).getFullYear();
      if (
        (!anioInicio || anio >= parseInt(anioInicio)) &&
        (!anioFin || anio <= parseInt(anioFin))
      ) {
        conteo[anio] = (conteo[anio] || 0) + 1;
        detalles.push(res);
      }
    });
  
    const resumen = Object.entries(conteo).map(([anio, cantidad]) => ({ anio, cantidad }));
    setReporteAnual({ resumen, detalles });
  };
  
  const generarReporteDiario = () => {
    const conteo = {};
    const detalles = [];
  
    reservas.forEach(res => {
      const fecha = res.fechaCreado;
      if (
        (!fechaDiaInicio || fecha >= fechaDiaInicio) &&
        (!fechaDiaFin || fecha <= fechaDiaFin)
      ) {
        conteo[fecha] = (conteo[fecha] || 0) + 1;
        detalles.push(res);
      }
    });
  
    const resumen = Object.entries(conteo).map(([fecha, cantidad]) => ({ fecha, cantidad }));
    setReporteDiario({ resumen, detalles });
  };
  
  const generarReporteRuta = () => {
    const conteo = {};
    const detalles = [];
  
    reservas.forEach(res => {
      const rutaId = res.idRuta;
      conteo[rutaId] = (conteo[rutaId] || 0) + 1;
      detalles.push(res);
    });
  
    get(ref(db, "rutas")).then(snap => {
      if (snap.exists()) {
        const rutas = snap.val();
        const resumen = Object.entries(conteo)
          .filter(([idRuta]) => {
            const categoriaRuta = rutas[idRuta]?.categoria;
            return categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(categoriaRuta);
          })
          .map(([idRuta, cantidad]) => ({
            nombreRuta: rutas[idRuta]?.nombre || "Ruta desconocida",
            cantidad
          }));
        const detallesFiltrados = detalles.filter(d =>
          categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(rutas[d.idRuta]?.categoria)
        );
        setReporteRuta({ resumen, detalles: detallesFiltrados });
      }
    });
  };
  
  const resumen = reporteMensual.resumen || [];
  const cantidades = resumen.map(r => r.cantidad);
  const max = Math.max(...cantidades);
  const min = Math.min(...cantidades);

  return (
    <>
      <NavbarAdmin />
      <div className="reportes-container">
        <h1 className="reportes-title">Generar Reportes</h1>

        <details open>
          <summary><strong>Reservas Mensuales</strong></summary>

          <div>
            <label>Mes inicio:</label>
            <input
              type="month"
              value={fechaInicio}
              max={fechaFin || undefined}
              onChange={(e) => setFechaInicio(e.target.value)}
            />

            <label>Mes fin:</label>
            <input
              type="month"
              value={fechaFin}
              min={fechaInicio || undefined}
              onChange={(e) => setFechaFin(e.target.value)}
            />

            <button onClick={generarReporteMensual}>Generar</button>
          </div>

          {resumen.length > 0 && (
            <>
              <table>
                <thead>
                  <tr><th>Mes</th><th>Cantidad</th></tr>
                </thead>
                <tbody>
                  {resumen.map((r, i) => (
                    <tr key={i} className={
                      r.cantidad === max ? "highlight-max" :
                      r.cantidad === min ? "highlight-min" : ""
                    }>
                      <td>{r.mes}</td>
                      <td>{r.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <Bar
                  ref={chartRef}
                  data={{
                    labels: resumen.map(r => r.mes),
                    datasets: [{
                      label: 'Cantidad de Reservas',
                      data: resumen.map(r => r.cantidad),
                      backgroundColor: 'rgba(75,192,192,0.6)',
                    }]
                  }}
                />
              </div>

              <button className="download-btn" onClick={descargarPDF}>📥 Descargar PDF</button>
            </>
          )}
        </details>

        {/* ---------------- SECCIÓN ANUAL ---------------- */}
        <details>
          <summary><strong>Reservas Anuales</strong></summary>

          <div>
            <label>Año desde:</label>
            <input type="number" value={anioInicio} onChange={(e) => setAnioInicio(e.target.value)} />

            <label>Año hasta:</label>
            <input type="number" value={anioFin} onChange={(e) => setAnioFin(e.target.value)} />

            <button onClick={generarReporteAnual}>Generar</button>
          </div>

          {reporteAnual.resumen.length > 0 && (
            <>
              <table>
                <thead><tr><th>Año</th><th>Cantidad</th></tr></thead>
                <tbody>
                  {reporteAnual.resumen.map((r, i) => (
                    <tr key={i} className={
                      r.cantidad === Math.max(...reporteAnual.resumen.map(r => r.cantidad)) ? "highlight-max" :
                      r.cantidad === Math.min(...reporteAnual.resumen.map(r => r.cantidad)) ? "highlight-min" : ""
                    }>
                      <td>{r.anio}</td>
                      <td>{r.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <Bar ref={chartRefAnual}
                  data={{
                    labels: reporteAnual.resumen.map(r => r.anio),
                    datasets: [{
                      label: 'Cantidad de Reservas por Año',
                      data: reporteAnual.resumen.map(r => r.cantidad),
                      backgroundColor: 'rgba(255,159,64,0.6)',
                    }]
                  }}
                />
              </div>

              <button className="download-btn" onClick={descargarPDFAnual}>📥 Descargar PDF</button>
            </>
          )}
        </details>

        {/* ---------------- SECCIÓN DIARIA ---------------- */}
        <details>
          <summary><strong>Reservas Diarias</strong></summary>

          <div>
            <label>Fecha desde:</label>
            <input type="date" value={fechaDiaInicio} onChange={(e) => setFechaDiaInicio(e.target.value)} />

            <label>Fecha hasta:</label>
            <input type="date" value={fechaDiaFin} onChange={(e) => setFechaDiaFin(e.target.value)} />

            <button onClick={generarReporteDiario}>Generar</button>
          </div>

          {reporteDiario.resumen.length > 0 && (
            <>
              <table>
                <thead><tr><th>Fecha</th><th>Cantidad</th></tr></thead>
                <tbody>
                  {reporteDiario.resumen.map((r, i) => (
                    <tr key={i} className={
                      r.cantidad === Math.max(...reporteDiario.resumen.map(r => r.cantidad)) ? "highlight-max" :
                      r.cantidad === Math.min(...reporteDiario.resumen.map(r => r.cantidad)) ? "highlight-min" : ""
                    }>
                      <td>{r.fecha}</td>
                      <td>{r.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <Bar ref={chartRefDiario}
                  data={{
                    labels: reporteDiario.resumen.map(r => r.fecha),
                    datasets: [{
                      label: 'Cantidad de Reservas Diarias',
                      data: reporteDiario.resumen.map(r => r.cantidad),
                      backgroundColor: 'rgba(153,102,255,0.6)',
                    }]
                  }}
                />
              </div>

              <button className="download-btn" onClick={descargarPDFDiario}>📥 Descargar PDF</button>
            </>
          )}
        </details>

        {/* ---------------- SECCIÓN POR RUTA ---------------- */}
        <details>
          <summary><strong>Reservas por Ruta</strong></summary>

          <div className="category-filters">
            <strong>Categorías:</strong>
            {categorias.length === 0 ? (
              <p>Cargando categorías...</p>
            ) : (
              categorias.map((cat, i) => (
                <label key={i} className="category-label">
                  <input
                    type="checkbox"
                    value={cat}
                    checked={categoriasSeleccionadas.includes(cat)}
                    onChange={(e) => {
                      const valor = e.target.value;
                      if (e.target.checked) {
                        setCategoriasSeleccionadas([...categoriasSeleccionadas, valor]);
                      } else {
                        setCategoriasSeleccionadas(categoriasSeleccionadas.filter(c => c !== valor));
                      }
                    }}
                  /> {cat}
                </label>
              ))
            )}
          </div>

          <button onClick={generarReporteRuta}>Generar</button>

          {reporteRuta.resumen.length > 0 && (
            <>
              <table>
                <thead><tr><th>Ruta</th><th>Cantidad</th></tr></thead>
                <tbody>
                  {reporteRuta.resumen.map((r, i) => (
                    <tr key={i} className={
                      r.cantidad === Math.max(...reporteRuta.resumen.map(r => r.cantidad)) ? "highlight-max" :
                      r.cantidad === Math.min(...reporteRuta.resumen.map(r => r.cantidad)) ? "highlight-min" : ""
                    }>
                      <td>{r.nombreRuta}</td>
                      <td>{r.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="chart-container">
                <Bar
                  ref={chartRefRuta}
                  data={{
                    labels: reporteRuta.resumen.map(r => r.nombreRuta),
                    datasets: [{
                      label: 'Reservas por Ruta',
                      data: reporteRuta.resumen.map(r => r.cantidad),
                      backgroundColor: 'rgba(255,99,132,0.6)',
                    }]
                  }}
                />
              </div>

              <button className="download-btn" onClick={descargarPDFRuta}>📥 Descargar PDF</button>
            </>
          )}
        </details>
      </div>
    </>
  );
}