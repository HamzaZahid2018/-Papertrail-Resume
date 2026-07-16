import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "info" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      {/* Toast container portal/overlay layer */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              animate-slide-in-right p-4 rounded-2xl shadow-xl border flex items-start gap-3 bg-white/95 backdrop-blur-md select-none
              ${toast.type === "success" ? "border-emerald-100 text-slate-800" : ""}
              ${toast.type === "info" ? "border-blue-100 text-slate-800" : ""}
              ${toast.type === "error" ? "border-rose-100 text-slate-800" : ""}
            `}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />}
            
            <div className="flex-grow">
              <p className="text-xs font-semibold leading-relaxed text-slate-700">{toast.message}</p>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
