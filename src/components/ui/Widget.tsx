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
  /** Long-press drag listeners applied to the whole card */
  dragListeners?: React.HTMLAttributes<HTMLElement>;
  /** Whether this widget is currently being dragged */
  isDragging?: boolean;
  className?: string;
}

const Widget: React.FC<WidgetProps> = ({
  title,
  children,
  headerExtra,
  headerRight,
  onMoreClick,
  dragListeners,
  isDragging = false,
  className = '',
}) => (
  <Card
    className={`group flex flex-col touch-none select-none ${dragListeners ? 'cursor-grab active:cursor-grabbing' : ''} ${isDragging ? 'shadow-xl ring-2 ring-blue-200 scale-[1.02]' : ''} ${className}`}
    hoverable={!dragListeners}
    {...dragListeners}
  >
    <div className="flex items-center justify-between mb-6 shrink-0">
      <div className="flex items-center gap-2">
        {headerExtra}
        <h3 className="font-black text-app text-sm uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {headerRight ?? (
        onMoreClick ? (
          <button
            onClick={onMoreClick}
            onPointerDown={e => e.stopPropagation()}
            className="p-2 bg-surface-muted rounded-md group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors cursor-pointer border-none text-app-muted hover:text-blue-600"
          >
            <ChevronRight size={16} />
          </button>
        ) : (
          <div className="p-2 bg-surface-muted rounded-md text-app-muted">
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
