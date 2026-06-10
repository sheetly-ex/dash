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
    <div className="flex items-center gap-4 py-3 border-b border-app-muted last:border-0 group/mail cursor-pointer">
      <div className={`p-2 rounded-md transition-colors ${isStarred ? 'text-amber-400' : 'text-app-muted group-hover/mail:text-app-muted'}`}>
        <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
      </div>
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex justify-between items-center">
          <span className={`text-[11px] font-black uppercase tracking-tighter ${isNew ? 'text-blue-600' : 'text-app-muted'}`}>{sender}</span>
          <span className="text-[10px] font-bold text-app-muted italic">{time}</span>
        </div>
        <div className={`text-[13px] tracking-tight truncate ${isNew ? 'font-black text-app' : 'font-medium text-app-secondary'}`}>{title}</div>
      </div>
      {isNew && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>}
    </div>
  );
};

export default MailItem;
