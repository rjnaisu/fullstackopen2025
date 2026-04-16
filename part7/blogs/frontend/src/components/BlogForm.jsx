import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useField } from "../hooks/useField";

const Form = styled.form`
  width: min(100%, 26rem);
  display: grid;
  gap: 0.85rem;
`;

const Title = styled.h2`
  margin: 0 0 0.5rem;
  color: #1f1f1f;
  font-size: 1.6rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.85rem 0.95rem;
  border: 1px solid #c9c9c9;
  border-radius: 6px;
  background: #ffffff;
  color: #1f1f1f;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #8a9a90;
  }
`;

const SubmitButton = styled.button`
  width: fit-content;
  min-width: 8rem;
  padding: 0.8rem 1rem;
  border: 1px solid #5f6f66;
  border-radius: 6px;
  background: #66776e;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
`;

const BlogForm = ({ onCreate }) => {
  const [title, resetTitle] = useField("text");
  const [author, resetAuthor] = useField("text");
  const [url, resetUrl] = useField("text");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const createdBlog = await onCreate({
      title: title.value,
      author: author.value,
      url: url.value,
    });
    if (!createdBlog) {
      return;
    }
    resetTitle();
    resetAuthor();
    resetUrl();
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Create new</Title>

      <Input aria-label="title" placeholder="title" {...title} />

      <Input aria-label="author" placeholder="author" {...author} />

      <Input aria-label="url" placeholder="url" {...url} />

      <SubmitButton type="submit">Create</SubmitButton>
    </Form>
  );
};

export default BlogForm;
