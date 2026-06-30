'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-500 hover:bg-red-600 shadow-red-500/20',
    warning: 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/20',
    info: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
  };

  const iconStyles = {
    danger: 'text-red-500 bg-red-50',
    warning: 'text-yellow-500 bg-yellow-50',
    info: 'text-blue-500 bg-blue-50'
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-black/5 dark:border-white/10">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${iconStyles[variant]}`}>
              <AlertTriangle className="w-8 h-8" />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition">
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8 font-medium">
            {message}
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl font-bold text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 transition duration-300"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4 rounded-2xl font-bold text-white transition duration-300 shadow-lg ${variantStyles[variant]}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
