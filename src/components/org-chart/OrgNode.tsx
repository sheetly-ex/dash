import React from 'react';
import { Building2, User2 } from 'lucide-react';

interface OrgNodeProps {
  name: string;
  position: string;
  department: string;
  isTop?: boolean;
  isHighlighted?: boolean;
  isSmall?: boolean;
}

const OrgNode: React.FC<OrgNodeProps> = ({ name, position, department, isTop = false, isHighlighted = false, isSmall = false }) => {
  return (
    <div className={`bg-surface-elevated rounded-xl border transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center ${isSmall ? 'p-4 w-44 border-app-muted' : 'p-8 w-64 border-app shadow-lg shadow-slate-200/50'} ${isTop ? 'bg-slate-900 border-slate-900' : ''} ${isHighlighted ? 'ring-2 ring-blue-500 ring-offset-8' : ''}`}>
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-4 ${isTop ? 'bg-blue-600 text-white' : 'bg-surface-muted text-app-muted'}`}>
        {isTop ? <Building2 size={28} /> : <User2 size={28} />}
      </div>
      <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isTop ? 'text-blue-400' : 'text-blue-600'}`}>{department}</div>
      <div className={`text-base font-black tracking-tight ${isTop ? 'text-white' : 'text-app'}`}>
        {name}
        <span className="ml-2 text-[11px] font-bold text-app-muted">{position}</span>
      </div>
    </div>
  );
};

export default OrgNode;
