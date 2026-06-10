import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'lg';
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = '',
  size = 'lg',
  className = '',
}) => {
  const padding  = size === 'lg' ? 'pl-14 pr-6 py-4' : 'pl-9 pr-4 py-2.5';
  const iconSize = size === 'lg' ? 20 : 14;
  const iconPos  = size === 'lg' ? 'left-5' : 'left-3';
  const textSize = size === 'lg' ? 'text-sm' : 'text-[13px]';

  return (
    <div className={`relative ${className}`}>
      <Search
        size={iconSize}
        className={`absolute ${iconPos} top-1/2 -translate-y-1/2 text-app-muted`}
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-surface-muted border border-app-muted rounded ${padding} ${textSize} font-bold text-app-secondary placeholder:text-app-muted focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all outline-none`}
      />
    </div>
  );
};

export default SearchInput;
