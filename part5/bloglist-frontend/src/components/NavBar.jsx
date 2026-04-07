import { Link } from 'react-router-dom'
import styled from 'styled-components'

const Navigation = styled.nav`
  width: min(100%, 40rem);
  margin-bottom: 1rem;
  padding: 0.75rem 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.9rem;
  border: 1px solid #c9d2cb;
  border-radius: 6px;
  background: #f5f7f3;
`
const Title = styled.h2`
  margin: 0 0 0.5rem;
  color: #466055;
  font-size: 1.6rem;
  font-weight: 600;
`

const Spacer = styled.div`
  flex: 1
`

const NavLink = styled(Link)`
  color: #466055;
  text-decoration: none;
  font-weight: 600;
  margin-left: auto;
`

const LogoutButton = styled.button`
  padding: 0.55rem 0.85rem;
  border: 1px solid #5f6f66;
  border-radius: 6px;
  background: #66776e;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`

const NavBar = ({ user, onLogout }) => {
  return (
    <Navigation>
      <Title>Blog App</Title>
      <Spacer/>
      <NavLink to="/">Blogs</NavLink>
      {user ? (
        <>
          <NavLink to="/create">New Blog</NavLink>
          <LogoutButton type="button" onClick={onLogout}>logout</LogoutButton>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
        </>
      )}
    </Navigation>
  )
}

export default NavBar
