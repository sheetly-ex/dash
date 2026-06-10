import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';

interface EmptyStateProps {
  message?: string;
  size?: 'sm' | 'lg';
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  size = 'sm',
  icon,
  action,
  className = '',
}) => {
  const { t } = useSettings();
  const displayMessage = message ?? t('common.noHistory');

  if (size === 'lg') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
        {icon && <div className="text-app-muted">{icon}</div>}
        <p className="text-[13px] font-bold text-app-muted">{displayMessage}</p>
        {action}
      </div>
    );
  }

  return (
    <div className={`text-[11px] font-bold text-app-muted py-2 italic text-center ${className}`}>
      {displayMessage}
    </div>
  );
};

export default EmptyState;
