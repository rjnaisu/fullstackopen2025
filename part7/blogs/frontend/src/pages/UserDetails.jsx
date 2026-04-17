import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import userService from "../services/users";

const Card = styled.article`
  width: min(100%, 40rem);
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #c9d2cb;
  border-radius: 6px;
  background: #f8faf7;
`;

const Title = styled.h2`
  margin: 0;
  color: #1f1f1f;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Text = styled.p`
  margin: 0;
  color: #3f4f45;
`;

const BlogList = styled.ul`
  margin: 0;
  padding-left: 1.2rem;
  color: #466055;
  font-weight: 600;
`;

const BlogItem = styled.li`
  margin: 0.2rem 0;
`;

const BackLink = styled(Link)`
  width: fit-content;
  color: #466055;
  font-weight: 600;
  text-decoration: none;
`;

const UserDetails = () => {
  const { id } = useParams();

  const {
    data: user,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getById(id),
    enabled: Boolean(id),
  });

  if (isPending) {
    return <p>Loading user...</p>;
  }

  if (isError) {
    return <p>Unable to load user right now.</p>;
  }

  if (!user) {
    return <p>User not found.</p>;
  }

  return (
    <Card>
      <BackLink to="/users">Back to users</BackLink>
      <Title>{user.name}</Title>
      <Text>added blogs</Text>
      <div>
        <BlogList>
          {user.blogs.map((blog) => (
            <BlogItem key={blog.id}>{blog.title}</BlogItem>
          ))}
        </BlogList>
      </div>
    </Card>
  );
};

export default UserDetails;
