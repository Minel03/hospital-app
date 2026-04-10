import React from 'react';
import { Icons } from '../../../context/AppContext';

const BillingViewModal = ({ showModal, setShowModal, invoice }) => {
  const { X, FileText, User, Calendar, CreditCard } = Icons;

  if (!showModal || !invoice) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl dark:border dark:border-gray-700'>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg'>
              <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Invoice Details</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>#{invoice._id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Content */}
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4'>
            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
              <User className='w-5 h-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold'>Patient</p>
                <p className='font-medium text-gray-900 dark:text-white'>{invoice.patient?.name || 'N/A'}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
              <Calendar className='w-5 h-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold'>Due Date</p>
                <p className='font-medium text-gray-900 dark:text-white'>
                  {new Date(invoice.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl'>
              <CreditCard className='w-5 h-5 text-gray-400 mt-0.5' />
              <div>
                <p className='text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold'>Status</p>
                <span className={`inline-block mt-1 px-3 py-1 text-xs font-bold rounded-full ${
                  invoice.status === 'Paid' 
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300' 
                    : invoice.status === 'Overdue'
                    ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                    : 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
                }`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-100 dark:border-gray-700 pt-6'>
            <h3 className='font-bold text-gray-900 dark:text-white mb-4'>Services Summary</h3>
            <div className='space-y-3'>
              {invoice.services.map((s, idx) => (
                <div key={idx} className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>{s.name}</span>
                  <span className='font-medium text-gray-900 dark:text-white'>${parseFloat(s.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className='mt-6 pt-4 border-t-2 border-dashed border-gray-100 dark:border-gray-700 flex justify-between items-center'>
              <span className='text-lg font-bold text-gray-900 dark:text-white'>Total Amount</span>
              <span className='text-2xl font-black text-blue-600 dark:text-blue-400'>
                ${invoice.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className='w-full mt-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]'>
          Close Details
        </button>
      </div>
    </div>
  );
};

export default BillingViewModal;
