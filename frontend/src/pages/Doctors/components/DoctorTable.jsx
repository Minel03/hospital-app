import React from 'react';
import { Icons } from '../../../context/AppContext';

const DoctorTable = ({ doctors, onEdit, onDelete }) => {
  const { Star, Phone, Mail, Edit, Trash, Eye } = Icons;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {doctors.map((doctor) => (
        <div
          key={doctor._id}
          className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow'>
          <div className='flex items-start justify-between mb-4'>
            <div className='w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center'>
              <span className='text-xl font-semibold text-blue-600 dark:text-blue-400'>
                {doctor.name
                  .split(' ')
                  .map((n, i) => (i > 0 ? n[0] : ''))
                  .join('')}
              </span>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                doctor.status === 'Available'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                  : doctor.status === 'In Surgery'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border dark:border-gray-600 dark:text-gray-300'
              }`}>
              {doctor.status}
            </span>
          </div>

          <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>{doctor.name}</h3>
          <p className='text-sm text-blue-600 dark:text-blue-400 mb-1'>{doctor.specialty}</p>

          {/* Department */}
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
            Department: {doctor.department?.name || 'N/A'}
          </p>

          <div className='flex items-center gap-1 mb-4'>
            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
            <span className='text-sm font-medium text-gray-900 dark:text-gray-200'>
              {doctor.rating}
            </span>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              ({doctor.patients} patients)
            </span>
          </div>

          <div className='space-y-2 mb-4'>
            <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
              <Phone className='w-3 h-3' /> {doctor.phone}
            </div>
            <div className='flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400'>
              <Mail className='w-3 h-3' /> {doctor.email}
            </div>
          </div>

          <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>Experience</span>
              <span className='font-medium text-gray-900 dark:text-white'>
                {doctor.experience} years
              </span>
            </div>
          </div>

          <div className='flex gap-2 mt-4'>
            <button
              onClick={() => onEdit(doctor)}
              className='flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'>
              <Edit className='w-4 h-4 inline mr-1' />
            </button>
            <button
              onClick={() => onDelete(doctor._id)}
              className='flex-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors'>
              <Trash className='w-4 h-4 inline mr-1' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorTable;
