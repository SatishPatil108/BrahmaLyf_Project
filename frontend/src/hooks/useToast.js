// Usage:
//   const { toast, showToast } = useToast();
//   showToast("Copied to clipboard!");
//   // then render: toast.visible && <Toast message={toast.message} />

import { useState, useCallback } from "react";

const useToast = (duration = 3000) => {
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = useCallback(
    (message) => {
      setToast({ visible: true, message });
      setTimeout(() => setToast({ visible: false, message: "" }), duration);
    },
    [duration],
  );

  return { toast, showToast };
};

export default useToast;
