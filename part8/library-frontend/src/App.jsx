import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import { useApolloClient, useSubscription } from '@apollo/client/react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import './App.css'
import Login from './components/Login'
import { useState } from 'react'
import Recommend from './components/Recommend'
import { BOOK_ADDED } from './queries'
import { updateBookCache } from './utils/apollo-cache'

const navClass = ({ isActive }) => (isActive ? 'app-nav-link active' : 'app-nav-link')

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(localStorage.getItem('bookapp-user-token'))
  const [toastMessage, setToastMessage] = useState(null)

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      const addedBook = data.data?.bookAdded

      if (!addedBook) {
        return
      }

      updateBookCache(client.cache, addedBook)
      setToastMessage(`Added "${addedBook.title}" by ${addedBook.author.name}`)

      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    },
  })

  const logout = async () => {
    setToken(null)
    localStorage.removeItem('bookapp-user-token')
    await client.resetStore()
  }

  return (
    <div>
      {toastMessage && <div className="app-toast">{toastMessage}</div>}
      <nav className="app-nav">
        <NavLink to="/authors" className={navClass}>
          authors
        </NavLink>
        <NavLink to="/books" className={navClass}>
          books
        </NavLink>
        {token && (
          <NavLink to="/add" className={navClass}>
            add book
          </NavLink>
        )}
        {token && (
          <NavLink to="/recommend" className={navClass}>
            recommend
          </NavLink>
        )}
        {!token ? (
          <NavLink to="/login" className={navClass}>
            login
          </NavLink>
        ) : (
          <button type="button" className="app-nav-link" onClick={logout}>
            logout
          </button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Navigate replace to="/authors" />} />
        <Route path="/authors" element={<Authors isLoggedIn={Boolean(token)} />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={token ? <NewBook /> : <Navigate replace to="/login" />} />
        <Route
          path="/recommend"
          element={token ? <Recommend /> : <Navigate replace to="/login" />}
        />
        <Route
          path="/login"
          element={token ? <Navigate replace to="/authors" /> : <Login setToken={setToken} />}
        />
      </Routes>
    </div>
  )
}

export default App
