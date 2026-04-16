import styled from "styled-components";
import useUser from "../hooks/useUser";
import { useField } from "../hooks/useField";

const Form = styled.form`
  width: min(100%, 23rem);
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

const LoginForm = ({ showNotification }) => {
  const { login } = useUser();
  const [username, resetUsername] = useField("text");
  const [password, resetPassword] = useField("password");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await login({ username: username.value, password: password.value });

    if (user) {
      showNotification(`Welcome ${user.name}!`);
      resetUsername();
      resetPassword();
      return;
    }

    showNotification("Wrong username or password", "error");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Title>Log in to the application</Title>

      <Input id="username" aria-label="username" placeholder="username" {...username} />

      <Input id="password" aria-label="password" placeholder="password" {...password} />

      <SubmitButton type="submit">login</SubmitButton>
    </Form>
  );
};

export default LoginForm;
