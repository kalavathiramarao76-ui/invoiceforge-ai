"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
});

export const useToast = () => useContext(ToastContext);

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS: Record<ToastType, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  info: "text-blue-400",
};

const BORDER_COLORS: Record<ToastType, string> = {
  success: "border-emerald-500/20",
  error: "border-red-500/20",
  info: "border-blue-500/20",
};

const MAX_TOASTS = 3;
const DURATION = 4000;

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        // Trim to max, removing oldest
        if (next.length > MAX_TOASTS) {
          const removed = next.shift();
          if (removed) {
            const timer = timersRef.current.get(removed.id);
            if (timer) clearTimeout(timer);
            timersRef.current.delete(removed.id);
          }
        }
        return next;
      });

      const timer = setTimeout(() => removeToast(id), DURATION);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${BORDER_COLORS[t.type]} px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                t.exiting
                  ? "opacity-0 translate-x-8"
                  : "opacity-100 translate-x-0 animate-toast-in"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, rgba(24,24,27,0.92) 0%, rgba(24,24,27,0.85) 100%)",
                minWidth: "280px",
                maxWidth: "400px",
              }}
              role="alert"
            >
              <Icon className={`w-5 h-5 shrink-0 ${COLORS[t.type]}`} />
              <span className="text-sm text-zinc-100 flex-1 leading-snug">
                {t.message}
              </span>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
