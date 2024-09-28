const GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1";
const WEATHER_BASE_URL = "https://api.open-meteo.com/v1";

export const fetchGeoData = async (inputText) => {
  try {
    const response = await fetch(`${GEO_BASE_URL}/search?name=${inputText}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
};

export const fetchForecastData = async (latitude, longitude) => {
  try {
    const response = await fetch(`${WEATHER_BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.current_weather;
  } catch (error) {
    throw error;
  }
};