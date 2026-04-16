import { useEffect, useReducer, useRef } from "react";
import notifReducer from "../utils/notifReducer";

export const useNotification = (duration = 3000) => {
  const [notification, dispatchNotification] = useReducer(notifReducer, null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showNotification = (message, status = "success") => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    dispatchNotification({ type: "show", payload: { message, status } });
    timeoutRef.current = setTimeout(() => {
      dispatchNotification({ type: "clear" });
      timeoutRef.current = null;
    }, duration);
  };

  return { notification, showNotification };
};
