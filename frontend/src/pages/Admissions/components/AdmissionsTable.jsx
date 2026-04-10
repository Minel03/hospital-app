import React from 'react';
import { Icons } from '../../../context/AppContext';

const AdmissionsTable = ({
  filteredAdmissions,
  openEditModal,
  openViewModal,
  dischargePatient,
  deleteAdmission,
  userData,
}) => {
  const { Edit, Eye, LogOut, Trash } = Icons;

  const canManage = ['admin', 'doctor', 'nurse', 'receptionist'].includes(userData?.role);
  const isAdmin = userData?.role === 'admin';

  return (
    <div>
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='w-full text-sm'>
          <div className='min-w-full md:min-w-[900px]'>
            {/* Table Header */}
            <div className='hidden md:grid grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr_auto] items-center py-3 px-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400'>
              <b>Patient</b>
              <b>Doctor</b>
              <b>Department</b>
              <b>Room/Bed</b>
              <b>Admission Date</b>
              <b>Status</b>
              <b className='w-32 text-center'>Actions</b>
            </div>

            {/* Admissions */}
            {filteredAdmissions.map((a) => (
              <div
                key={a._id}
                className='border-b border-gray-200 dark:border-gray-700 px-4 py-4 md:py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr_auto] gap-3 md:gap-0 md:items-center text-sm transition-colors'>
                {/* Patient */}
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold'>
                    {a.patient?.name?.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>{a.patient?.name}</p>
                    <p className='text-xs text-gray-500'>ID: {a.patient?._id?.slice(-6).toUpperCase()}</p>
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <p className='text-gray-900 dark:text-gray-200'>{a.doctor?.name}</p>
                </div>

                {/* Department */}
                <div>
                  <p className='text-gray-900 dark:text-gray-200'>{a.department?.name}</p>
                </div>

                {/* Room/Bed */}
                <div>
                  <p className='text-gray-900 dark:text-gray-200'>
                    R-{a.bed?.room?.roomNumber} / B-{a.bed?.bedNumber}
                  </p>
                </div>

                {/* Admission Date */}
                <div>
                  <p className='text-gray-900 dark:text-gray-200'>
                    {new Date(a.admissionDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      a.status === 'Admitted'
                        ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                        : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                    }`}>
                    {a.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 mt-4 md:mt-0 md:w-32 pt-3 md:pt-0 border-t border-gray-100 dark:border-gray-700 md:border-0 justify-start md:justify-center'>
                  {/* View */}
                  <button
                    onClick={() => openViewModal(a)}
                    className='p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-center transition-colors'
                    title='View Details'>
                    <Eye className='w-4 h-4 text-gray-700 dark:text-gray-300' />
                  </button>

                  {/* Edit (ONLY if admitted) */}
                  {a.status === 'Admitted' && canManage && (
                    <button
                      onClick={() => openEditModal(a)}
                      className='p-2 bg-blue-50 dark:bg-blue-900/30 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 flex justify-center transition-colors'
                      title='Edit Admission'>
                      <Edit className='w-4 h-4 text-blue-700 dark:text-blue-400' />
                    </button>
                  )}

                  {/* Discharge */}
                  {a.status === 'Admitted' && canManage && (
                    <button
                      onClick={() => dischargePatient(a._id)}
                      className='p-2 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-900/50 flex justify-center transition-colors'
                      title='Discharge Patient'>
                      <LogOut className='w-4 h-4 text-green-700 dark:text-green-400' />
                    </button>
                  )}

                  {/* Delete */}
                  {isAdmin && (
                    <button
                      onClick={() => deleteAdmission(a._id)}
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
    </div>
  );
};

export default AdmissionsTable;
