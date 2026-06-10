import React from 'react';
import Card from './Card';
import { useSettings } from '../../contexts/SettingsContext';

// ── Shared label ─────────────────────────────────────────────
interface FormLabelProps {
  children: React.ReactNode;
  hint?: React.ReactNode;
}

export const FormLabel: React.FC<FormLabelProps> = ({ children, hint }) => (
  <div className="flex items-center gap-2 mb-3">
    <span className="text-[10px] font-black text-app-muted uppercase tracking-widest">{children}</span>
    {hint && <span className="text-[10px] font-bold text-app-muted normal-case tracking-normal">{hint}</span>}
  </div>
);

// ── Section wrapper (Card + label + content) ─────────────────
interface FormSectionProps {
  label?: string;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  label,
  hint,
  action,
  children,
  className = '',
}) => (
  <Card noPadding className={`p-6 border-app-muted shadow-none ${className}`}>
    {(label || action) && (
      <div className="flex items-center justify-between mb-4">
        {label && <FormLabel hint={hint}>{label}</FormLabel>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </Card>
);

// ── Shared input styles ───────────────────────────────────────
const inputBase =
  'w-full px-4 py-3 bg-surface-muted border border-app rounded text-sm font-bold text-app placeholder:text-app-muted focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 focus:bg-surface-elevated transition-all';

// ── TextField ────────────────────────────────────────────────
interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: React.ReactNode;
  wrapInCard?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  hint,
  wrapInCard = false,
  className = '',
  ...props
}) => {
  const inner = (
    <>
      {label && <FormLabel hint={hint}>{label}</FormLabel>}
      <input className={`${inputBase} ${className}`} {...props} />
    </>
  );

  if (wrapInCard) {
    return <Card noPadding className="p-6 border-app-muted shadow-none">{inner}</Card>;
  }
  return <>{inner}</>;
};

// ── TextAreaField ─────────────────────────────────────────────
interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: React.ReactNode;
  showCharCount?: boolean;
  wrapInCard?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  hint,
  showCharCount = false,
  wrapInCard = false,
  className = '',
  value,
  ...props
}) => {
  const { t } = useSettings();
  const inner = (
    <>
      {label && <FormLabel hint={hint}>{label}</FormLabel>}
      <textarea
        className={`${inputBase} resize-none leading-relaxed ${className}`}
        value={value}
        {...props}
      />
      {showCharCount && (
        <div className="text-[10px] font-bold text-app-muted italic mt-1">{String(value ?? '').length}{t('common.charSuffix')}</div>
      )}
    </>
  );

  if (wrapInCard) {
    return <Card noPadding className="p-6 border-app-muted shadow-none">{inner}</Card>;
  }
  return <>{inner}</>;
};

export default FormSection;
