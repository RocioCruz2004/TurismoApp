import React from 'react';
import { Navbar } from "../../components/common/Navbar";
import "../../assets/styles/components/SobreNosotros.css";
import { FaLeaf, FaHandshake, FaStar, FaHeart } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';
import { Footer } from "../../components/common/Footer";
import ChatbotComponent from "../../components/chat/ChatBox"; // Importar el chatbot

const SobreNosotros = () => {
  const valores = [
    {
      icon: <FaLeaf size={40} color="#FF5B61" />,
      titulo: "Sostenibilidad",
      descripcion: "Promovemos el turismo responsable y la conservación del patrimonio natural y cultural de Tarija."
    },
    {
      icon: <FaHandshake size={40} color="#FF5B61" />,
      titulo: "Autenticidad",
      descripcion: "Ofrecemos experiencias genuinas que reflejan la verdadera esencia de nuestra región."
    },
    {
      icon: <FaStar size={40} color="#FF5B61" />,
      titulo: "Calidad",
      descripcion: "Nos comprometemos a brindar servicios de excelencia y atención personalizada."
    },
    {
      icon: <FaHeart size={40} color="#FF5B61" />,
      titulo: "Pasión",
      descripcion: "Amamos lo que hacemos y lo transmitimos en cada experiencia que creamos."
    }
  ];

  const equipo = [
    {
      nombre: "Ana García",
      cargo: "Directora General",
      descripcion: "Experta en turismo sostenible con más de 10 años de experiencia en el sector."
    },
    {
      nombre: "Carlos Rodríguez",
      cargo: "Coordinador de Experiencias",
      descripcion: "Especialista en diseño de experiencias turísticas únicas y memorables."
    },
    {
      nombre: "María Torres",
      cargo: "Gestora de Comunidades",
      descripcion: "Enlace con comunidades locales y promotora del turismo responsable."
    }
  ];

  return (
    <>
      <Navbar />
      <div className="sobre-nosotros-container">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Descubre Nuestra Historia</h1>
            <p className="hero-subtitle">
              Conectando viajeros con la auténtica esencia de Tarija desde 2020
            </p>
          </div>
        </section>

        <section className="mision-vision">
          <div className="card">
            <h2>Nuestra Misión</h2>
            <p>
              Facilitar experiencias turísticas auténticas y sostenibles que conecten
              a los viajeros con la rica cultura, historia y naturaleza de Tarija,
              mientras contribuimos al desarrollo local y la preservación de nuestro
              patrimonio.
            </p>
          </div>

          <div className="card">
            <h2>Nuestra Visión</h2>
            <p>
              Ser el referente líder en turismo responsable en Tarija, reconocidos
              por crear experiencias transformadoras que beneficien tanto a
              visitantes como a comunidades locales, mientras promovemos la
              conservación de nuestros recursos naturales y culturales.
            </p>
          </div>
        </section>

        <section className="valores-section">
          <h2 className="section-title">Nuestros Valores</h2>
          <div className="valores-grid">
            {valores.map((valor, index) => (
              <div key={index} className="valor-card">
                <div className="valor-icon">{valor.icon}</div>
                <h3>{valor.titulo}</h3>
                <p>{valor.descripcion}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="equipo-section">
          <h2 className="section-title">Nuestro Equipo</h2>
          <div className="equipo-grid">
            {equipo.map((miembro, index) => (
              <div key={index} className="miembro-card">
                <div className="miembro-icon">
                  <MdPerson size={80} color="#FF5B61" />
                </div>
                <h3>{miembro.nombre}</h3>
                <p className="cargo">{miembro.cargo}</p>
                <p>{miembro.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <ChatbotComponent /> {/* Agregar el chatbot aquí */}
      <Footer />
    </>
  );
};

export default SobreNosotros;