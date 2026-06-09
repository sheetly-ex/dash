import React from 'react';
import { Star } from 'lucide-react';

interface MailItemProps {
  sender: string;
  title: string;
  time: string;
  isNew?: boolean;
  isStarred?: boolean;
}

const MailItem: React.FC<MailItemProps> = ({ sender, title, time, isNew = false, isStarred = false }) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0 group/mail cursor-pointer">
      <div className={`p-2 rounded-md transition-colors ${isStarred ? 'text-amber-400' : 'text-slate-200 group-hover/mail:text-slate-400'}`}>
        <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex justify-between items-center">
          <span className={`text-[11px] font-black uppercase tracking-tighter ${isNew ? 'text-blue-600' : 'text-slate-500'}`}>{sender}</span>
          <span className="text-[10px] font-bold text-slate-400 italic">{time}</span>
        </div>
        <div className={`text-[13px] tracking-tight truncate ${isNew ? 'font-black text-slate-900' : 'font-medium text-slate-600'}`}>{title}</div>
      </div>
      {isNew && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
    </div>
  );
};

export default MailItem;
