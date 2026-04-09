import { useNotificationActions } from "../notification_store";
import { useAnecdotesToShow, useAnecdoteActions } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotesToShow();
  const { vote, deleteEntry } = useAnecdoteActions();
  const { show } = useNotificationActions();

  const handleVote = async (anecdote) => {
    await vote(anecdote.id);
    show(`You voted ${anecdote.content}`);
  };

  const handleDelete = async (anecdote) => {
    await deleteEntry(anecdote.id);
    show(`You deleted ${anecdote.content}`);
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && <button onClick={() => handleDelete(anecdote)}>Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
