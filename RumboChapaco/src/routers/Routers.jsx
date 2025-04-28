import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Inicio } from "../pages/Inicio";
import { SobreNosotros } from "../pages/SobreNosotros";
import { PanelCliente } from "../pages/Cliente/PanelCliente";
import { PanelAdmin } from "../pages/Admin/PanelAdmin";
import { Registro } from "../pages/Registro";
import { Login } from "../pages/Login";
import { RecuperarContrasena } from "../pages/RecuperarContrasena";
//SECCION CLIENTE
import { MiPerfil } from "../pages/Cliente/MiPerfil";
import { RutasDisponibles } from "../pages/Cliente/RutasDisponibles";
import { MisReservas } from "../pages/Cliente/MisReservas";
import { Clima } from "../pages/Cliente/Clima";
import { DetalleRuta } from "../pages/Cliente/DetalleRuta";
import { ReservarRuta } from "../pages/Cliente/ReservarRuta";
import { PagoReserva } from "../pages/Cliente/PagoReserva";
//SECCION ADMINISTRADOR
import { ListarRutas } from "../pages/Admin/ListarRutas";
import { ListarReservas } from "../pages/Admin/ListarReservas";
import { Reportes } from "../pages/Admin/Reportes";
import { AñadirReserva } from "../pages/Admin/AñadirReserva";
import { EditarReserva } from "../pages/Admin/EditarReserva";
import { EditarRuta } from "../pages/Admin/EditarRuta";
import { AñadirRuta } from "../pages/Admin/AñadirRuta";




export function Routers() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/cliente/:id" element={<PanelCliente />} />
                <Route path="/admin/:id" element={<PanelAdmin />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/recuperar" element={<RecuperarContrasena />} />

                <Route path="/cliente/:id/perfil" element={<MiPerfil />} />
                <Route path="/cliente/:id/rutas" element={<RutasDisponibles />} />
                <Route path="/cliente/:id/reservas" element={<MisReservas />} />
                <Route path="/cliente/:id/clima" element={<Clima />} />
                <Route path="/cliente/:id/rutas/detalleruta/:idRuta" element={<DetalleRuta/>}/>
                <Route path="/cliente/:id/rutas/detalleruta/:idRuta/reservar/:idRuta" element={<ReservarRuta />} />
                <Route path="/cliente/:id/pago" element={<PagoReserva />} />

                <Route path="/admin/:id/rutas" element={<ListarRutas />} />
                <Route path="/admin/:id/reservas" element={<ListarReservas />} />
                <Route path="/admin/:id/reportes" element={<Reportes />} />
                <Route path="/admin/:id/reservas/añadir" element={<AñadirReserva />} />
                <Route path="/admin/:idAdmin/reservas/editar/:idReserva" element={<EditarReserva />} />
                <Route path="/admin/:id/rutas/editar/:idRuta" element={<EditarRuta />} />
                <Route path="/admin/:id/rutas/añadir" element={<AñadirRuta />} />


            </Routes>
        </BrowserRouter>
    )
}