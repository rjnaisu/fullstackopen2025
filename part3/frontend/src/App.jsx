import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import PersonList from "./components/PersonList";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
            setSuccessMessage("Updated successfully");
            setTimeout(() => {
              setSuccessMessage(null);
            }, 2000);
          })
          .catch((error) => {
            setErrorMessage(`${existing.name} is no longer in phonebook`);
            setTimeout(() => {
              setErrorMessage(null);
            }, 2000);
            setPersons(persons.filter((person) => person.id !== existing.id));
          });
        return;
      }
      return;
    }

    personsService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage("Added Successfully");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
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
      <Notification message={successMessage} />
      <ErrorMessage message={errorMessage} />
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
