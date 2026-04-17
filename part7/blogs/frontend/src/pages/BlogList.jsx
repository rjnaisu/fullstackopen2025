import Blog from "../components/Blog";
import styled from "styled-components";

const Title = styled.h2`
  margin-top: 0;
  color: #1f1f1f;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Wrapper = styled.section`
  width: min(100%, 40rem);
  padding: 1rem;
  border: 1px solid #c9d2cb;
  border-radius: 6px;
  background: #f8faf7;
`;

const BlogsList = ({ blogs }) => {
  if (blogs.length === 0) {
    return <p>No blogs here yet</p>;
  }
  return (
    <div>
      <Wrapper>
        <Title>Blogs</Title>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </Wrapper>
    </div>
  );
};

export default BlogsList;
