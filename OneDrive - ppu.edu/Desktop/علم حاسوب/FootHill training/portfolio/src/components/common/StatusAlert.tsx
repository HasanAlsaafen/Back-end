import React, { useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";

interface StatusAlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export default function StatusAlert({ 
  type, 
  message, 
  onClose, 
  autoClose = true 
}: StatusAlertProps) {
  
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const config = {
    success: {
      icon: faCheckCircle,
      bg: 'bg-green-500',
      shadow: 'shadow-green-500/20',
      label: 'Success'
    },
    error: {
      icon: faTimesCircle,
      bg: 'bg-red-500',
      shadow: 'shadow-red-500/20',
      label: 'Error'
    },
    info: {
      icon: faInfoCircle,
      bg: 'bg-blue-500',
      shadow: 'shadow-blue-500/20',
      label: 'Info'
    }
  };

  const { icon, bg, shadow, label } = config[type];

  return (
    <div className={`fixed bottom-8 right-8 z-[110] flex items-center gap-4 px-6 py-4 rounded-2xl text-white font-bold ${bg} ${shadow} shadow-2xl animate-in slide-in-from-right-10 duration-500 border border-white/10 backdrop-blur-sm bg-opacity-90`}>
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest opacity-70 mb-0.5">{label}</p>
        <p className="text-sm font-bold leading-none">{message}</p>
      </div>
      {onClose && (
        <button 
          onClick={onClose}
          className="ml-4 hover:scale-110 transition-transform opacity-70 hover:opacity-100 p-1"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
}
