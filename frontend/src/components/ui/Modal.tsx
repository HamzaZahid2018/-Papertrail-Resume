import React, { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button.tsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Prevent body scrolling when modal is active, listen for Escape key down
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Dialog Content */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden transform transition-all relative z-10 animate-float flex flex-col max-h-[90vh]">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 id="modal-title" className="font-outfit text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg"
            onClick={onClose}
            aria-label="Close modal dialog"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="px-6 py-6 overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};
