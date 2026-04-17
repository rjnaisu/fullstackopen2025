import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import User from "../components/User";
import userService from "../services/users";

const TableWrapper = styled.section`
  width: min(100%, 40rem);
  padding: 1rem;
  border: 1px solid #c9d2cb;
  border-radius: 6px;
  background: #f8faf7;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
`;

const TableHeader = styled.th`
  padding: 0.8rem 0.9rem;
  background: #eef4ef;
  color: #466055;
  text-align: left;
  font-weight: 700;
`;

const Title = styled.h2`
  margin-top: 0;
  color: #1f1f1f;
  font-size: 1.6rem;
  font-weight: 600;
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
      <Title>Users</Title>
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
