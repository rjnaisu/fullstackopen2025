import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = () => {
  const { data: meData, loading: meLoading, error: meError } = useQuery(ME)
  const favoriteGenre = meData?.me?.favoriteGenre

  const {
    data: bookData,
    loading: bookLoading,
    error: bookError,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre,
  })
  const books = bookData?.allBooks ?? []

  if (bookLoading || meLoading) {
    return (
      <div>
        <h2>books</h2>
        <div>loading…</div>
      </div>
    )
  }

  if (bookError || meError) {
    return (
      <div>
        <h2>books</h2>
        <div>{bookError.message}</div>
      </div>
    )
  }

  return (
    <div>
      <h2>recommended books</h2>
      <h3>books in your favorite genre: {favoriteGenre}</h3>
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
              {books.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{a.author.name}</td>
                  <td>{a.published}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Recommend
