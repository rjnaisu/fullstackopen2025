import { useNotificationActions } from "../notification_store";
import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions();
  const { show } = useNotificationActions();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    await add(content);
    show(`You created ${content}`);
    e.target.reset();
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
