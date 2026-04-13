const baseUrl = "http://localhost:3001/anecdotes";

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }
  return await response.json();
};

export const createAnecdote = async (newAnecdote) => {
  const anecdote = {
    ...newAnecdote,
    votes: 0,
  };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anecdote),
  };
  const response = await fetch(baseUrl, options);
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to add new anecdote");
  }
  return await response.json();
};

export const updateAnecdote = async (anecdote) => {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anecdote),
  };

  const response = await fetch(`${baseUrl}/${anecdote.id}`, options);

  if (!response.ok) {
    throw new Error("Failed to update note");
  }
  return await response.json();
};
