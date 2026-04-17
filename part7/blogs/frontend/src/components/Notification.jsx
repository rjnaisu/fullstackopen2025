import styled, { css } from "styled-components";

const toneStyles = {
  success: css`
    color: #2f5a45;
    background: #edf4ef;
    border-color: #bfd0c3;
  `,
  error: css`
    color: #6b3f3f;
    background: #f5efed;
    border-color: #d8c6c1;
  `,
};

const Message = styled.div.attrs(({ $type }) => ({
  className: $type,
}))`
  margin: 0 0 1rem;
  width: min(100%, 40rem);
  padding: 0.75rem 0.9rem;
  border: 1px solid #bfd0c3;
  border-radius: 6px;
  background: #edf4ef;
  font-weight: 600;

  ${({ $type }) => toneStyles[$type] ?? toneStyles.success}
`;

const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }

  return <Message $type={notification.status}>{notification.message}</Message>;
};

export default Notification;
