import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.article`
  width: min(100%, 40rem);
  margin-bottom: 0.75rem;
  padding: 0.85rem 1rem;
  border: 1px solid #c9d2cb;
  border-radius: 6px;
  background: #eef4ef;
`;

const BlogLink = styled(Link)`
  display: inline-flex;
  gap: 0.35rem;
  color: inherit;
  text-decoration: none;
`;

const Title = styled.span`
  color: #1f1f1f;
  font-weight: 600;
`;

const Author = styled.span`
  color: #576259;
`;

const Blog = ({ blog }) => {
  if (!blog) {
    return null;
  }

  return (
    <Card data-testid="blog-item">
      <BlogLink to={`/blogs/${blog.id}`}>
        <Title data-testid="blog-title">{blog.title}</Title>
        <Author data-testid="blog-author">by {blog.author}</Author>
      </BlogLink>
    </Card>
  );
};

export default Blog;
