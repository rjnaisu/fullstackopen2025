import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const createdBlog = await onCreate({ title, author, url });
    if (!createdBlog) {
      return;
    }

    setTitle("");
    setAuthor("");
    setUrl("");
    navigate("/");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Create new</Title>

      <Input
        type="text"
        aria-label="title"
        value={title}
        placeholder="title"
        onChange={({ target }) => setTitle(target.value)}
      />

      <Input
        type="text"
        aria-label="author"
        value={author}
        placeholder="author"
        onChange={({ target }) => setAuthor(target.value)}
      />

      <Input
        type="text"
        aria-label="url"
        value={url}
        placeholder="url"
        onChange={({ target }) => setUrl(target.value)}
      />

      <SubmitButton type="submit">Create</SubmitButton>
    </Form>
  );
};

export default BlogForm;
