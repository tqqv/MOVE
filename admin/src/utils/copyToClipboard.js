import { toast } from 'vue3-toastify';

export const copyToClipboard = (text, messSuccess, messFail) => {
  if (text) {
    navigator.clipboard.writeText(text);
    toast.success(messSuccess);
  } else {
    toast.error(messFail);
  }
};
