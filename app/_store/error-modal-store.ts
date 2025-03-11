import { create } from "zustand";
import { toast } from "react-hot-toast";

type NotificationType = "modal" | "toast";

interface ErrorModalState {
  isOpen: boolean;
  title: string;
  message: string;
  redirectPath?: string;
  canDismiss?: boolean;
  showError: (title: string, message: string, options?: { type?: NotificationType; redirectPath?: string; canDismiss?: boolean }) => void;
  closeError: () => void;
}

export const useErrorModalStore = create<ErrorModalState>((set) => ({
  isOpen: false,
  title: "",
  message: "",
  redirectPath: undefined,
  canDismiss: true,
  showError: (title: string, message: string, options = {}) => {
    const { type = "modal", redirectPath, canDismiss = true } = options;
    if (type === "toast") {
      toast.error(message);
    } else {
      set({ isOpen: true, title, message, redirectPath, canDismiss });
    }
  },
  closeError: () => set({ isOpen: false }),
}));
