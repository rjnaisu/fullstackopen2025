const Person = ({ person, onDelete }) => {
  const deleteHandler = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      onDelete(person.id);
    }
  };

  return (
    <div key={person.id}>
      {person.name} {person.number}
      <button onClick={deleteHandler}>Delete</button>
    </div>
  );
};

export default Person;
