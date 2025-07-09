import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type ToastMessage = {
  type: "success" | "error";
  text: string;
};

type ToastProps = {
  message: ToastMessage | null;
  duration?: number;
};

export const Toast = ({ message, duration = 3000 }: ToastProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`relative flex items-center justify-between gap-2 p-3 rounded-md text-sm font-medium shadow-sm max-w-xs ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}>
            <span>{message.text}</span>
            <button
              onClick={() => setVisible(false)}
              className="ml-2 hover:opacity-80 focus:outline-none"
              aria-label="Dismiss message">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
