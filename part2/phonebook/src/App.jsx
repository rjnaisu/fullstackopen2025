import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import personsService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    personsService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    const existing = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );

    const personObject = {
      name: newName,
      number: newNumber,
    };

    if (existing) {
      if (
        window.confirm(
          `${newName} is already in the phonebook, replace the old number?`,
        )
      ) {
        const updatedPerson = { ...existing, number: newNumber };
        personsService
          .update(existing.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === existing.id ? returnedPerson : person,
              ),
            );
            setNewName("");
            setNewNumber("");
          });
        return;
      }
      return;
    }

    personsService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const removePerson = (id) => {
    personsService.remove(id).then(() => {
      setPersons((persons) => persons.filter((person) => person.id !== id));
    });
  };

  const personsToShow = searchName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(searchName.toLowerCase()),
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchName={searchName} onChange={setSearchName} />
      <h3>Add a new person</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={setNewName}
        onNumberChange={setNewNumber}
        onSubmit={addPerson}
      />
      <h3>Numbers</h3>
      <PersonList persons={personsToShow} onDelete={removePerson} />
    </div>
  );
};

export default App;
