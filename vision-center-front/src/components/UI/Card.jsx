import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'normal',
  shadow = 'medium',
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-lg';
  
  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const shadows = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-lg',
    large: 'shadow-xl',
  };

  const hoverClasses = hover ? 'hover:shadow-xl transform hover:scale-105 transition-all duration-200' : '';

  const classes = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
