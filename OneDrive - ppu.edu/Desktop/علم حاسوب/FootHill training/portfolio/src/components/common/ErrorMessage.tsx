import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle, faRotate } from "@fortawesome/free-solid-svg-icons";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export default function ErrorMessage({ 
  message = "Something went wrong. Please try again later.", 
  onRetry,
  fullScreen = false 
}: ErrorMessageProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-300">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 border border-red-500/20 shadow-lg shadow-red-500/5">
        <FontAwesomeIcon icon={faExclamationTriangle} size="2xl" />
      </div>
      <h3 className="text-xl font-bold text-text mb-2">Oops! Error Occurred</h3>
      <p className="text-gray-500 max-w-md mb-8 font-medium">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/25 active:scale-95"
        >
          <FontAwesomeIcon icon={faRotate} />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
        {content}
      </div>
    );
  }

  return content;
}
