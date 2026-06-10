import React from 'react';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  hoverable?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = true,
  noPadding = false,
  ...rest
}) => {
  const baseStyles = "bg-surface-elevated border border-app-muted shadow-sm transition-all duration-300";
  const hoverStyles = hoverable ? "hover:shadow-md cursor-pointer" : "";
  const paddingStyles = noPadding ? "" : "p-6 md:p-8";
  const roundedStyles = "rounded-[0.5rem] md:rounded-[0.5rem]";

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddingStyles} ${roundedStyles} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
