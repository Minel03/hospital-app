import React from 'react';
import { Icons } from '../../../context/AppContext';

const StaffTable = ({ filteredStaff, handleEdit, handleDelete }) => {
  const { Edit, Trash } = Icons;
  return (
    <div>
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-250'>
            {/* ------------ List Table Title (Desktop Only) ------------ */}
            <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] items-center py-2 px-3 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600'>
              <b>Name</b>
              <b>Age</b>
              <b>Gender</b>
              <b>Role</b>
              <b>Department</b>
              <b>Status</b>
              <b className='w-28 text-center'>Actions</b>
            </div>

            {/* ------------ Staff List ------------ */}
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className='border-b border-gray-200 px-3 py-3 hover:bg-gray-50 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] gap-2 md:gap-0 md:items-center text-sm'>
                {/* Name */}
                <div className='flex flex-col md:flex-row md:items-center gap-1'>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Name
                  </p>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0'>
                      <span className='text-sm font-medium text-blue-600'>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <p className='font-medium text-gray-900'>{member.name}</p>
                      <p className='text-xs text-gray-500'>ID: {member._id}</p>
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Age
                  </p>
                  <p className='text-gray-900'>{member.age}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Gender
                  </p>
                  <p className='text-gray-900'>{member.gender}</p>
                </div>

                {/* Role */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Role
                  </p>
                  <p className='text-gray-900'>{member.role}</p>
                </div>

                {/* Department */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Department
                  </p>
                  <p className='text-gray-900'>
                    {member.department?.name || member.department}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : member.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                    {member.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 md:w-28 justify-start md:justify-center'>
                  <button
                    onClick={() => handleEdit(member)}
                    className='p-2 bg-blue-50 rounded hover:bg-blue-100 flex justify-center'>
                    <Edit className='w-4 h-4 text-blue-700' />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className='p-2 bg-red-50 rounded hover:bg-red-100 flex justify-center'>
                    <Trash className='w-4 h-4 text-red-600' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffTable;
