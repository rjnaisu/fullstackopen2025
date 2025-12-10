const CountryList = ({ countries, showCountry }) => {
  return (
    <ul>
      {countries.map((c) => (
        <li key={c.cca3}>
          {c.name.common}
          <button value={c.cca3} onClick={() => showCountry(c)}>
            Show
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CountryList;
