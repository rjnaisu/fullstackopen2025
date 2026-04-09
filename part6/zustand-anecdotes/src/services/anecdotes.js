//import { generateId } from '../store'

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return await response.json();
};

const createNew = async (content) => {
  const data = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, id: null, votes: 0 }),
  };

  const response = await fetch(baseUrl, data);
  if (!response.ok) {
    throw new Error("Failed to create anecdote");
  }

  return await response.json();
};

const update = async (id, anecdote) => {
  const data = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anecdote),
  };

  const response = await fetch(`${baseUrl}/${id}`, data);

  if (!response.ok) {
    throw new Error("Failed to update anecdote");
  }

  return await response.json();
};

const deleteEntry = async (id) => {
  const data = {
    method: "DELETE",
  };
  const response = await fetch(`${baseUrl}/${id}`, data);

  if (!response.ok) {
    throw new Error("Failed to delete anecdote");
  }

  return response.ok;
};

export default { getAll, createNew, update, deleteEntry };
