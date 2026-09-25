'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="sm:flex sm:items-start w-full">
          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
            {title && (
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {title}
              </h3>
            )}
            <div className="mt-2">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
