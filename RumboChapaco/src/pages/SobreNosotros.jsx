import { Navbar } from "../components/Navbar";
import "../assets/styles/components/SobreNosotros.css";
import { GiSeedling, GiHeartBeats } from "react-icons/gi";
import { FaGem, FaUserTie, FaUserFriends, FaRoute } from "react-icons/fa";
import { BiDiamond } from "react-icons/bi";

export function SobreNosotros() {
  return (
    <>
      <Navbar />
      <main className="sobre-nosotros-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Nuestra Historia en Tarija</h1>
            <p className="hero-subtitle">Conectando viajeros con la esencia del valle chapaco desde 2015</p>
          </div>
        </section>

        <section className="mision-vision">
          <div className="card">
            <h2>Misión</h2>
            <p>Facilitar experiencias turísticas auténticas en Tarija, promoviendo el desarrollo sostenible de la región y creando conexiones significativas entre visitantes y comunidades locales.</p>
          </div>
          <div className="card">
            <h2>Visión</h2>
            <p>Ser el referente de turismo responsable en el sur de Bolivia, reconocidos por nuestra innovación, calidad de servicio y compromiso con la preservación del patrimonio cultural y natural.</p>
          </div>
        </section>

        <section className="valores-section">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon"><GiSeedling size={40} color="#FF5B61" /></div>
              <h3>Sostenibilidad</h3>
              <p>Promovemos prácticas turísticas que respetan y preservan el medio ambiente y las culturas locales.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon"><GiSeedling size={40} color="#FF5B61" /></div>
              <h3>Autenticidad</h3>
              <p>Ofrecemos experiencias genuinas que reflejan la verdadera esencia de Tarija y su gente.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon"><FaGem size={40} color="#FF5B61" /></div>
              <h3>Calidad</h3>
              <p>Cada servicio es cuidadosamente seleccionado para garantizar excelencia y satisfacción.</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon"><GiHeartBeats size={40} color="#FF5B61" /></div>
              <h3>Pasión</h3>
              <p>Amamos lo que hacemos y eso se refleja en cada detalle de tu experiencia con nosotros.</p>
            </div>
          </div>
        </section>

        <section className="equipo-section">
          <h2 className="section-title">Conoce a Nuestro Equipo</h2>
          <div className="equipo-grid">
            <div className="miembro-card">
              <div className="miembro-icon"><FaUserTie size={60} color="#FF5B61" /></div>
              <h3>Juan Pérez</h3>
              <p className="cargo">Fundador & Guía</p>
              <p>Nacido en Tarija, con más de 15 años de experiencia en turismo regional.</p>
            </div>
            <div className="miembro-card">
              <div className="miembro-icon"><FaUserFriends size={60} color="#FF5B61" /></div>
              <h3>María González</h3>
              <p className="cargo">Directora de Operaciones</p>
              <p>Especialista en turismo sostenible y desarrollo comunitario.</p>
            </div>
            <div className="miembro-card">
              <div className="miembro-icon"><FaRoute size={60} color="#FF5B61" /></div>
              <h3>+80 Encargados en Turismo</h3>
              <p className="cargo">Expertos en Rutas</p>
              <p>Conocen como nadie los caminos menos transitados del valle central.</p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}