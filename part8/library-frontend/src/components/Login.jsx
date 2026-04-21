import { useState } from 'react'
import { LOGIN } from '../queries'
import { useMutation } from '@apollo/client/react'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('bookapp-user-token', token)
      setUsername('')
      setPassword('')
      setErrorMessage('')
    },
    onError: (error) => {
      setErrorMessage(error.message)
    },
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <h2>login</h2>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={submit}>
        <div>
          Username:
          <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          Password:
          <input
            value={password}
            type={'password'}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
export default Login
