import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClass = size === 'small' ? 'w-5 h-5' : size === 'large' ? 'w-10 h-10' : 'w-7 h-7';

  return (
    <div className="flex flex-col items-center justify-center p-8 text-ink-muted">
      <Loader2 className={`${sizeClass} animate-spin text-mutedBlue mb-2`} />
      {message && <p className="text-sm font-medium">{message}</p>}
    </div>
  );
};
