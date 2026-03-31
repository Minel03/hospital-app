import React from 'react';
import { Icons } from '../../../context/AppContext';

const DepartmentCardGrid = ({ departments, onEdit, onDelete }) => {
  const { Stethoscope, Phone, Edit, Trash } = Icons;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {departments.map((dept) => (
        <div
          key={dept._id}
          className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <h3 className='text-xl font-semibold text-gray-900 mb-1'>
                {dept.name}
              </h3>
              <p className='text-sm text-gray-500'>{dept.description}</p>
            </div>
            <span className='px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700'>
              {dept.status}
            </span>
          </div>

          <div className='mb-4'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Stethoscope className='w-4 h-4' />
              <span className='font-medium'>Head:</span>
              <span>{dept.head?.name}</span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <StatBox
              label='Doctors'
              value={dept.doctors || 0}
              color='text-blue-600 bg-blue-50'
            />
            <StatBox
              label='Staff'
              value={dept.staff || 0}
              color='text-purple-600 bg-purple-50'
            />
            <StatBox
              label='Patients'
              value={dept.patients || 0}
              color='text-green-600 bg-green-50'
            />
            <StatBox
              label='Rooms & Beds'
              value={`${dept.occupiedBeds || 0} / ${dept.totalBeds || 0}`}
              subLabel={`${dept.availableBeds || 0} available`} // ← optional extra info
              color='text-orange-600 bg-orange-50'
            />
          </div>

          <div className='pt-4 border-t border-gray-200'>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Phone className='w-4 h-4' />
              {dept.phone}
            </div>
          </div>

          <div className='flex gap-3 mt-4'>
            <button
              onClick={() => onEdit(dept)}
              className='flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100'>
              <Edit className='w-4 h-4 inline mr-1' />
              <span className='hidden md:inline'>Edit</span>
            </button>
            <button
              onClick={() => onDelete(dept._id)}
              className='flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100'>
              <Trash className='w-4 h-4 inline mr-1' />
              <span className='hidden md:inline'>Delete</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const StatBox = ({ label, value, subLabel, color }) => (
  <div className={`rounded-lg p-3 ${color.split(' ')[1]}`}>
    <p className='text-xs text-gray-600 mb-1'>{label}</p>
    <p className={`text-2xl font-semibold ${color.split(' ')[0]}`}>{value}</p>
    {subLabel && <p className='text-xs text-gray-500 mt-1'>{subLabel}</p>}
  </div>
);

export default DepartmentCardGrid;
