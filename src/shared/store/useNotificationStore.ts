import { create }  from "zustand";

interface NotificationState {
  message: string | null;
  type: "success" | "error" | null;
  showNotification: (message: string, type: "success" | "error") => void;
  hideNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  message: null,
  type: null,
  showNotification: (message, type) => set({ message, type }),
  hideNotification: () => set({ message: null, type: null }),
}));