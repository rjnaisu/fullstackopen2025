import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const { data, loading, error } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState(null)

  const books = data?.allBooks ?? []
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const visibleBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books

  if (loading) {
    return (
      <div>
        <h2>books</h2>
        <div>loading…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>books</h2>
        <div>{error.message}</div>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>
      {books.length === 0 ? (
        <div>No books found</div>
      ) : (
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>author</th>
                <th>published</th>
              </tr>
              {visibleBooks.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="genre-buttons">
            <button
              type="button"
              className={!selectedGenre ? 'genre-button active' : 'genre-button'}
              onClick={() => setSelectedGenre(null)}
            >
              all genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                className={selectedGenre === genre ? 'genre-button active' : 'genre-button'}
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Books
