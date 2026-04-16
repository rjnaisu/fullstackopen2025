import { useAnecdotes } from "../hooks/useAnecdotes"

const AnecdoteList = () => {
  const { anecdotes, removeAnecdote } = useAnecdotes()

  const handleRemove = async (id) => {
    await removeAnecdote(id)
  }

  return (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id}>{anecdote.content}
        <button onClick={() => handleRemove(anecdote.id)}>Delete</button>
      </li>)}
    </ul>
  </div>
  )
}
export default AnecdoteList
