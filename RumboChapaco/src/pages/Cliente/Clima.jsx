import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { obtenerClimaTarija } from "../../data/openMeteo";
import { NavbarCliente } from "../../components/Cliente/NavbarCliente";
import { 
  FaSun, 
  FaCloud, 
  FaCloudRain, 
  FaCloudShowersHeavy, 
  FaSnowflake, 
  FaWind, 
  FaCloudSun, 
  FaCloudMoon, 
  FaBolt, 
  FaSmog,
  FaSpinner,
  FaWater,
  FaThermometerHalf
} from "react-icons/fa";
// Importar los estilos
import "../../assets/styles/components/Clima.css";
import { Footer } from "../../components/Footer";

export function Clima() {
  const { id } = useParams();
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarClima = async () => {
      try {
        const data = await obtenerClimaTarija();
        setClima(data);
      } catch (error) {
        console.error("Error al cargar datos del clima:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarClima();
  }, []);

  // Función para obtener el icono y clase CSS según la temperatura
  const obtenerIconoClima = (temperatura) => {
    if (temperatura > 32) {
      return {
        icon: <FaSun size={50} />,
        className: "clima-icon-sol-fuerte"
      };
    }
    if (temperatura > 28 && temperatura <= 32) {
      return {
        icon: <FaSun size={50} />,
        className: "clima-icon-sol"
      };
    }
    if (temperatura > 20 && temperatura <= 28) {
      return {
        icon: <FaCloudSun size={50} />,
        className: "clima-icon-parcial"
      };
    }
    if (temperatura > 15 && temperatura <= 20) {
      return {
        icon: <FaCloud size={50} />,
        className: "clima-icon-nube"
      };
    }
    if (temperatura > 5 && temperatura <= 15) {
      return {
        icon: <FaCloudRain size={50} />,
        className: "clima-icon-lluvia"
      };
    }
    if (temperatura <= 5) {
      return {
        icon: <FaSnowflake size={50} />,
        className: "clima-icon-nieve"
      };
    }
    // Valor por defecto
    return {
      icon: <FaCloud size={50} />,
      className: "clima-icon-nube"
    };
  };

  // Función para obtener el icono basado en la descripción del clima
  const obtenerIconoClimaDescripcion = (descripcion, temperatura) => {
    // Convertimos a minúsculas para facilitar la comparación
    const desc = descripcion ? descripcion.toLowerCase() : '';
    
    // Condiciones para clima despejado/soleado
    if (desc.includes('clear') || desc.includes('sunny')) {
      return {
        icon: <FaSun size={80} />,
        className: "clima-icon-sol"
      };
    }
    
    // Condiciones para nubes parciales
    if (desc.includes('few clouds') || desc.includes('partly cloudy')) {
      return {
        icon: <FaCloudSun size={80} />,
        className: "clima-icon-parcial"
      };
    }
    
    // Condiciones para nublado
    if (desc.includes('clouds') || desc.includes('cloudy') || desc.includes('overcast')) {
      return {
        icon: <FaCloud size={80} />,
        className: "clima-icon-nube"
      };
    }
    
    // Condiciones para llovizna/lluvia ligera
    if (desc.includes('drizzle') || desc.includes('light rain')) {
      return {
        icon: <FaCloudRain size={80} />,
        className: "clima-icon-lluvia"
      };
    }
    
    // Condiciones para lluvia fuerte
    if (desc.includes('rain') || desc.includes('shower')) {
      return {
        icon: <FaCloudShowersHeavy size={80} />,
        className: "clima-icon-lluvia-fuerte"
      };
    }
    
    // Condiciones para tormentas
    if (desc.includes('thunderstorm') || desc.includes('storm')) {
      return {
        icon: <FaBolt size={80} />,
        className: "clima-icon-tormenta"
      };
    }
    
    // Condiciones para nieve
    if (desc.includes('snow')) {
      return {
        icon: <FaSnowflake size={80} />,
        className: "clima-icon-nieve"
      };
    }
    
    // Condiciones para niebla/neblina
    if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
      return {
        icon: <FaSmog size={80} />,
        className: "clima-icon-niebla"
      };
    }
    
    // Si no coincide con ninguna descripción específica, determinamos por temperatura
    return obtenerIconoClima(temperatura);
  };

  // Función para formatear la fecha
  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Función para obtener clase de índice UV
  const obtenerClaseUV = (indice) => {
    if (indice <= 2) return "uv-bajo";
    if (indice <= 5) return "uv-moderado";
    if (indice <= 7) return "uv-alto";
    if (indice <= 10) return "uv-muy-alto";
    return "uv-extremo";
  };

  // Función para determinar la clase de fondo según el clima
  const obtenerClaseFondo = (temperatura, descripcion) => {
    // Si tenemos una descripción, usamos eso primero
    if (descripcion) {
      const desc = descripcion.toLowerCase();
      
      // Soleado/despejado
      if (desc.includes('clear') || desc.includes('sunny')) {
        return temperatura > 30 ? "clima-soleado-intenso" : "clima-soleado";
      }
      
      // Parcialmente nublado
      if (desc.includes('few clouds') || desc.includes('partly cloudy') || desc.includes('mainly clear')) {
        return "clima-parcial";
      }
      
      // Nublado
      if (desc.includes('clouds') || desc.includes('cloudy') || desc.includes('overcast')) {
        return "clima-nublado";
      }
      
      // Lluvioso (diferentes intensidades)
      if (desc.includes('drizzle') || desc.includes('light rain')) {
        return "clima-lluvioso";
      }
      
      if (desc.includes('rain') || desc.includes('shower')) {
        return "clima-lluvioso";
      }
      
      // Tormentas
      if (desc.includes('thunderstorm') || desc.includes('storm')) {
        return "clima-tormenta";
      }
      
      // Nieve
      if (desc.includes('snow')) {
        return "clima-nevado";
      }
      
      // Niebla/neblina
      if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
        return "clima-niebla";
      }
    }
    
    // Si no hay descripción o no coincide con nada específico, usamos la temperatura
    if (temperatura > 32) return "clima-soleado-intenso";
    if (temperatura > 28) return "clima-soleado";
    if (temperatura > 20) return "clima-parcial";
    if (temperatura > 15) return "clima-nublado";
    if (temperatura > 5) return "clima-lluvioso";
    if (temperatura <= 5) return "clima-nevado";
    
    // Valor por defecto
    return "clima-nublado";
  };

  // Función para generar partículas de lluvia
  const generarGotasLluvia = () => {
    const gotas = [];
    const cantidadGotas = 20;
    
    for (let i = 0; i < cantidadGotas; i++) {
      const left = `${Math.random() * 100}%`;
      const animationDuration = `${Math.random() * 0.5 + 0.7}s`;
      const animationDelay = `${Math.random() * 2}s`;
      
      gotas.push(
        <div 
          key={i}
          className="rain-drop"
          style={{
            left,
            animationDuration,
            animationDelay
          }}
        />
      );
    }
    
    return gotas;
  };

  // Función auxiliar para convertir códigos de clima a descripciones
  function obtenerDescripcionClima(codigo) {
    // Ejemplo usando códigos WMO (adapta según tu API)
    const codigosClima = {
      0: 'clear sky',
      1: 'mainly clear',
      2: 'partly cloudy',
      3: 'overcast',
      45: 'fog',
      48: 'depositing rime fog',
      51: 'light drizzle',
      53: 'moderate drizzle',
      55: 'dense drizzle',
      56: 'light freezing drizzle',
      57: 'dense freezing drizzle',
      61: 'slight rain',
      63: 'moderate rain',
      65: 'heavy rain',
      66: 'light freezing rain',
      67: 'heavy freezing rain',
      71: 'slight snow fall',
      73: 'moderate snow fall',
      75: 'heavy snow fall',
      77: 'snow grains',
      80: 'slight rain showers',
      81: 'moderate rain showers',
      82: 'violent rain showers',
      85: 'slight snow showers',
      86: 'heavy snow showers',
      95: 'thunderstorm',
      96: 'thunderstorm with slight hail',
      99: 'thunderstorm with heavy hail'
    };
    
    return codigo !== null && codigosClima[codigo] 
      ? codigosClima[codigo] 
      : null;
  }

  if (loading) {
    return (
      <>
        <NavbarCliente />
        <div className="clima-container">
          <div className="clima-loading">
            <div className="clima-loading-icon">
              <FaSpinner />
            </div>
            <p>Cargando información del clima...</p>
          </div>
        </div>
      </>
    );
  }

  if (!clima) {
    return (
      <>
        <NavbarCliente />
        <div className="clima-container">
          <div className="clima-loading">
            <p>No se pudo cargar la información del clima. Por favor, intenta nuevamente más tarde.</p>
          </div>
        </div>
      </>
    );
  }

  const hoy = clima.current;
  const dias = clima.daily;

  const iconoActual = hoy.weather && hoy.weather[0] 
    ? obtenerIconoClimaDescripcion(hoy.weather[0].main, hoy.temperature_2m)
    : obtenerIconoClima(hoy.temperature_2m);

  const claseFondo = obtenerClaseFondo(
    hoy.temperature_2m,
    hoy.weather && hoy.weather[0] ? hoy.weather[0].main : null
  );

  return (
    <>
      <NavbarCliente />
      <div className="clima-container">
        <h2 className="clima-title">Clima en Tarija</h2>

        {/* Clima actual */}
        <section className={`clima-actual ${claseFondo}`}>
          {claseFondo === "clima-lluvioso" && (
            <div className="rain-particles">
              {generarGotasLluvia()}
            </div>
          )}
          
          {/* Se elimina el icono de nube (comentado) */}
          {/* <div className={`clima-icon ${iconoActual.className}`}>
            {iconoActual.icon}
          </div> */}
          
          <h3 className="clima-actual-temperatura">{hoy.temperature_2m} °C</h3>
          
          <div className="clima-actual-detalles">
            <div className="clima-actual-detalle">
              <FaWater className="clima-actual-icono-detalle" />
              <p className="clima-actual-texto">Humedad: {hoy.relative_humidity_2m} %</p>
            </div>
            
            <div className="clima-actual-detalle">
              <FaCloudRain className="clima-actual-icono-detalle" />
              <p className="clima-actual-texto">Precipitación: {hoy.precipitation} mm</p>
            </div>
            
            <div className="clima-actual-detalle">
              <FaWind className="clima-actual-icono-detalle" />
              <p className="clima-actual-texto">Viento: {hoy.wind_speed_10m} km/h</p>
            </div>
            
            <div className="clima-actual-detalle">
              <FaThermometerHalf className="clima-actual-icono-detalle" />
              <p className="clima-actual-texto">Sensación térmica: {hoy.apparent_temperature || hoy.temperature_2m} °C</p>
            </div>
          </div>
        </section>

        {/* Pronóstico 7 días */}
        <section className="clima-pronostico">
          <h3 className="clima-pronostico-title">Pronóstico 7 días</h3>
          <div className="clima-pronostico-grid">
            {dias.time && dias.time.map((fecha, index) => {
              // Obtener información de clima para este día específico
              const tempMax = dias.temperature_2m_max[index];
              const tempMin = dias.temperature_2m_min[index];
              const weatherCode = dias.weather_code ? dias.weather_code[index] : null;
              
              // Convertir código de clima a descripción
              const weatherDesc = obtenerDescripcionClima(weatherCode);
              
              // Obtener icono basado en la descripción o temperatura máxima
              const iconoPronostico = weatherDesc 
                ? obtenerIconoClimaDescripcion(weatherDesc, tempMax)
                : obtenerIconoClima(tempMax);
              
              return (
                <div key={index} className="clima-pronostico-card">
                  <strong>{formatearFecha(fecha)}</strong>
                  <div className="clima-pronostico-temperaturas">
                    <span className="temp-max">Max: {tempMax} °C</span> | 
                    <span className="temp-min">Min: {tempMin} °C</span>
                  </div>
                  <div className="clima-pronostico-sun">
                    <span>☀️ {dias.sunrise[index]?.split("T")[1]}</span> | 
                    <span>🌙 {dias.sunset[index]?.split("T")[1]}</span>
                  </div>
                  <div className={`clima-pronostico-uv ${obtenerClaseUV(dias.uv_index_max[index])}`}>
                    UV: {dias.uv_index_max[index]}
                  </div>
                  <div className={`clima-pronostico-icon ${iconoPronostico.className}`}>
                    {iconoPronostico.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        {/* Información adicional */}
        <section className="clima-info">
          <p className="clima-info-texto">
            La información meteorológica se actualiza cada hora. 
            Última actualización: {new Date().toLocaleString('es-ES')}
          </p>
          <p className="clima-info-texto">
            Datos proporcionados por Open-Meteo. Esta información 
            es de carácter orientativo y puede variar.
          </p>
        </section>
      </div>
      <Footer/>
    </>
  );
}