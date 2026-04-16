import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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

const BlogUrl = styled.a`
  color: #466055;
  font-weight: 600;
`;

const FixedBottom = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: 0.7rem 0.95rem;
  border: 1px solid #5f6f66;
  border-radius: 6px;
  background: #66776e;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
`;

const RemoveButton = styled(Button)`
  margin-left: auto;
  border-color: #d7b3b3;
  background: #f8efef;
  color: #8d4e4e;
`;

const BlogDetails = ({ blog, onLike, onRemove, canRemove }) => {
  const navigate = useNavigate();

  if (!blog) {
    return <p>Blog not found.</p>;
  }

  const ownerName = typeof blog.user === "string" ? blog.user : (blog.user?.name ?? "unknown");

  const handleRemove = async () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`);
    if (!ok) {
      return;
    }

    const removed = await onRemove(blog);
    if (removed) {
      navigate("/");
    }
  };

  const comments = Array.isArray(blog.comments) ? blog.comments : [];

  return (
    <Card>
      <Title>{blog.title}</Title>
      <Text>by {blog.author}</Text>
      <Text>
        <BlogUrl data-testid="blog-url" href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </BlogUrl>
      </Text>
      <Text>added by {ownerName}</Text>
      <FixedBottom>
        <Text>
          <span data-testid="blog-likes-count">{blog.likes} likes</span>
        </Text>
        <Button type="button" onClick={() => onLike(blog)}>
          Like
        </Button>
        {canRemove && (
          <RemoveButton type="button" onClick={handleRemove}>
            Remove
          </RemoveButton>
        )}
      </FixedBottom>
      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={`${comment}-${index}`}>{comment}</li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </Card>
  );
};

export default BlogDetails;
