import React from 'react';

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`mb-4 w-full ${className}`}>
    <div className="relative">
      <input
        className={`peer w-full px-4 pt-6 pb-2 rounded-2xl border border-border bg-background text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-transparent ${error ? 'border-red-500' : ''}`}
        placeholder={label}
        {...props}
      />
      <label className="absolute left-4 top-2 text-muted text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm bg-background px-1 pointer-events-none">
        {label}
      </label>
    </div>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
);
