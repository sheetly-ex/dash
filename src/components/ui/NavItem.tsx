import React from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={`px-5 py-3.5 flex items-center gap-4 cursor-pointer transition-all rounded-lg mx-1 border ${active
        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900 shadow-sm'
        : 'text-app-secondary border-transparent hover-surface hover:text-app group'
        }`}
    >
      <span className={`${active ? 'text-blue-600 dark:text-blue-400' : 'text-app-muted group-hover:text-blue-500'} transition-colors`}>{icon}</span>
      <span className="text-[14px] font-bold tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>}
    </div>
  );
};

export default NavItem;
