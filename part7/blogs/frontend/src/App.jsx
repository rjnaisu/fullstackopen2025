import { Navigate, Route, Routes, useMatch } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import BlogDetails from "./components/BlogDetails";
import BlogsList from "./components/BlogList";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import NavBar from "./components/NavBar";
import Notification from "./components/Notification";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./components/NotFound";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";
import { useBlogs } from "./hooks/useBlogs";
import { useNotification } from "./hooks/useNotification";
import useUser from "./hooks/useUser";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }
`;

const AppShell = styled.main`
  width: min(100%, 52rem);
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
`;

const PageTitle = styled.h1`
  margin: 0 0 1rem;
`;

function App() {
  const { notification, showNotification } = useNotification();
  const { blogs, addBlog, likeBlog, deleteBlog, addComment } = useBlogs(showNotification);
  const { user } = useUser();

  const canRemoveBlog = (blog) => blog?.user?.username === user?.username;

  const homeMatch = useMatch("/");
  const match = useMatch("/blogs/:id");
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;
  const showBlogsHeading = Boolean(homeMatch);

  return (
    <>
      <GlobalStyle />
      <AppShell>
        <NavBar />
        {showBlogsHeading && <PageTitle>Blogs</PageTitle>}
        <Notification notification={notification} />
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <BlogsList blogs={blogs} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <LoginForm showNotification={showNotification} />
            }
          />
          <Route path="/blogs" element={<Navigate to="/" replace />} />
          <Route
            path="/blogs/:id"
            element={
              user ? (
                <BlogDetails
                  blog={blog}
                  onLike={likeBlog}
                  onRemove={deleteBlog}
                  onAddComment={addComment}
                  canRemove={canRemoveBlog(blog)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/create"
            element={user ? <BlogForm onCreate={addBlog} /> : <Navigate to="/login" replace />}
          />
          <Route path="/users" element={user ? <UserList /> : <Navigate to="/login" replace />} />
          <Route
            path="/users/:id"
            element={user ? <UserDetails /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </AppShell>
    </>
  );
}

export default App;
