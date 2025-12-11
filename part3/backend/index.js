const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

let people = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("data", (req) => {
  return JSON.stringify(req.body);
});

const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :data",
);

app.use(express.json());
app.use(logger);
app.use(cors());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(people);
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${people.length} people</p>
    <p>${new Date().toString()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = people.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = people.find((p) => p.id === id);

  if (person) {
    people = people.filter((p) => p.id !== id);
    response.status(204).end();
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }
  if (people.find((p) => p.name === body.name)) {
    return response
      .status(400)
      .json({ error: "name already exists in phonebook" });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  people = people.concat(person);
  response.json(person);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
