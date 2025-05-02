import { Link } from "react-router-dom";
import { Navbar } from "../../components/common/Navbar";
import { FaCogs, FaGlobeAmericas, FaCommentDots, FaUserTie, FaArrowDown } from "react-icons/fa";
import "../../assets/styles/components/Inicio.css";
import imagen from '../../assets/images/inicio-img.png';
import ChatbotComponent from "../../components/chat/ChatBox"; // Importar el chatbot

export function Inicio() {
  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main className="main-content">
        <section className="hero-section-inicio">
          <div className="slogan-container">
            <h1 className="slogan">Descubre la magia de Tarija con Rumbo Chapaco</h1>
            <Link to="/login" className="explore-btn">
              Explorar Rutas
            </Link>
          </div>
          <video className="hero-video" loop muted autoPlay playsInline>
            <source src="https://i.imgur.com/zOToSz2.mp4" type="video/mp4" />
            Tu navegador no soporta el formato de video.
          </video>
          <button onClick={scrollToAbout} className="scroll-down-arrow" aria-label="Desplazarse hacia abajo">
            <FaArrowDown />
          </button>
        </section>

        <section id="about-section" className="about-section">
          <div className="about-content">
            <div className="about-image">
              <img src={imagen} alt="Tarija" />
            </div>
            <div className="about-text">
              <h2>Tu guía en el valle chapaco</h2>
              <p>
                Rumbo Chapaco es más que una plataforma de turismo; es tu compañero de viaje en la exploración de Tarija. 
                Conectamos a los viajeros con experiencias auténticas, guiadas por expertos locales que conocen cada rincón 
                de esta hermosa región. Desde los viñedos más antiguos hasta los paisajes más impresionantes, te llevamos 
                a descubrir la verdadera esencia del valle chapaco.
              </p>
              <Link to="/sobre-nosotros" className="read-more">Conoce más sobre nosotros →</Link>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>¿Por qué elegir Rumbo Chapaco?</h2>
          <div className="features-grid">
            <div className="feature">
              <FaGlobeAmericas size={40} color="#FF5B61" />
              <h3>Rutas Exclusivas</h3>
              <p>Descubre itinerarios cuidadamente seleccionados que muestran lo mejor de Tarija.</p>
            </div>
            <div className="feature">
              <FaCogs size={40} color="#FF5B61" />
              <h3>Reservas Sencillas</h3>
              <p>Reserva tus experiencias con facilidad y seguridad en nuestra plataforma intuitiva.</p>
            </div>
            <div className="feature">
              <FaCommentDots size={40} color="#FF5B61" />
              <h3>Guías Expertos</h3>
              <p>Conoce la cultura local a través de guías apasionados que comparten su conocimiento.</p>
            </div>
            <div className="feature">
              <FaUserTie size={40} color="#FF5B61" />
              <h3>Experiencias Personalizadas</h3>
              <p>Disfruta de tours adaptados a tus intereses y preferencias de viaje.</p>
            </div>
          </div>
        </section>
        <ChatbotComponent /> {/* Mostrar el chatbot */}
      </main>
    </>
  );
}
