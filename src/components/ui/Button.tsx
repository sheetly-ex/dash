import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonColor   = 'blue' | 'emerald' | 'rose' | 'slate';
type ButtonSize    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  color?: ButtonColor;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const base = 'inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest rounded transition-all cursor-pointer border-none';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'text-[10px] px-4 py-2',
  md: 'text-[12px] px-6 py-3',
  lg: 'text-[12px] px-8 py-4',
};

function variantStyles(variant: ButtonVariant, color: ButtonColor): string {
  if (variant === 'primary') {
    const map: Record<ButtonColor, string> = {
      blue:    'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 disabled:bg-surface-muted disabled:text-app-muted disabled:shadow-none',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 disabled:bg-surface-muted disabled:text-app-muted disabled:shadow-none',
      rose:    'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/20',
      slate:   'bg-surface-elevated text-white hover:bg-surface-elevated',
    };
    return map[color];
  }
  if (variant === 'secondary') {
    return 'bg-surface-muted text-app-secondary hover:bg-surface-muted';
  }
  if (variant === 'outline') {
    return 'bg-surface-elevated border border-app text-app-muted hover:border-blue-300 hover:text-blue-600';
  }
  if (variant === 'ghost') {
    return 'bg-transparent text-app-muted hover:text-blue-600';
  }
  if (variant === 'danger') {
    return 'bg-rose-600 text-white hover:bg-rose-700';
  }
  return '';
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  color = 'blue',
  size = 'lg',
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    disabled={disabled}
    className={`${base} ${sizeStyles[size]} ${variantStyles(variant, color)} ${fullWidth ? 'w-full' : ''} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
    {...props}
  >
    {icon && <span className="shrink-0">{icon}</span>}
    {children}
  </button>
);

export default Button;
