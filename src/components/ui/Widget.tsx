import React from 'react';
import { ChevronRight } from 'lucide-react';
import Card from './Card';

interface WidgetProps {
  title: string;
  children: React.ReactNode;
  color?: string;
  /** Extra element rendered left of the title (e.g. drag handle) */
  headerExtra?: React.ReactNode;
  /** Override the default chevron button entirely */
  headerRight?: React.ReactNode;
  /** Click handler for the default ChevronRight button */
  onMoreClick?: () => void;
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  children,
  headerExtra,
  headerRight,
  onMoreClick,
  className = '',
}) => (
  <Card className={`hover:shadow-2xl hover:-translate-y-2 duration-500 group flex flex-col ${className}`}>
    <div className="flex items-center justify-between mb-6 shrink-0">
      <div className="flex items-center gap-2">
        {headerExtra}
        <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {headerRight ?? (
        onMoreClick ? (
          <button
            onClick={onMoreClick}
            className="p-2 bg-slate-50 rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors cursor-pointer border-none text-slate-400 hover:text-blue-600"
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="p-2 bg-slate-50 rounded-md text-slate-300">
            <ChevronRight size={16} />
          </div>
        )
      )}
    </div>
    <div className="flex-1 overflow-hidden">
      {children}
    </div>
  </Card>
);

export default Widget;
