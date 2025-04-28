import { Link, useNavigate, useParams } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../data/firebaseConfig";
import { FaHome, FaBriefcase, FaMapMarkedAlt, FaChartBar, FaSignOutAlt } from "react-icons/fa";  // Iconos personalizados
import "../../assets/styles/components/NavbarAdmin.css";  // Estilos personalizados
import logo from "../../assets/logo.png";

export function NavbarAdmin() {
  const { id } = useParams(); // UID del admin
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar-admin-container">
      <div className="navbar-admin-logo">
        <img src={logo} alt="Logo" className="logo-admin" />
      </div>
      <ul className="navbar-admin">
        <li>
          <Link to={`/admin/${id}`} className="navbar-admin-link">
            <FaHome size={32} />
            <span>Inicio</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/reservas`} className="navbar-admin-link">
            <FaBriefcase size={32} />
            <span>Reservas</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/rutas`} className="navbar-admin-link">
            <FaMapMarkedAlt size={32} />
            <span>Rutas</span>
          </Link>
        </li>
        <li>
          <Link to={`/admin/${id}/reportes`} className="navbar-admin-link">
            <FaChartBar size={32} />
            <span>Reportes</span>
          </Link>
        </li>
        <li>
          <button onClick={logout} className="navbar-admin-logout-btn">
            <FaSignOutAlt size={20} />
            Cerrar sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}
