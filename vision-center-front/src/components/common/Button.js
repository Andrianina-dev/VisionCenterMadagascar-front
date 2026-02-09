import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn-${variant}`;
  const sizeClasses = `btn-${size}`;
  const loadingClasses = loading ? 'btn-loading' : '';
  const fullWidthClasses = fullWidth ? 'btn-full-width' : '';
  const disabledClasses = disabled ? 'btn-disabled' : '';
  
  const classes = [
    baseClasses,
    variantClasses,
    sizeClasses,
    loadingClasses,
    fullWidthClasses,
    disabledClasses,
    className
  ].filter(Boolean).join(' ');

  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className="btn-icon">{icon}</span>;
    }
    
    return <span className="btn-icon">{icon}</span>;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="btn-spinner"></span>
          {children && <span className="btn-text">{children}</span>}
        </>
      );
    }

    const iconElement = renderIcon();
    const textElement = children ? <span className="btn-text">{children}</span> : null;

    if (icon && iconPosition === 'right') {
      return (
        <>
          {textElement}
          {iconElement}
        </>
      );
    }

    return (
      <>
        {iconElement}
        {textElement}
      </>
    );
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-light',
    'outline-dark'
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool
};

export default Button;
