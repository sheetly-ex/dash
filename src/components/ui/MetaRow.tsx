import React from 'react';
import Card from './Card';

// ── Single row ──────────────────────────────────────────────
interface MetaRowProps {
  label: string;
  value: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
  bordered?: boolean;
  className?: string;
}

export const MetaRow: React.FC<MetaRowProps> = ({
  label,
  value,
  layout = 'horizontal',
  bordered = false,
  className = '',
}) => {
  if (layout === 'vertical') {
    return (
      <div className={className}>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-[14px] font-black text-slate-800">{value}</div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${bordered ? 'py-2 border-b border-slate-50 last:border-0' : ''} ${className}`}>
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-[13px] font-bold text-slate-700">{value}</span>
    </div>
  );
};

// ── Grid of vertical MetaRows wrapped in a Card ───────────────
interface MetaGridItem {
  label: string;
  value: React.ReactNode;
}

interface MetaGridProps {
  items: MetaGridItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export const MetaGrid: React.FC<MetaGridProps> = ({
  items,
  columns = 3,
  className = '',
}) => {
  const colClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns];
  return (
    <div className={`grid ${colClass} gap-3 md:gap-4 ${className}`}>
      {items.map(({ label, value }) => (
        <Card key={label} noPadding className="p-4 border-slate-100 shadow-none">
          <MetaRow label={label} value={value} layout="vertical" />
        </Card>
      ))}
    </div>
  );
};

export default MetaRow;
