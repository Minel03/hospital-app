import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientTable = ({ patients, onView, onEdit, onDelete, userData }) => {
  const { Eye, Edit, Trash, Phone, Mail } = Icons;

  const canEdit = ['admin', 'doctor', 'nurse', 'receptionist', 'medtech'].includes(userData?.role);
  const isAdmin = userData?.role === 'admin';

  return (
    <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
      <div className='w-full'>
        <div className='min-w-full md:min-w-[900px]'>
          {/* ------------ Table Header ------------ */}
          <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_2fr_2fr_1fr_auto] items-center py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400'>
            <b>Patient</b>
            <b>Age</b>
            <b>Gender</b>
            <b>Contact</b>
            <b>Last Visit</b>
            <b>Status</b>
            <b className='w-32 text-center'>Actions</b>
          </div>

          {/* ------------ Patient List ------------ */}
          {patients.map((patient) => (
            <div
              key={patient._id}
              className='border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_2fr_2fr_1fr_auto] gap-3 md:gap-0 md:items-center text-sm transition-colors'>
              {/* Patient */}
              <div className='flex flex-col md:flex-row md:items-center gap-1'>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Patient
                </p>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0'>
                    <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      {(patient.name || 'P')
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium text-gray-900 dark:text-white'>{patient.name}</p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      ID:{' '}
                      {patient._id
                        ?.toString()
                        .padStart(4, '0')
                        .slice(-4)
                        .toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Age
                </p>
                <p className='text-gray-900 dark:text-gray-200'>{patient.age}</p>
              </div>

              {/* Gender */}
              <div>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Gender
                </p>
                <p className='text-gray-900 dark:text-gray-200'>{patient.gender}</p>
              </div>

              {/* Contact */}
              <div className='flex flex-col text-gray-600 text-xs gap-1'>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Contact
                </p>
                <div className='flex items-center gap-1'>
                  <Phone className='w-3 h-3' /> {patient.phone}
                </div>
                <div className='flex items-center gap-1'>
                  <Mail className='w-3 h-3' /> {patient.email}
                </div>
              </div>

              {/* Last Visit */}
              <div>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Last Visit
                </p>
                <p className='text-gray-900 dark:text-gray-200'>
                  {new Date(patient.lastVisit).toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className='md:hidden text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mt-2 md:mt-0'>
                  Status
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    patient.status === 'Active'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:border dark:border-gray-600 dark:text-gray-300'
                  }`}>
                  {patient.status}
                </span>
              </div>

              {/* Actions */}
              <div className='flex gap-2 mt-4 md:mt-0 md:w-32 pt-3 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-0 justify-start md:justify-center'>
                <button
                  onClick={() => onView(patient)}
                  className='p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center transition-colors'
                  title='View Profile'>
                  <Eye className='w-4 h-4 text-gray-700 dark:text-gray-300' />
                </button>
                {canEdit && (
                  <button
                    onClick={() => onEdit(patient)}
                    className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center transition-colors'
                    title='Edit Record'>
                    <Edit className='w-4 h-4 text-blue-700 dark:text-blue-400' />
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => onDelete(patient._id)}
                    className='p-2 bg-red-50 dark:bg-red-900/30 rounded hover:bg-red-100 dark:hover:bg-red-900/50 flex justify-center transition-colors'
                    title='Delete Record'>
                    <Trash className='w-4 h-4 text-red-600 dark:text-red-400' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
