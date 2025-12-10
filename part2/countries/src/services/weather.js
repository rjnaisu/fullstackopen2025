import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

export const getWeather = async (lat, lon) => {
  const url = "https://weather.googleapis.com/v1/currentConditions:lookup";

  const params = {
    key: apiKey,
    "location.latitude": lat,
    "location.longitude": lon,
    unitsSystem: "METRIC",
  };

  const response = await axios.get(url, { params });
  return response.data;
};
