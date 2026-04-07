import React from 'react';
import { Icons } from '../../../context/AppContext';

const BillingTable = ({
  filtered,
  handleDelete,
  handleDownload,
  openEdit,
  handleMarkPaid,
}) => {
  const { Edit, Trash, Check, Download } = Icons;
  return (
    <div>
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                {[
                  'Invoice',
                  'Patient',
                  'Doctor',
                  'Services',
                  'Due Date',
                  'Amount',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {filtered.map((inv) => (
                <tr
                  key={inv._id}
                  className='hover:bg-gray-50'>
                  <td className='px-4 py-3 text-sm font-medium text-blue-600'>
                    #{inv._id.slice(-6).toUpperCase()}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    {inv.patient?.name || 'N/A'}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    {inv.doctor?.name || 'N/A'}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500'>
                    {inv.services.map((s) => s.name).join(', ')}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    {new Date(inv.dueDate).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3 text-sm font-medium'>
                    ${inv.totalAmount.toLocaleString()}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : inv.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : inv.status === 'Draft'
                              ? 'bg-gray-100 text-gray-600' // 👈 add
                              : 'bg-red-100 text-red-700'
                      }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex gap-1'>
                      <button
                        onClick={() => openEdit(inv)}
                        className='p-2 bg-blue-50 rounded hover:bg-blue-100'>
                        <Edit className='w-4 h-4 text-blue-700' />
                      </button>
                      {inv.status !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(inv._id)}
                          className='p-2 bg-green-50 rounded hover:bg-green-100'>
                          <Check className='w-4 h-4 text-green-700' />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(inv)}
                        className='p-2 bg-gray-50 rounded hover:bg-gray-100'>
                        <Download className='w-4 h-4 text-gray-700' />
                      </button>
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className='p-2 bg-red-50 rounded hover:bg-red-100'>
                        <Trash className='w-4 h-4 text-red-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingTable;
