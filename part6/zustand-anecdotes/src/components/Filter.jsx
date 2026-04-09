import { useAnecdoteActions } from "../store";

const Filter = () => {
  const { setFilter } = useAnecdoteActions();

  const handleChange = (event) => {
    const query = event.target.value;
    setFilter(query);
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default Filter;
