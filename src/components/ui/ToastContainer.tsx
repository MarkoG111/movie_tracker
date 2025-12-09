import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";

interface Toast {
    id: number;
    message: string;
    type: "success" | "error";
}

let toastId = 0;
const toastListeners: ((toast: Toast) => void)[] = [];

export const showToast = (
    message: string,
    type: "success" | "error" = "success"
) => {
    const toast: Toast = {
        id: toastId++,
        message,
        type,
    };
    toastListeners.forEach((listener) => listener(toast));
};

export default function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const listener = (toast: Toast) => {
            setToasts((prev) => [...prev, toast]);

            // Auto remove after 3 seconds
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }, 6000);
        };

        toastListeners.push(listener);

        return () => {
            const index = toastListeners.indexOf(listener);
            if (index > -1) toastListeners.splice(index, 1);
        };
    }, []);

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className="pointer-events-auto animate-in slide-in-from-right duration-300 fade-in"
                    style={{
                        animation: "slideIn 0.3s ease-out",
                    }}
                >
                    <div
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-xl
              border min-w-[300px] max-w-md
              ${
                  toast.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-100"
                      : "bg-red-500/10 border-red-500/40 text-red-100"
              }
            `}
                    >
                        <CheckCircle
                            className={`w-5 h-5 flex-shrink-0 ${
                                toast.type === "success"
                                    ? "text-emerald-400"
                                    : "text-red-400"
                            }`}
                        />
                        <p className="flex-1 font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
