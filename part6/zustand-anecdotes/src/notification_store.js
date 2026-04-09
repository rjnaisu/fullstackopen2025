import { create } from "zustand";

let timeout;

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    show: (message, type = "success", duration = 5000) => {
      clearTimeout(timeout);

      set({
        notification: { message, type },
      });

      timeout = setTimeout(() => {
        set({ notification: null });
      }, duration);
    },
    clear: () => {
      clearTimeout(timeout);
      set({ notification: null });
    },
  },
}));

export const useNotification = () => useNotificationStore((state) => state.notification);
export const useNotificationActions = () => useNotificationStore((state) => state.actions);
