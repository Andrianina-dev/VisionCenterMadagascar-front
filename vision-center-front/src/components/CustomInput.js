import React from 'react';
import '../styles/components/couleur/couleur.css';

const CustomInput = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  name,
  className = "",
  ...props 
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className={`login-input ${className}`}
      {...props}
    />
  );
};

export default CustomInput;
