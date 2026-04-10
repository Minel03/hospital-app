import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const DepartmentHeader = ({ onAddDepartment, stats }) => {
  const { Plus } = Icons;

  return (
    <div className='space-y-6'>
      {/* Header with title and add button */}
      <div className='flex items-center justify-between'>
        <Title
          title='Departments'
          subtitle='Manage hospital departments and their resources'
        />
        <button
          onClick={onAddDepartment}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Department</span>
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = Icons[stat.icon];
          return (
            <div
              key={index}
              className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 relative transition-colors'>
              <div
                className={`absolute top-4 right-4 ${stat.color} p-3 rounded-lg`}>
                <Icon className='w-5 h-5 text-white' />
              </div>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{stat.label}</p>
              <p className='text-3xl font-semibold text-gray-900 dark:text-white mt-2'>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentHeader;
