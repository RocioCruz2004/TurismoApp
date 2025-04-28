export async function obtenerClimaTarija() {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=-21.5355&longitude=-64.7296&daily=temperature_2m_max,temperature_2m_min,sunset,sunrise,uv_index_max,weather_code,temperature_2m_mean&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,wind_speed_80m,uv_index,is_day&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto";
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el clima ❌", error);
      return null;
    }
  }
  