import React from 'react';
import { Icons } from '../context/AppContext';
import { doctors } from '../data/dummyData';
import Title from '../components/Title';

const Doctors = () => {
  const { Search, Filter, Plus, Star, Phone, Mail } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Doctors'
            subtitle='Manage medical staff and their schedules'
          />
        </div>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Doctor</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search doctors by name or specialty...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Doctors Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
                <span className='text-xl font-semibold text-blue-600'>
                  {doctor.name.split(' ')[1][0]}
                  {doctor.name.split(' ')[2][0]}
                </span>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  doctor.status === 'Available'
                    ? 'bg-green-100 text-green-700'
                    : doctor.status === 'In Surgery'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                {doctor.status}
              </span>
            </div>

            <h3 className='font-semibold text-gray-900 mb-1'>{doctor.name}</h3>
            <p className='text-sm text-blue-600 mb-3'>{doctor.specialty}</p>

            <div className='flex items-center gap-1 mb-4'>
              <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
              <span className='text-sm font-medium text-gray-900'>
                {doctor.rating}
              </span>
              <span className='text-sm text-gray-500'>
                ({doctor.patients} patients)
              </span>
            </div>

            <div className='space-y-2 mb-4'>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Phone className='w-3 h-3' />
                {doctor.phone}
              </div>
              <div className='flex items-center gap-2 text-xs text-gray-600'>
                <Mail className='w-3 h-3' />
                {doctor.email}
              </div>
            </div>

            <div className='pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>Experience</span>
                <span className='font-medium text-gray-900'>
                  {doctor.experience} years
                </span>
              </div>
            </div>

            <button className='w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors'>
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
