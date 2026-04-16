import { createContext, useEffect, useState } from 'react'
import anecdoteService from '../services/anecdotes'

export const AnecdotesContext = createContext()

export function AnecdotesProvider({ children }) {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes((prevAnecdotes) => prevAnecdotes.concat(newAnecdote))
  }

  const removeAnecdote = async (id) => {
    await anecdoteService.removeAnecdote(id)
    setAnecdotes((prevAnecdotes) => prevAnecdotes.filter((a) => a.id !== id))
  }

  return (
    <AnecdotesContext.Provider value={{ anecdotes, addAnecdote, removeAnecdote }}>
      {children}
    </AnecdotesContext.Provider>
  )
}
