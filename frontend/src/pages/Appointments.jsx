import React from 'react';
import { appointments } from '../data/dummyData';
import { Icons } from '../context/AppContext';
import Title from '../components/Title';

const Appointments = () => {
  const { Search, Filter, Plus, Calendar, Clock } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Appointments'
            subtitle='Schedule and manage patient appointments'
          />
        </div>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>New Appointment</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search appointments...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Main Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Appointments List */}
        <div className='lg:col-span-2 space-y-4'>
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                      <span className='font-medium text-blue-600'>
                        {appointment.patient
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900'>
                        {appointment.patient}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        {appointment.doctor} - {appointment.department}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-6 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      {appointment.date}
                    </div>
                    <div className='flex items-center gap-2'>
                      <Clock className='w-4 h-4' />
                      {appointment.time}
                    </div>
                    <span className='px-2 py-1 bg-gray-100 rounded text-xs'>
                      {appointment.type}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                  }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className='bg-white rounded-lg border border-gray-200 p-6 h-fit'>
          <h3 className='font-semibold text-gray-900 mb-4'>Quick Stats</h3>
          <div className='space-y-4'>
            <div className='p-4 bg-blue-50 rounded-lg'>
              <p className='text-sm text-blue-600'>Today</p>
              <p className='text-2xl font-semibold text-blue-900 mt-1'>4</p>
              <p className='text-xs text-blue-600 mt-1'>Appointments</p>
            </div>
            <div className='p-4 bg-green-50 rounded-lg'>
              <p className='text-sm text-green-600'>This Week</p>
              <p className='text-2xl font-semibold text-green-900 mt-1'>28</p>
              <p className='text-xs text-green-600 mt-1'>Appointments</p>
            </div>
            <div className='p-4 bg-purple-50 rounded-lg'>
              <p className='text-sm text-purple-600'>This Month</p>
              <p className='text-2xl font-semibold text-purple-900 mt-1'>156</p>
              <p className='text-xs text-purple-600 mt-1'>Appointments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
