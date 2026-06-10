import React from 'react';

interface NavGroupProps {
  title: string;
  children: React.ReactNode;
}

const NavGroup: React.FC<NavGroupProps> = ({ title, children }) => {
  return (
    <div className="mb-8">
      <div className="px-5 mb-3 text-[10px] font-black text-app-muted uppercase tracking-widest">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  );
};

export default NavGroup;
