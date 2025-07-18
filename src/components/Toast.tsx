import { useEffect } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, show, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, onClose, duration]);

  if (!show) return null;

  return (
    <div className="fixed top-6 right-6 z-50 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-toast-in">
      <span className="font-medium">{message}</span>
    </div>
  );
}
// En globals.css:
// @keyframes toast-in { 0% { opacity: 0; transform: translateY(-20px); } 100% { opacity: 1; transform: translateY(0); } }
// .animate-toast-in { animation: toast-in 0.4s cubic-bezier(.4,2,.6,1); } 