import React from 'react';
import { FolderOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There are no items to display matching your criteria.',
  actionText,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-white">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-mutedBlue-subtle flex items-center justify-center text-slateBlue">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-ink mb-1">{title}</h3>
      <p className="text-sm text-ink-muted max-w-sm mx-auto mb-4">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-midnight hover:bg-slateBlue transition shadow-subtle"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
