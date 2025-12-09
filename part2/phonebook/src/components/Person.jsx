const Person = ({ person, onDelete }) => {
  const deleteHandler = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      onDelete(person.id);
    }
  };

  return (
    <li className="person" key={person.id}>
      {person.name} {person.number}
      <button onClick={deleteHandler}>Delete</button>
    </li>
  );
};

export default Person;
