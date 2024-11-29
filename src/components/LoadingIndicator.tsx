import React from 'react';

export function LoadingIndicator() {
  return (
    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white px-4 py-2 rounded-full shadow-lg animate-fade-in">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
        </div>
        <span className="text-sm">Translating...</span>
      </div>
    </div>
  );
}