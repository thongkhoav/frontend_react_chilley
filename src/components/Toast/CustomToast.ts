import { toast } from "react-toastify";

export const ToastError = (message: string, duration: number = 4000) => {
  toast.error(message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const ToastSuccess = (message: string, duration: number = 4000) => {
  toast.success(message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
