import React from 'react';
import { Icons } from '../../../context/AppContext';

const DepartmentCardGrid = ({ departments, onEdit, onDelete, userData }) => {
  const { Stethoscope, Phone, Edit, Trash } = Icons;
  const isAdmin = userData?.role === 'admin';

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {departments.map((dept) => (
        <div
          key={dept._id}
          className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-1'>
                {dept.name}
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{dept.description}</p>
            </div>
            <span className='px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'>
              {dept.status}
            </span>
          </div>

          <div className='mb-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <Stethoscope className='w-4 h-4' />
              <span className='font-medium dark:text-gray-300'>Head:</span>
              <span className='dark:text-white'>{dept.head?.name}</span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <StatBox
              label='Doctors'
              value={dept.doctors || 0}
              color='text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30'
            />
            <StatBox
              label='Staff'
              value={dept.staff || 0}
              color='text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/30'
            />
            <StatBox
              label='Patients'
              value={dept.patients || 0}
              color='text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30'
            />
            <StatBox
              label='Rooms & Beds'
              value={`${dept.occupiedBeds || 0} / ${dept.totalBeds || 0}`}
              subLabel={`${dept.availableBeds || 0} available`} // ← optional extra info
              color='text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/30'
            />
          </div>

          <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
              <Phone className='w-4 h-4' />
              {dept.phone}
            </div>
          </div>

          {isAdmin && (
            <div className='flex gap-3 mt-4'>
              <button
                onClick={() => onEdit(dept)}
                className='flex-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'
                title='Edit Department'>
                <Edit className='w-4 h-4 inline mr-1' />
              </button>
              <button
                onClick={() => onDelete(dept._id)}
                className='flex-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors'
                title='Delete Department'>
                <Trash className='w-4 h-4 inline mr-1' />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const StatBox = ({ label, value, subLabel, color }) => {
  const [textColor, bgColor] = color.split(' ');
  const darkTextColor = color.split(' ')[2] || textColor;
  const darkBgColor = color.split(' ')[3] || bgColor;

  return (
    <div className={`rounded-lg p-3 ${bgColor} ${darkBgColor}`}>
      <p className='text-xs text-gray-600 dark:text-gray-400 mb-1'>{label}</p>
      <p className={`text-2xl font-semibold ${textColor} ${darkTextColor}`}>{value}</p>
      {subLabel && <p className='text-xs text-gray-500 dark:text-gray-400 mt-1 opacity-80'>{subLabel}</p>}
    </div>
  );
};

export default DepartmentCardGrid;
