import { createContext, useRef, useState } from "react";

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, setNotification] = useState("");
  const timeout = useRef(null);

  const showNotification = (message) => {
    setNotification(message);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = setTimeout(() => {
      setNotification(null);
      timeout.current = null;
    }, 5000);
  };

  const clearNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, clearNotification }}>
      {props.children}
    </NotificationContext.Provider>
  );
};
//export const useNotificationContext = () => useContext(NotificationContext);

export default NotificationContext;
