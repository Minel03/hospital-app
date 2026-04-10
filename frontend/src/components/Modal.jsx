import React from 'react';
import { Icons } from '../context/AppContext';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  maxWidth = 'max-w-2xl' 
}) => {
  const { X } = Icons;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all'>
      <div className={`bg-white dark:bg-gray-800 rounded-3xl ${maxWidth} w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col`}>
        {/* Header */}
        <div className='p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>
          <button
            type='button'
            onClick={onClose}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors'>
            <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
