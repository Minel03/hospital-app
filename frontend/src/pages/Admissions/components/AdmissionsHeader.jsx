import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const AdmissionsHeader = ({ openAddModal, stats }) => {
  const { Plus, Users } = Icons;
  return (
    <div>
      <div className='flex items-center justify-between'>
        <Title
          title='Admissions'
          subtitle='Manage patient admissions and discharges'
        />
        <button
          onClick={openAddModal}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>New Admission</span>
        </button>
      </div>

      {/* STATS */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>{stat.label}</p>
                <p className='text-3xl font-semibold text-gray-900'>
                  {stat.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  stat.label === 'Total Admissions'
                    ? 'bg-blue-500'
                    : stat.label === 'Currently Admitted'
                      ? 'bg-green-500'
                      : 'bg-gray-500'
                }`}>
                <Users className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmissionsHeader;
