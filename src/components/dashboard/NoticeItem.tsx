import React from 'react';

interface NoticeItemProps {
  category: string;
  title: string;
  date: string;
  important?: boolean;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ category, title, date, important = false }) => {
  return (
    <div className="group/notice flex items-start gap-4 cursor-pointer">
      <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest mt-0.5 ${important ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100' : 'bg-slate-100 text-slate-500'}`}>
        {category}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-[13px] font-bold text-slate-800 group-hover/notice:text-blue-600 transition-colors leading-snug">{title}</div>
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{date}</div>
      </div>
    </div>
  );
};

export default NoticeItem;
