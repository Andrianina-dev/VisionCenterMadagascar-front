import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  text = null,
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    success: 'spinner-success',
    danger: 'spinner-danger',
    warning: 'spinner-warning',
    info: 'spinner-info',
    light: 'spinner-light',
    dark: 'spinner-dark'
  };

  const classes = [
    'spinner',
    sizeClasses[size] || sizeClasses.medium,
    colorClasses[color] || colorClasses.primary,
    className
  ].filter(Boolean).join(' ');

  const spinnerElement = (
    <div className={classes}>
      <div className="spinner-circle"></div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="spinner-overlay">
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']),
  text: PropTypes.string,
  overlay: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;
