import React from 'react';
import { rooms, statsRoom } from '../data/dummyData';
import Title from '../components/Title';
import { Icons } from '../context/AppContext';

const Rooms = () => {
  const { Search, Filter, Plus } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Rooms & Beds'
            subtitle='Manage hospital rooms and bed allocation'
          />
        </div>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Room</span>
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {statsRoom.map((stat, index) => {
          const Icon = stat.icon;
          return (
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
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
              </div>
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
            placeholder='Search rooms by number or type...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Rooms Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Room
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Floor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Capacity
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Occupied
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
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
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap font-medium text-gray-900'>
                    {room.id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.type}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.floor}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.department}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.capacity}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.occupied}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {room.patient || '-'}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        room.status === 'Available'
                          ? 'bg-green-100 text-green-700'
                          : room.status === 'Occupied' ||
                              room.status === 'In Use'
                            ? 'bg-blue-100 text-blue-700'
                            : room.status === 'Partially Occupied'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                      }`}>
                      {room.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <button className='text-blue-600 hover:text-blue-800'>
                      View Details
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

export default Rooms;
