import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaWhatsapp, FaYoutube, FaTiktok } from "react-icons/fa";
import logo from "../../assets/images/logo.png"; // Ruta actualizada
import "../../assets/styles/components/Footer.css"; // Asegúrate de que la ruta sea correcta

export function Footer() {
  return (
    <footer className="footer-container">
      {/* Logo a la izquierda */}
      <div className="footer-left">
        <Link to="/">
          <img src={logo} alt="Logo" className="footer-logo-image" />
        </Link>
      </div>

      {/* Derechos reservados centrados */}
      <div className="footer-center">
        <p>© RUMBO CHAPACO - Todos los derechos reservados.</p>
      </div>

      {/* Íconos sociales a la derecha */}
      <div className="footer-right">
        <Link to="https://www.instagram.com" target="_blank" className="social-icon">
          <FaInstagram size={24} />
        </Link>
        <Link to="https://www.facebook.com/share/1Bvk6KNWMz/" target="_blank" className="social-icon">
          <FaFacebook size={24} />
        </Link>
        <Link to="https://wa.me/+5493874086207" target="_blank" className="social-icon">
          <FaWhatsapp size={24} />
        </Link>
        <Link to="https://www.youtube.com/@RumboChapaco" target="_blank" className="social-icon">
          <FaYoutube size={24} />
        </Link>
        <Link to="https://www.tiktok.com/@rumbochapaco?_t=ZS-8vtwBCNoMy8&_r=1" target="_blank" className="social-icon">
          <FaTiktok size={24} />
        </Link>
      </div>
    </footer>
  );
}
