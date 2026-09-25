import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  icon: Icon,
  className = '',
  textarea = false,
  rows = 4,
  ...props
}, ref) => {
  const baseInputStyles = `
    block w-full rounded-md border-gray-300 shadow-sm
    focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
    ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${Icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        
        {textarea ? (
          <textarea
            ref={ref}
            rows={rows}
            className={baseInputStyles}
            {...props}
          />
        ) : (
          <input
            type={type}
            ref={ref}
            className={baseInputStyles}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
