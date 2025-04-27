import { toast } from 'sonner';

export const showSuccessToast = (message) => {
  toast.success(message);
};

export const showErrorToast = (message) => {
  toast.error(message);
};

export const showInfoToast = (message) => {
  toast.info(message);
};

export const showWarningToast = (message) => {
  toast.warning(message);
};

export const showLoadingToast = (message, promise) => {
  toast.promise(promise, {
    loading: message,
    success: (data) => data?.message || 'Success',
    error: (err) => err?.message || 'Error occurred'
  });
};