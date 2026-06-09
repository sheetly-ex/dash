import React from 'react';

type CalloutVariant = 'info' | 'warning' | 'success' | 'neutral';

interface CalloutProps {
  title?: string;
  items?: string[];
  children?: React.ReactNode;
  variant?: CalloutVariant;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<CalloutVariant, { wrap: string; title: string; text: string; dot: string }> = {
  info:    { wrap: 'bg-blue-50 border-blue-100',    title: 'text-blue-700',    text: 'text-blue-500',    dot: '·' },
  warning: { wrap: 'bg-amber-50 border-amber-100',  title: 'text-amber-700',   text: 'text-amber-600',   dot: '·' },
  success: { wrap: 'bg-emerald-50 border-emerald-100', title: 'text-emerald-700', text: 'text-emerald-600', dot: '·' },
  neutral: { wrap: 'bg-slate-50 border-slate-100',  title: 'text-slate-600',   text: 'text-slate-400',   dot: '·' },
};

const Callout: React.FC<CalloutProps> = ({
  title,
  items = [],
  children,
  variant = 'neutral',
  icon,
  className = '',
}) => {
  const s = variantStyles[variant];
  return (
    <div className={`p-5 rounded border ${s.wrap} ${className}`}>
      <div className="flex items-start gap-3">
        {icon && <div className={`shrink-0 mt-0.5 ${s.title}`}>{icon}</div>}
        <div className="flex-1">
          {title && <div className={`text-[12px] font-black mb-2 ${s.title}`}>{title}</div>}
          {items.length > 0 && (
            <ul className="space-y-1.5">
              {items.map(item => (
                <li key={item} className={`text-[11px] font-bold flex items-start gap-1.5 ${s.text}`}>
                  <span className="shrink-0">{s.dot}</span>{item}
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Callout;
