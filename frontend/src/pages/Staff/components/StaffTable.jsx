import React from 'react';
import { Icons } from '../../../context/AppContext';

const StaffTable = ({ staff, onEdit, onDelete, userData }) => {
  const { Edit, Trash } = Icons;
  const isAdmin = userData?.role === 'admin';

  return (
    <div>
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='w-full'>
          <div className='min-w-full md:min-w-[900px]'>
            {/* ------------ List Table Title (Desktop Only) ------------ */}
            <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] items-center py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400'>
              <b>Name</b>
              <b>Age</b>
              <b>Gender</b>
              <b>Role</b>
              <b>Department</b>
              <b>Status</b>
              <b className='w-32 text-center'>Actions</b>
            </div>

            {/* ------------ Staff List ------------ */}
            {staff.map((member) => (
              <div
                key={member._id}
                className='border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] gap-3 md:gap-0 md:items-center text-sm transition-colors'>
                {/* Name */}
                <div className='flex flex-col md:flex-row md:items-center gap-1'>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Name
                  </p>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0'>
                      <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <p className='font-medium text-gray-900 dark:text-white'>{member.name}</p>
                      <p className='text-xs text-gray-500 dark:text-gray-400'>
                        ID: {member._id.slice(-4).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Age
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>{member.age}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Gender
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>{member.gender}</p>
                </div>

                {/* Role */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Role
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>{member.role}</p>
                </div>

                {/* Department */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Department
                  </p>
                  <p className='text-gray-900 dark:text-gray-200'>
                    {member.department?.name || member.department}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : member.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border dark:border-gray-600 dark:text-gray-300'
                    }`}>
                    {member.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 mt-4 md:mt-0 md:w-32 pt-3 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-0 justify-start md:justify-center'>
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => onEdit(member)}
                        className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center transition-colors'
                        title='Edit Staff'>
                        <Edit className='w-4 h-4 text-blue-700 dark:text-blue-400' />
                      </button>
                      <button
                        onClick={() => onDelete(member._id)}
                        className='p-2 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-900/50 flex justify-center transition-colors'
                        title='Delete Staff'>
                        <Trash className='w-4 h-4 text-red-600 dark:text-red-400' />
                      </button>
                    </>
                  ) : (
                    <span className='text-xs text-gray-400 italic font-medium'>View Only</span>
                  )}
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
