import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Button = ({ variant = 'primary', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded-2xl font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light',
    secondary: 'bg-accent text-white hover:bg-accent-light',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
  };
  return (
    <button className={`${base} ${variants[variant]} shadow-card ${className}`} {...props} />
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-surface rounded-2xl shadow-card p-6 ${className}`}>{children}</div>
);

export const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 40 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="bg-surface rounded-2xl shadow-modal p-8 relative min-w-[320px] max-w-lg w-full">
        <button className="absolute top-3 right-3 text-muted hover:text-primary-dark" onClick={onClose} aria-label="Close modal">&times;</button>
        {children}
      </motion.div>
    </motion.div>
  );
};

export const SearchInput = ({ className = '', ...props }) => (
  <input type="text" className={`w-full px-4 py-2 rounded-2xl border border-border bg-background text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all ${className}`} {...props} />
);

export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-2xl ${className}`} />
);
