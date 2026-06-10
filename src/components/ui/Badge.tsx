import React from 'react';

export type BadgeVariant =
  | 'blue' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm';
  uppercase?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue:    'text-blue-600 bg-blue-50 border-blue-100',
  indigo:  'text-indigo-600 bg-indigo-50 border-indigo-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  rose:    'text-rose-600 bg-rose-50 border-rose-100',
  amber:   'text-amber-600 bg-amber-50 border-amber-100',
  slate:   'text-app-muted bg-surface-muted border-app-muted',
  teal:    'text-teal-600 bg-teal-50 border-teal-100',
};

const sizeStyles: Record<'xs' | 'sm', string> = {
  xs: 'text-[9px] px-2 py-0.5',
  sm: 'text-[10px] px-2.5 py-1',
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'xs',
  uppercase = true,
  className = '',
}) => (
  <span
    className={`inline-flex items-center font-black rounded border ${variantStyles[variant]} ${sizeStyles[size]} ${uppercase ? 'uppercase tracking-widest' : ''} ${className}`}
  >
    {children}
  </span>
);

// Pre-mapped status key → variant for approval/request flows
export const STATUS_VARIANT: Record<string, BadgeVariant> = {
  pending: 'rose',
  inProgress: 'indigo',
  reviewing: 'amber',
  approved: 'emerald',
  done: 'slate',
  rejected: 'slate',
  onTrack: 'blue',
  achieved: 'emerald',
  delayed: 'rose',
  inUse: 'blue',
  reserved: 'emerald',
  completed: 'slate',
  purchase: 'blue',
  certificate: 'emerald',
  waiting: 'slate',
};

export default Badge;
