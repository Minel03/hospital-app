import React from 'react';
import { Icons } from '../../../context/AppContext';

const BillingTable = ({
  filtered,
  handleDelete,
  handleDownload,
  openEdit,
  handleMarkPaid,
  openView,
  handlePrint,
  userData,
}) => {
  const { Edit, Trash, Check, Download, ReceiptText, Printer } = Icons;

  const canManage = ['admin', 'accountant'].includes(userData?.role);
  const isAdmin = userData?.role === 'admin';

  return (
    <div>
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='w-full'>
          <div className='min-w-full md:min-w-[1000px]'>
            {/* Table Header */}
            <div className='hidden md:grid grid-cols-[1fr_2fr_2fr_2fr_1.5fr_1fr_1fr_auto] items-center py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400'>
              <b>Invoice</b>
              <b>Patient</b>
              <b>Doctor</b>
              <b>Services</b>
              <b>Due Date</b>
              <b>Amount</b>
              <b>Status</b>
              <b className='w-32 text-center'>Actions</b>
            </div>

            {/* List */}
            {filtered.map((inv) => (
              <div
                key={inv._id}
                className='border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 grid grid-cols-1 md:grid-cols-[1fr_2fr_2fr_2fr_1.5fr_1fr_1fr_auto] gap-3 md:gap-0 md:items-center text-sm transition-colors'>
                
                {/* Invoice */}
                <div className='flex flex-col md:flex-row md:items-center gap-1'>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider'>
                    Invoice
                  </p>
                  <p className='font-medium text-blue-600 dark:text-blue-400'>
                    #{inv._id.slice(-6).toUpperCase()}
                  </p>
                </div>

                {/* Patient */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Patient
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>{inv.patient?.name || 'N/A'}</p>
                </div>

                {/* Doctor */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Doctor
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>{inv.doctor?.name || 'N/A'}</p>
                </div>

                {/* Services */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Services
                  </p>
                  <p className='text-gray-500 dark:text-gray-400 truncate pr-2'>
                    {inv.services.map((s) => s.name).join(', ')}
                  </p>
                </div>

                {/* Due Date */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Due Date
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Amount
                  </p>
                  <p className='font-medium text-gray-900 dark:text-white'>
                    ${inv.totalAmount.toLocaleString()}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Status
                  </p>
                  <span
                    className={`inline-block mt-1 md:mt-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                      inv.status === 'Paid'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : inv.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                          : inv.status === 'Draft'
                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:border dark:border-gray-700'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    }`}>
                    {inv.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 mt-4 md:mt-0 md:w-32 flex-wrap pt-3 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-0 justify-start md:justify-center'>
                  {/* Edit - only show if not Paid and can manage */}
                  {inv.status !== 'Paid' && canManage && (
                    <button
                      onClick={() => openEdit(inv)}
                      className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center transition-colors'
                      title='Edit Invoice'>
                      <Edit className='w-4 h-4 text-blue-700 dark:text-blue-400' />
                    </button>
                  )}

                  {/* View */}
                  <button
                    onClick={() => openView(inv)}
                    className='p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center transition-colors'>
                    <ReceiptText className='w-4 h-4 text-gray-700 dark:text-gray-300' />
                  </button>

                  {/* Mark Paid - only if not Paid and can manage */}
                  {inv.status !== 'Paid' && canManage && (
                    <button
                      onClick={() => handleMarkPaid(inv._id)}
                      className='p-2 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-900/50 flex justify-center transition-colors'
                      title='Mark Paid'>
                      <Check className='w-4 h-4 text-green-700 dark:text-green-400' />
                    </button>
                  )}

                  {/* Download */}
                  <button
                    onClick={() => handleDownload(inv)}
                    className='p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center transition-colors'>
                    <Download className='w-4 h-4 text-gray-700 dark:text-gray-300' />
                  </button>

                  {/* Print */}
                  <button
                    onClick={() => handlePrint(inv)}
                    className='p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center transition-colors'>
                    <Printer className='w-4 h-4 text-gray-700 dark:text-gray-300' />
                  </button>

                  {/* Delete - only show if not Paid and is admin */}
                  {inv.status !== 'Paid' && isAdmin && (
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className='p-2 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-900/50 flex justify-center transition-colors'
                      title='Delete Invoice'>
                      <Trash className='w-4 h-4 text-red-600 dark:text-red-400' />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingTable;
