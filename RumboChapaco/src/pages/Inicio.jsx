import { Link} from "react-router-dom";
import { Navbar} from "../components/Navbar";
import { FaCogs, FaGlobeAmericas, FaCommentDots, FaUserTie, FaArrowDown } from "react-icons/fa";
import "../assets/styles/components/Inicio.css";

export function Inicio() {
  return (
    <>
      <Navbar />
      <main className="main-content">
      <section className="hero-section-inicio">
          <div className="slogan-container">
            <h1 className="slogan">Explora las mejores rutas turísticas de Tarija</h1>
            <Link to="/login">
              <button className="login-btn">INICIAR SESIÓN</button>
            </Link>
          </div>
          <video className="hero-video" loop muted autoPlay>
            <source src="https://i.imgur.com/zOToSz2.mp4" type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
          <a href="#about-section" className="scroll-down-arrow">
            <FaArrowDown size={32} color="white" />
          </a>
        </section>

        <section id="about-section" className="about-section">
          <div className="about-content">
            <div className="about-image">
              <img src="https://i.imgur.com/fI2bugJ.png" alt="Imagen explicativa" />
            </div>
            <div className="about-text">
              <h2>¿Qué es Rumbo Chapaco?</h2>
              <p>
                Rumbo Chapaco es tu puerta de entrada a una experiencia única en Tarija. En Rumbo Chapaco nos dedicamos a conectar a los viajeros con la esencia del valle chapaco. Ofrecemos una experiencia auténtica que te permite disfrutar de las mejores rutas turísticas, guiado por expertos locales.
                <a href="/sobre-nosotros" className="read-more">Ver más...</a>
              </p>
            </div>
          </div>
        </section>


        <section className="features-section">
          <h2>Características que tiene la página web</h2>
          <div className="features-grid">
            <div className="feature">
              <FaGlobeAmericas size={40} color="#FF5B61" />
              <h3>Explora las mejores rutas</h3>
              <p>Conoce las rutas turísticas más destacadas en Tarija, con detalles sobre su recorrido, atracciones y puntos de interés.</p>
            </div>
            <div className="feature">
              <FaCogs size={40} color="#FF5B61" />
              <h3>Reserva Online</h3>
              <p>Realiza tus reservas directamente desde la plataforma, sin complicaciones y en pocos pasos.</p>
            </div>
            <div className="feature">
              <FaCommentDots size={40} color="#FF5B61" />
              <h3>Conexión con expertos</h3>
              <p>Conecta con guías locales que ofrecen experiencias turísticas personalizadas y enriquecedoras.</p>
            </div>
            <div className="feature">
              <FaUserTie size={40} color="#FF5B61" /> {/* Icono añadido */}
              <h3>Interfaz intuitiva</h3>
              <p>Disfruta de una experiencia fácil de usar, con una interfaz intuitiva diseñada tanto para novatos como para viajeros experimentados.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
