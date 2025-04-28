import { Link, useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../data/firebaseConfig";
import logo from '../../assets/logo.png';
import '../../assets/styles/components/NavbarCliente.css';
import { FaHome, FaMapMarkedAlt, FaCloudSun, FaCalendarCheck, FaUser, FaSignOutAlt } from "react-icons/fa";

export function NavbarCliente() {
  const { id } = useParams(); // UID del cliente
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar-cliente-container">
      <div className="navbar-cliente-logo">
        <img src={logo} alt="Logo" className="navbar-cliente-logo-image" />
      </div>
      <ul className="navbar-cliente-nav">
        <li>
          <Link to={`/cliente/${id}`} className="navbar-cliente-link">
            <FaHome size={24} />
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/rutas`} className="navbar-cliente-link">
            <FaMapMarkedAlt size={24} />
            <span>Rutas</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/clima`} className="navbar-cliente-link">
            <FaCloudSun size={24} />
            <span>Clima</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/reservas`} className="navbar-cliente-link">
            <FaCalendarCheck size={24} />
            <span>Mis Reservas</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/perfil`} className="navbar-cliente-link">
            <FaUser size={24} />
            <span>Mi Perfil</span>
          </Link>
        </li>
        <li>
          <button className="navbar-cliente-auth-button" onClick={logout}>
            <FaSignOutAlt size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
