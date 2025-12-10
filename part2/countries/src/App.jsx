import { useState, useEffect } from "react";
import * as countryService from "./services/countries";
import CountryList from "./components/CountryList";
import CountryFacts from "./components/CountryFacts";

function App() {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService.getAll().then((data) => {
      console.log(data.length);
      setCountries(data);
    });
  }, []);

  const filteredCountries = query
    ? countries.filter((c) =>
        c.name.common.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  const showCountry = (country) => {
    setQuery(country.name.common);
  };

  let content = null;

  if (filteredCountries.length > 10) {
    content = <p>Too many matches</p>;
  }
  if (filteredCountries.length > 1 && filteredCountries.length < 10) {
    content = (
      <CountryList countries={filteredCountries} showCountry={showCountry} />
    );
  }
  if (filteredCountries.length === 1) {
    content = <CountryFacts country={filteredCountries[0]} />;
  }

  return (
    <div>
      <h1>REST Countries</h1>
      <div className="card">
        {countries.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div>
            <p>Find Countries:</p>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            {content}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
