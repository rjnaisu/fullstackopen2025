import { useEffect, useReducer, useState } from "react";
import { Navigate, Route, Routes, useMatch } from "react-router-dom";
import BlogDetails from "./components/BlogDetails";
import BlogsList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import notifReducer from "./utils/notifReducer";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [notification, dispatchNotification] = useReducer(notifReducer, null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const showNotification = (message, status = "success") => {
    dispatchNotification({ type: "show", payload: { message, status } });
    setTimeout(() => {
      dispatchNotification({ type: "clear" });
    }, 3000);
  };

  const handleLogin = async ({ username, password }) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`Welcome ${user.name}!`);
    } catch {
      showNotification("Wrong username or password", "error");
    }
  };

  const handleCreate = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      setBlogs((prev) => prev.concat(createdBlog));
      showNotification(`A new blog ${createdBlog.title} by ${createdBlog.author} added!`);
      return createdBlog;
    } catch {
      showNotification("Error creating blog", "error");
      return null;
    }
  };

  const handleLike = async (likedBlog) => {
    const updatedBlog = {
      title: likedBlog.title,
      author: likedBlog.author,
      url: likedBlog.url,
      likes: likedBlog.likes + 1,
      user: likedBlog.user.id,
    };
    try {
      const savedBlog = await blogService.update(likedBlog.id, updatedBlog);
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === likedBlog.id ? { ...blog, ...savedBlog, user: blog.user } : blog,
        ),
      );
    } catch {
      showNotification("Error liking blog", "error");
    }
  };

  const handleDelete = async (chosenBlog) => {
    try {
      await blogService.remove(chosenBlog.id);
      setBlogs((prev) => prev.filter((blog) => blog.id !== chosenBlog.id));
      return true;
    } catch {
      showNotification("oops! error deleting blog", "error");
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  const canRemoveBlog = (blog) => blog?.user?.username === user?.username;

  const homeMatch = useMatch("/");
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;
  const showBlogsHeading = Boolean(homeMatch);

  return (
    <div>
      <NavBar user={user} onLogout={handleLogout} />
      {showBlogsHeading && <h1>Blogs</h1>}
      <Notification notification={notification} />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route
          path="/"
          element={
            <ErrorBoundary>
              <BlogsList blogs={sortedBlogs} />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route path="/blogs" element={<Navigate to="/" replace />} />
        <Route
          path="/blogs/:id"
          element={
            user ? (
              <BlogDetails
                blog={blog}
                onLike={handleLike}
                onRemove={handleDelete}
                canRemove={canRemoveBlog(blog)}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/create"
          element={user ? <BlogForm onCreate={handleCreate} /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}

export default App;
