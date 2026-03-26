import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

function App() {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  //useEffect for checking local storage for logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome ${user.name}!`)
    } catch {
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs((prev) => prev.concat(createdBlog))
      showNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} added!`)
    } catch {
      showNotification('Error creating blog', 'error')
    }
  }

  //
  const handleLike = async (likedBlog) => {
    const updatedBlog = {
      title: likedBlog.title,
      author: likedBlog.author,
      url: likedBlog.url,
      likes: likedBlog.likes + 1,
      user: likedBlog.user.id
    }
    try {
      const savedBlog = await blogService.update(likedBlog.id, updatedBlog)
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === likedBlog.id ? { ...blog, ...savedBlog, user: blog.user } : blog
        )
      )
    } catch {
      showNotification('Error liking blog', 'error')
    }
  }

  const handleRemove = async (chosenBlog) => {
    const ok = window.confirm(`Remove blog ${chosenBlog.title} by ${chosenBlog.author}`)
    if (!ok) {
      return
    }
    try {
      await blogService.remove(chosenBlog.id)
      setBlogs((prev) => prev.filter((blog) => blog.id !== chosenBlog.id))
    } catch {
      showNotification('oops! error deleting blog', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  //Copy blogs to array, sort most->least
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <h1>Blogs</h1>
      <Notification notification={notification} />

      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div>
          <p>
            {user.name} logged in<button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="Create new blog">
            <BlogForm onCreate={handleCreateBlog} />
          </Togglable>
          {sortedBlogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              onLike={handleLike}
              onRemove={handleRemove}
              canRemove={blog.user?.username === user.username}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App
