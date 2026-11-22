import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toLowerCase();

  const styles = {
    // Event & Registration statuses
    upcoming: 'bg-sage-bg text-sage border-sage/30',
    ongoing: 'bg-warm-soft text-warm-hover border-warm/40',
    completed: 'bg-gray-100 text-secondary border-line',
    cancelled: 'bg-danger-bg text-danger border-danger/30',
    confirmed: 'bg-success-bg text-success border-success/30',
    pending: 'bg-warning-bg text-warning border-warning/40',
  };

  const styleClass = styles[normalized] || 'bg-gray-100 text-secondary border-line';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {status}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  const categoryStyles = {
    Technology: 'bg-sage-bg text-sage border-sage/20',
    Technical: 'bg-sage-bg text-sage border-sage/20',
    Workshops: 'bg-warm-soft text-secondary border-warm/30',
    Workshop: 'bg-warm-soft text-secondary border-warm/30',
    Cultural: 'bg-[#F2EDF7] text-[#6B4F8A] border-[#E3D9ED]',
    Festivals: 'bg-[#FDF0EC] text-[#B8583B] border-[#F8D9CE]',
    Fest: 'bg-[#FDF0EC] text-[#B8583B] border-[#F8D9CE]',
    Sports: 'bg-[#EBF5ED] text-[#2F683D] border-[#D0EADB]',
    Seminars: 'bg-info-bg text-info border-info/30',
    Seminar: 'bg-info-bg text-info border-info/30',
    Other: 'bg-gray-100 text-secondary border-line'
  };

  const cls = categoryStyles[category] || categoryStyles.Other;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${cls}`}>
      {category}
    </span>
  );
};
