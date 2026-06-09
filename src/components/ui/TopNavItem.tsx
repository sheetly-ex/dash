import React from 'react';

interface TopNavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const TopNavItem: React.FC<TopNavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-2 h-full flex items-center justify-center cursor-pointer transition-all relative group border-none bg-transparent"
      aria-label={label}
    >
      {/* Circular Icon Wrapper */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95 shadow-xs border ${active
        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
        : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-800'
        }`}>
        {icon}
      </div>

      {/* Styled Tooltip */}
      <div className="absolute top-18 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 origin-top bg-slate-900/95 backdrop-blur-md text-slate-200 text-xs font-black py-2 px-3 rounded-md border border-slate-800 shadow-2xl pointer-events-none whitespace-nowrap z-50">
        {label}
      </div>
    </button>
  );
};

export default TopNavItem;
