import { Link, useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa"; // Icono personalizado para "Iniciar Sesión"
import logo from "../../assets/images/logo.png"; // Ruta actualizada
import "../../assets/styles/components/Navbar.css";  // Estilos para este Navbar

export function Navbar() {
  const location = useLocation();

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Logo Tarija Turismo" className="logo-image" />
          </Link>
        </div>

        <div className="navbar-links">
          <ul className="navbar-nav">
            <li className={location.pathname === "/" ? "active" : ""}>
              <Link to="/">Inicio</Link>
            </li>
            <li className={location.pathname === "/sobre-nosotros" ? "active" : ""}>
              <Link to="/sobre-nosotros">Sobre Nosotros</Link>
            </li>
          </ul>

          <div className="navbar-auth">
            <Link to="/login" className="auth-button">
              <FaUser /> Iniciar Sesión
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
