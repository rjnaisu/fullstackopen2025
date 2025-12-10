import * as weatherService from "../services/weather";
import { useEffect, useState } from "react";

const CountryFacts = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [lat, lon] = country.latlng;

  useEffect(() => {
    weatherService.getWeather(lat, lon).then((data) => {
      setWeather(data ?? null);
    });
  }, [lat, lon]);

  return (
    <div className="card">
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages || []).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />
      <h2>Weather in {country.capital}</h2>
      {!weather && <p>Loading...</p>}
      {weather && (
        <>
          <p>Temperature is: {weather.temperature.degrees} Celsius</p>
          <img
            src={`${weather.weatherCondition.iconBaseUri}.svg`}
            alt={weather.weatherCondition.description.text}
          />
          <p>Wind speed: {weather.wind.speed.value}km/h</p>
        </>
      )}
    </div>
  );
};

export default CountryFacts;
