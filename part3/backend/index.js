require("dotenv").config();
const express = require("express");
const Person = require("./models/person");
const morgan = require("morgan");

const app = express();

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :data",
);

app.use(express.static("dist"));
app.use(express.json());
app.use(logger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((person) => {
      response.json(person);
    })
    .catch((err) => next(err));
});

app.get("/info", (request, response, next) => {
  Person.find({})
    .then((person) => {
      response.send(`<p>Phonebook has info for ${person.length} people</p>
      <p>${new Date().toString()}</p>`);
    })
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.name = name;
      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      });
    })
    .catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, request, response, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return response.status(400).send({ error: "malformated id" });
  }
  if (err.name === "ValidationError") {
    return response.status(400).send({ error: err.message });
  }
  next(err);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
