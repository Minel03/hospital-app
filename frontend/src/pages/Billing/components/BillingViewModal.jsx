import React from 'react';
import { Icons } from '../../../context/AppContext';

const BillingViewModal = ({ showModal, setShowModal, invoice, onPrint, onDownload }) => {
  const { X, FileText, User, Calendar, CreditCard, Printer, Download } = Icons;

  if (!showModal || !invoice) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setShowModal(false)}>
      <div className='bg-white dark:bg-gray-800 p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl dark:border dark:border-gray-700' onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className='flex justify-between items-center mb-8'>
          <div className='flex items-center gap-3'>
            <div className='p-3 bg-blue-50 dark:bg-blue-900/40 rounded-xl'>
              <FileText className='w-6 h-6 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Invoice</h2>
              <p className='text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-tight'>
                #{invoice._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className='grid grid-cols-2 gap-4 mb-8'>
          <button
            onClick={onPrint}
            className='flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-all font-semibold text-sm'>
            <Printer className='w-4 h-4' />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={onDownload}
            className='flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl transition-all font-semibold text-sm'>
            <Download className='w-4 h-4' />
            <span>Save PDF</span>
          </button>
        </div>

        {/* Content */}
        <div className='bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 space-y-6 border border-gray-100 dark:border-gray-800'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-1'>
              <p className='text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>Patient Information</p>
              <div className='flex items-center gap-2'>
                <User className='w-4 h-4 text-blue-500' />
                <p className='font-bold text-gray-900 dark:text-white'>{invoice.patient?.name || 'N/A'}</p>
              </div>
            </div>

            <div className='space-y-1 text-right'>
              <p className='text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>Issue Date</p>
              <div className='flex items-center justify-end gap-2'>
                <Calendar className='w-4 h-4 text-gray-400' />
                <p className='font-bold text-gray-900 dark:text-white'>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-200 dark:border-gray-800 pt-6'>
            <div className='flex justify-between items-center mb-4'>
               <h3 className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Services Summary</h3>
               <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                  invoice.status === 'Paid' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                }`}>
                  {invoice.status}
                </span>
            </div>
            
            <div className='space-y-3'>
              {invoice.services.map((s, idx) => (
                <div key={idx} className='flex justify-between items-center text-sm'>
                  <span className='text-gray-600 dark:text-gray-400'>{s.name}</span>
                  <span className='font-bold text-gray-900 dark:text-white'>${parseFloat(s.amount).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-between items-end'>
              <div className='space-y-1'>
                <p className='text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold text-left'>Total Payable</p>
                <div className='text-3xl font-black text-blue-600 dark:text-blue-400'>
                  ${invoice.totalAmount.toLocaleString()}
                </div>
              </div>
              <div className='text-right pb-1'>
                 <p className='text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold'>Due Date</p>
                 <p className='font-bold text-gray-900 dark:text-white text-sm'>
                   {new Date(invoice.dueDate).toLocaleDateString()}
                 </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className='w-full mt-8 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-2xl hover:opacity-90 transition-all text-sm'>
          Close Details
        </button>
      </div>
    </div>
  );
};

export default BillingViewModal;
