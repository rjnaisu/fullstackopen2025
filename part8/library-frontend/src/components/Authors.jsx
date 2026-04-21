import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries'
import BirthYearForm from './BirthYearForm'

const Authors = ({ isLoggedIn }) => {
  const { data, loading, error } = useQuery(ALL_AUTHORS)

  if (loading) {
    return (
      <div>
        <h2>authors</h2>
        <div>loading…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>authors</h2>
        <div>{error.message}</div>
      </div>
    )
  }

  const authors = data?.allAuthors ?? []

  return (
    <div>
      <h2>authors</h2>
      {authors.length === 0 ? (
        <div>No authors found</div>
      ) : (
        <div>
          <table>
            <tbody>
              <tr>
                <th></th>
                <th>born</th>
                <th>books</th>
              </tr>
              {authors.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.born}</td>
                  <td>{a.bookCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoggedIn && <BirthYearForm authors={authors} />}
        </div>
      )}
    </div>
  )
}

export default Authors
