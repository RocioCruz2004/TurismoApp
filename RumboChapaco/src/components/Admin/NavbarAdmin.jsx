import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../data/firebaseConfig";
import { FaHome, FaBriefcase, FaMapMarkedAlt, FaChartBar, FaSignOutAlt } from "react-icons/fa";  // Iconos personalizados
import "../../assets/styles/components/NavbarAdmin.css";  // Estilos personalizados
import logo from "../../assets/images/logo.png";

export function NavbarAdmin() {
  const { id } = useParams(); // UID del admin
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "navbar-admin-link active" : "navbar-admin-link";
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar-admin-container">
      <div className="navbar-admin-logo">
        <Link to={`/admin/${id}`}>
          <img src={logo} alt="Logo" className="logo-admin" />
        </Link>
      </div>
      <ul className="navbar-admin">
        <li>
          <Link to={`/admin/${id}`} className={isActive(`/admin/${id}`)}>
            <FaHome size={32} />
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/reservas`} className={isActive(`/admin/${id}/reservas`)}>
            <FaBriefcase size={32} />
            <span>Reservas</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/rutas`} className={isActive(`/admin/${id}/rutas`)}>
            <FaMapMarkedAlt size={32} />
            <span>Rutas</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/reportes`} className={isActive(`/admin/${id}/reportes`)}>
            <FaChartBar size={32} />
            <span>Reportes</span>
          </Link>
        </li>
        <li>
          <button onClick={logout} className="navbar-admin-logout-btn">
            <FaSignOutAlt size={20} />
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
