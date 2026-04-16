import { Link } from "react-router-dom";
import styled from "styled-components";

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f7faf7;
  }
`;

const TableCell = styled.td`
  padding: 0.7rem 0.9rem;
  border-top: 1px solid #d7dfd8;
  text-align: left;
`;

const UserLink = styled(Link)`
  color: #466055;
  font-weight: 600;
  text-decoration: none;
`;

const User = ({ user }) => {
  if (!user) {
    return null;
  }

  const blogCount = Array.isArray(user.blogs) ? user.blogs.length : 0;

  return (
    <TableRow>
      <TableCell>
        <UserLink to={`/users/${user.id}`}>{user.name}</UserLink>
      </TableCell>
      <TableCell>{user.username}</TableCell>
      <TableCell>{blogCount}</TableCell>
    </TableRow>
  );
};

export default User;
