import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ApprovalItemProps {
  label: string;
  value: string;
  urgent?: boolean;
}

const ApprovalItem: React.FC<ApprovalItemProps> = ({ label, value, urgent = false }) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 group-hover:border-slate-100 transition-colors">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-3">
        <span className={`text-[12px] font-black px-3 py-1.5 rounded-md ${urgent ? 'text-rose-600 bg-rose-50 ring-1 ring-rose-100' : 'text-slate-800 bg-slate-50 ring-1 ring-slate-100'}`}>
          {value}
        </span>
        <ChevronRight size={14} className="text-slate-300" />
      </div>
    </div>
  );
};

export default ApprovalItem;
