import React from 'react';
import Card from './Card';

export type StatusCardColor = 'blue' | 'emerald' | 'indigo' | 'rose' | 'slate' | 'amber';

export interface StatusCardItem {
  id: string | number;
  title: string;
  secondary?: string;
}

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: StatusCardColor;
  items?: StatusCardItem[];
  highlight?: boolean;
  emptyMessage?: string;
  className?: string;
}

const borderColors: Record<StatusCardColor, string> = {
  blue:    'border-blue-100',
  emerald: 'border-emerald-100',
  indigo:  'border-indigo-100',
  rose:    'border-rose-100',
  slate:   'border-slate-100',
  amber:   'border-amber-100',
};

const iconColors: Record<StatusCardColor, string> = {
  blue:    'text-blue-600 bg-blue-50',
  emerald: 'text-emerald-600 bg-emerald-50',
  indigo:  'text-indigo-600 bg-indigo-50',
  rose:    'text-rose-600 bg-rose-50',
  slate:   'text-slate-600 bg-slate-50',
  amber:   'text-amber-600 bg-amber-50',
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon,
  color,
  items = [],
  highlight = false,
  emptyMessage = '내역이 없습니다',
  className = '',
}) => (
  <Card
    className={`p-5 bg-[#fafafa] hover:shadow-lg transition-all border shadow-sm ${highlight ? 'border-blue-500 shadow-blue-500/10' : borderColors[color]} ${className}`}
    noPadding
  >
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded ${iconColors[color]}`}>{icon}</div>
        <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">{title}</span>
      </div>
      <span className={`text-[12px] font-black ${highlight ? 'text-blue-600 bg-blue-50' : 'text-slate-500 bg-slate-50'} px-2 py-0.5 rounded-sm`}>
        {value}
      </span>
    </div>

    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-[11px] font-bold text-slate-300 py-2 italic text-center">{emptyMessage}</div>
      ) : (
        items.map(item => (
          <div key={item.id} className="flex items-center justify-between group cursor-pointer">
            <div className="text-[12px] font-bold text-slate-500 group-hover:text-blue-600 transition-colors truncate pr-2">
              {item.title}
            </div>
            {item.secondary && (
              <div className="text-[10px] font-black text-slate-400 italic shrink-0">
                {item.secondary}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  </Card>
);

export default StatusCard;
