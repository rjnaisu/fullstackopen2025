import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import User from "./User";
import userService from "../services/users";

const TableWrapper = styled.section`
  width: min(100%, 48rem);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d7dfd8;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
`;

const TableHeader = styled.th`
  padding: 0.8rem 0.9rem;
  background: #eef4ef;
  color: #466055;
  text-align: left;
  font-weight: 700;
`;

const UserList = () => {
  const {
    data: users = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <p>Loading users...</p>;
  }

  if (isError) {
    return <p>Unable to load users right now.</p>;
  }

  if (users.length === 0) {
    return <p>No users here yet</p>;
  }

  return (
    <TableWrapper>
      <h1>Users</h1>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Username</TableHeader>
            <TableHeader>Blogs Created</TableHeader>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <User key={user.id} user={user} />
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default UserList;
