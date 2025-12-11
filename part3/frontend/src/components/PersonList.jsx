import Person from "./Person";

const PersonList = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.id} person={person} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default PersonList;
