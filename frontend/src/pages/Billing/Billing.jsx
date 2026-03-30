import React from 'react';
import { invoices, statsBilling } from '../../data/dummyData';
import { Icons } from '../../context/AppContext';
import Title from '../../components/Title';

const Billing = () => {
  const { Search, Filter, Plus, Download } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Billing'
            subtitle='Manage payments and financial records'
          />
        </div>
        <div className='flex items-center gap-3'>
          <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
            <Download className='w-5 h-5' />
            <span className='hidden sm:inline'>Export</span>
          </button>
          <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
            <Plus className='w-5 h-5' />
            <span className='hidden sm:inline'>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {statsBilling.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
                <span
                  className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className='text-sm text-gray-500 mb-1'>{stat.label}</p>
              <p className='text-3xl font-semibold text-gray-900'>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search invoices by patient or ID...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Invoices Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Invoice ID
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Service
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Due Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Amount
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap font-medium text-blue-600'>
                    {invoice.id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {invoice.patient}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {invoice.service}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {invoice.date}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {invoice.dueDate}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    ${invoice.amount.toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : invoice.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm space-x-2'>
                    <button className='text-blue-600 hover:text-blue-800'>
                      View
                    </button>
                    <button className='text-gray-600 hover:text-gray-800'>
                      Download
                    </button>
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

export default Billing;
