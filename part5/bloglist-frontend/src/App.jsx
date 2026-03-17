import { useState, useEffect} from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  //useEffect for checking local storage for logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("handleLogin: ", { username, password });
    try {
      const user = await loginService.login({
        username,
        password,
      });
      // add blogService.setToken for setting user tokens
      // set loging details in locaal storage for persistence on refresh, stringify obj to JSON for storage
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      showNotification(`Welcome ${user.name}!`);
    } catch (err) {
      console.error("login failed", err);
      showNotification("Wrong username or password", "error");
    }
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));
      setNewBlog({ title: "", author: "", url: "" });
      showNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} added!`);
    } catch (error) {
      console.error("Error creating blog: ", error);
      showNotification("Error creating blog", "error");
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to the application</h2>
      <Notification notification={notification} />
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)} />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)} />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogForm = () => (
    <form onSubmit={handleNewBlog}>
      <h2>Create new</h2>
      <div>
        <label>
          title:
          <input
            type="text"
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input
            type="text"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input
            type="text"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })} />
        </label>
      </div>
      <button type="submit">Create</button>
    </form>
  );

  const Notification = ({ notification }) => {
    if (!notification) return null;
    return (
      <div className={notification.type}>
        {notification.message}
      </div>
    );
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <h1>Blogs</h1>
          <Notification notification={notification} />
          <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
