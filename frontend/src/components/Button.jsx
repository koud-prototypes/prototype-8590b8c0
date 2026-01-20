import React from 'react';

const Button = ({ 
  onClick, 
  children, 
  variant = 'default', 
  className = '',
  disabled = false 
}) => {
  const baseStyle = "font-semibold py-5 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg";
  
  const variants = {
    default: "bg-gray-700 hover:bg-gray-600 text-white",
    operator: "bg-orange-600 hover:bg-orange-700 text-white text-2xl",
    special: "bg-blue-600 hover:bg-blue-700 text-white",
    clear: "bg-red-600 hover:bg-red-700 text-white",
    clearEntry: "bg-red-500 hover:bg-red-600 text-white",
    equals: "bg-green-600 hover:bg-green-700 text-white text-2xl",
    number: "bg-gray-700 hover:bg-gray-600 text-white text-2xl"
  };

  const variantStyle = variants[variant] || variants.default;
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;