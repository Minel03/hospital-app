import React from 'react';
import { Icons } from '../../../context/AppContext';

const BillingHeader = ({ openAdd, stats }) => {
  const { Plus } = Icons;
  return (
    <div>
      <div className='flex justify-between'>
        <div>
          <h2 className='text-2xl font-semibold'>Billing</h2>
          <p className='text-gray-500'>Manage payments and financial records</p>
        </div>
        <button
          onClick={openAdd}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg'>
          <Plus className='w-5 h-5' /> New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
        {stats.map((s, i) => {
          const Icon = s.icon;

          return (
            <div
              key={i}
              className='bg-white rounded-lg border border-gray-200 p-6 flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500'>{s.label}</p>
                <p className='text-3xl font-semibold'>{s.value}</p>
              </div>

              <div className={`${s.color} p-3 rounded-lg`}>
                <Icon className='w-6 h-6 text-white' />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillingHeader;
