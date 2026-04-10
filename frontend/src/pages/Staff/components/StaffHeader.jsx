import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const StaffHeader = ({
  setShowAddModal,
  setEditingStaff,
  resetForm,
  stats,
}) => {
  const { Plus, Users } = Icons;
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Staff'
            subtitle='Manage hospital staff members'
          />
        </div>
        <button
          onClick={() => {
            setEditingStaff(null);
            resetForm();
            setShowAddModal(true);
          }}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>{stat.label}</p>
                <p className='text-3xl font-semibold text-gray-900 dark:text-white'>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Users className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffHeader;
