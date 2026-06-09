import React from 'react';

interface EmptyStateProps {
  message?: string;
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message = '내역이 없습니다',
  size = 'sm',
  icon,
  action,
  className = '',
}) => {
  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
        {icon && <div className="text-slate-200">{icon}</div>}
        <p className="text-[13px] font-bold text-slate-300">{message}</p>
        {action}
      </div>
    );
  }

  return (
    <div className={`text-[11px] font-bold text-slate-300 py-2 italic text-center ${className}`}>
      {message}
    </div>
  );
};

export default EmptyState;
