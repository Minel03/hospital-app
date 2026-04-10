import React from 'react';
import { Icons, useAppContext } from '../../../context/AppContext';

const AdmissionsViewModal = ({ showView, setShowView, selectedAdmission }) => {
  const { X } = Icons;
  const { getSelectStyles } = useAppContext();
  
  if (!showView || !selectedAdmission) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl dark:border dark:border-gray-700'>
        {/* Header */}
        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between'>
          <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Admission Details
          </h3>
          <button
            onClick={() => setShowView(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          {/* Profile */}
          <div className='flex items-center gap-4'>
            <div className='w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold'>
              {selectedAdmission.patient?.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <h4 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {selectedAdmission.patient?.name}
              </h4>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  selectedAdmission.status === 'Admitted'
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                    : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                }`}>
                {selectedAdmission.status}
              </span>
            </div>
          </div>

          {/* Info Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Doctor</p>
              <p className='font-medium text-gray-900 dark:text-white'>
                {selectedAdmission.doctor?.name}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Department</p>
              <p className='font-medium text-gray-900 dark:text-white'>
                {selectedAdmission.department?.name}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Room / Bed</p>
              <p className='font-medium text-gray-900 dark:text-white'>
                {selectedAdmission.bed?.room?.roomNumber}-
                {selectedAdmission.bed?.bedNumber}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Admission Date</p>
              <p className='font-medium text-gray-900 dark:text-white'>
                {new Date(
                  selectedAdmission.admissionDate,
                ).toLocaleDateString()}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg sm:col-span-2'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Expected Discharge</p>
              <p className='font-medium text-gray-900 dark:text-white'>
                {new Date(
                  selectedAdmission.expectedDischargeDate,
                ).toLocaleDateString()}
              </p>
            </div>

            <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg sm:col-span-2'>
              <p className='text-gray-500 dark:text-gray-400 text-sm'>Diagnosis</p>
              <p className='font-medium text-gray-900 dark:text-white'>{selectedAdmission.diagnosis}</p>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={() => setShowView(false)}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdmissionsViewModal;
