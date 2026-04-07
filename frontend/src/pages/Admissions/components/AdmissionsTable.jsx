import React from 'react';
import { Icons } from '../../../context/AppContext';

const AdmissionsTable = ({
  filteredAdmissions,
  openEditModal,
  openViewModal,
  dischargePatient,
  deleteAdmission,
}) => {
  const { Edit, Eye, LogOut, Trash } = Icons;
  return (
    <div>
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-250'>
            {/* Table Header (Desktop Only) */}
            <div className='hidden md:grid grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr_auto] items-center py-2 px-3 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600'>
              <b>Patient</b>
              <b>Doctor</b>
              <b>Department</b>
              <b>Room/Bed</b>
              <b>Admission Date</b>
              <b>Status</b>
              <b className='w-28 text-center'>Actions</b>
            </div>

            {/* Admissions List */}
            {filteredAdmissions.map((a) => (
              <div
                key={a._id}
                className='border-b border-gray-200 px-3 py-3 hover:bg-gray-50 grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_2fr_2fr_1fr_auto] gap-2 md:gap-0 md:items-center text-sm'>
                {/* Patient */}
                <div className='flex flex-col md:flex-row md:items-center gap-1'>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Patient
                  </p>
                  <p className='font-medium text-gray-900'>{a.patient?.name}</p>
                  <p className='md:hidden text-xs text-gray-500'>
                    ID: {a.patient?._id.slice(-4)}
                  </p>
                </div>

                {/* Doctor */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Doctor
                  </p>
                  <p className='text-gray-900'>{a.doctor?.name}</p>
                </div>

                {/* Department */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Department
                  </p>
                  <p className='text-gray-900'>{a.department?.name}</p>
                </div>

                {/* Room/Bed */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Room/Bed
                  </p>
                  <p className='text-gray-900'>
                    {a.bed?.room?.roomNumber}-{a.bed?.bedNumber}
                  </p>
                </div>

                {/* Admission Date */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Admission
                  </p>
                  <p className='text-gray-900'>
                    {new Date(a.admissionDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      a.status === 'Admitted'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                    {a.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 md:w-28 justify-start md:justify-center'>
                  <button
                    onClick={() => openViewModal(a)}
                    className='p-2 bg-gray-50 rounded hover:bg-gray-100 flex justify-center'>
                    <Eye className='w-4 h-4 text-gray-700' />
                  </button>
                  <button
                    onClick={() => openEditModal(a)}
                    className='p-2 bg-blue-50 rounded hover:bg-blue-100 flex justify-center'>
                    <Edit className='w-4 h-4 text-blue-700' />
                  </button>
                  {a.status === 'Admitted' && (
                    <button
                      onClick={() => dischargePatient(a._id)}
                      className='p-2 bg-green-50 rounded hover:bg-green-100 flex justify-center'>
                      <LogOut className='w-4 h-4 text-green-700' />
                    </button>
                  )}
                  <button
                    onClick={() => deleteAdmission(a._id)}
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

export default AdmissionsTable;
