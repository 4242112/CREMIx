import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast = ({ message, type = 'success', open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className={`fixed bottom-6 right-6 z-50 px-6 py-3 rounded-2xl shadow-card text-white font-medium ${
          type === 'success' ? 'bg-primary' : type === 'error' ? 'bg-red-600' : 'bg-muted'
        }`}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 text-white/80 hover:text-white text-lg leading-none">&times;</button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
