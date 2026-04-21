import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { EDIT_BORN } from '../queries'

const BirthYearForm = ({ authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState('')
  const [updateYear, setUpdateYear] = useState('')

  const [changeBorn] = useMutation(EDIT_BORN, {
    awaitRefetchQueries: true,
  })

  const submit = async (event) => {
    event.preventDefault()

    try {
      await changeBorn({
        variables: { name: selectedAuthor, born: Number(updateYear) },
      })
      setSelectedAuthor('')
      setUpdateYear('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>Set birth year</h3>
      <div>
        name:
        <select value={selectedAuthor} onChange={({ target }) => setSelectedAuthor(target.value)}>
          <option value="" disabled>
            Choose an author
          </option>
          {authors.map((a) => (
            <option key={a.id} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        born:
        <input
          type="number"
          value={updateYear}
          onChange={({ target }) => setUpdateYear(target.value)}
        />
      </div>
      <button type="submit">Update</button>
    </form>
  )
}

export default BirthYearForm
