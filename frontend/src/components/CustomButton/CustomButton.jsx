import React from "react";

const CustomButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  fullWidth = false,
  size = "medium",
  className = "",
  type = "button",
  loading = false
}) => {
  // Base styles
  const baseStyle = `
    font-medium transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-offset-2 
    disabled:opacity-60 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
    ${fullWidth ? 'w-full' : ''}
  `;

  // Size styles
  const sizeStyles = {
    small: "px-3 py-1.5 text-sm rounded-lg",
    medium: "px-5 py-2.5 text-base rounded-lg",
    large: "px-6 py-3 text-lg rounded-xl"
  };

  // Variant styles for light mode
  const variantStylesLight = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500",
    outline: "bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    gradient: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-indigo-500",
    dark: "bg-gray-900 hover:bg-gray-800 text-white focus:ring-gray-700"
  };

  // Variant styles for dark mode
  const variantStylesDark = {
    primary: "dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:text-white dark:focus:ring-indigo-400",
    secondary: "dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:focus:ring-gray-500",
    success: "dark:bg-green-500 dark:hover:bg-green-600 dark:text-white dark:focus:ring-green-400",
    danger: "dark:bg-red-500 dark:hover:bg-red-600 dark:text-white dark:focus:ring-red-400",
    warning: "dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:text-white dark:focus:ring-yellow-400",
    outline: "dark:bg-transparent dark:border dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-200 dark:focus:ring-gray-500",
    ghost: "dark:bg-transparent dark:hover:bg-gray-800 dark:text-gray-200 dark:focus:ring-gray-500",
    gradient: "dark:bg-gradient-to-r dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 dark:text-white dark:focus:ring-indigo-400",
    dark: "dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:focus:ring-gray-600"
  };

  // Combine all styles
  const buttonStyles = `
    ${baseStyle}
    ${sizeStyles[size] || sizeStyles.medium}
    ${variantStylesLight[variant] || variantStylesLight.primary}
    ${variantStylesDark[variant] || variantStylesDark.primary}
    ${className}
    ${loading ? 'opacity-80 cursor-wait' : ''}
  `.trim().replace(/\s+/g, ' ');

  // Loading spinner
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4 text-current" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonStyles}
    >
      {loading && <LoadingSpinner />}
      {children}
    </button>
  );
};

export default CustomButton;