import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../data/firebaseConfig";
import logo from '../../assets/images/logo.png';
import '../../assets/styles/components/NavbarCliente.css';
import { FaHome, FaMapMarkedAlt, FaCloudSun, FaCalendarCheck, FaUser, FaSignOutAlt } from "react-icons/fa";

export function NavbarCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "navbar-cliente-link active" : "navbar-cliente-link";
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar-cliente-container">
      <div className="navbar-cliente-logo">
        <Link to={`/cliente/${id}`}>
          <img src={logo} alt="Logo" className="navbar-cliente-logo-image" />
        </Link>
      </div>
      <ul className="navbar-cliente-nav">
        <li>
          <Link to={`/cliente/${id}`} className={isActive(`/cliente/${id}`)}>
            <FaHome size={24} />
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/rutas`} className={isActive(`/cliente/${id}/rutas`)}>
            <FaMapMarkedAlt size={24} />
            <span>Rutas</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/clima`} className={isActive(`/cliente/${id}/clima`)}>
            <FaCloudSun size={24} />
            <span>Clima</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/reservas`} className={isActive(`/cliente/${id}/reservas`)}>
            <FaCalendarCheck size={24} />
            <span>Mis Reservas</span>
          </Link>
        </li>
        <li>
          <Link to={`/cliente/${id}/perfil`} className={isActive(`/cliente/${id}/perfil`)}>
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
