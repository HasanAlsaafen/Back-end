import React from 'react';

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loader({ message = "Loading...", fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-primary/40 rounded-full animate-spin [animation-duration:2s]" />
      </div>
      <p className="mt-4 text-gray-500 font-bold tracking-widest text-xs uppercase animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
}
