const Filter = ({ searchName, onChange }) => {
  return (
    <div>
      Filter by name:
      <input value={searchName} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};

export default Filter;
