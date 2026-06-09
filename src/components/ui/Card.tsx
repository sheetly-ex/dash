import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  noPadding = false
}) => {
  const baseStyles = "bg-[#fafafa] border border-slate-100 shadow-sm transition-all duration-300";
  const hoverStyles = hoverable ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer" : "";
  const paddingStyles = noPadding ? "" : "p-6 md:p-8";
  const roundedStyles = "rounded-[0.5rem] md:rounded-[0.5rem]";

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${roundedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
