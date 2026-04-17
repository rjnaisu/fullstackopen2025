import { createContext, useEffect, useReducer, useRef } from "react";
import notifReducer from "../utils/notifReducer";

const NotificationContext = createContext();

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatchNotification] = useReducer(notifReducer, null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showNotification = (message, status = "success", duration = 3000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    dispatchNotification({ type: "show", payload: { message, status } });
    timeoutRef.current = setTimeout(() => {
      dispatchNotification({ type: "clear" });
      timeoutRef.current = null;
    }, duration);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
