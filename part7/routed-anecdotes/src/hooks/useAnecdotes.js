import { useContext } from 'react'
import { AnecdotesContext } from '../context/AnecdotesContext'

export function useAnecdotes() {
    const context = useContext(AnecdotesContext)

    if (!context) {
        throw new Error('useAnecdotes must be used within an AnecdotesProvider')
    }

    return context
}
