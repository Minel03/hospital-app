import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const BedsHeader = ({ openAddRoomModal, openAddBedModal, statsConfig }) => {
  const { Plus } = Icons;
  return (
    <div>
      <div className='flex items-center justify-between'>
        <Title
          title='Rooms & Beds'
          subtitle='Manage hospital rooms and bed allocation'
        />
        <div className='flex gap-2'>
          <button
            onClick={openAddRoomModal}
            className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
            <Plus className='w-5 h-5' /> Add Room
          </button>
          <button
            onClick={openAddBedModal}
            className='flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition'>
            <Plus className='w-5 h-5' /> Add Bed
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {statsConfig.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className='flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors'>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{stat.label}</p>
                <p className='text-2xl font-bold text-gray-900 dark:text-white'>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className='w-6 h-6 text-white' />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BedsHeader;
