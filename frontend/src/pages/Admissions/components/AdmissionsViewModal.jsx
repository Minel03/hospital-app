import React from 'react';
import { Icons } from '../../../context/AppContext';

const AdmissionsViewModal = ({ showView, setShowView, selectedAdmission }) => {
  const { X } = Icons;
  return (
    <div>
      {showView && selectedAdmission && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl'>
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-2xl font-bold text-gray-900'>
                Admission Details
              </h3>
              <button
                onClick={() => setShowView(false)}
                className='p-2 hover:bg-gray-100 rounded-full'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <div className='p-6 space-y-6'>
              {/* Profile */}
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold'>
                  {selectedAdmission.patient?.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className='text-xl font-semibold'>
                    {selectedAdmission.patient?.name}
                  </h4>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      selectedAdmission.status === 'Admitted'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                    {selectedAdmission.status}
                  </span>
                </div>
              </div>

              {/* Info Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Doctor</p>
                  <p className='font-medium'>
                    {selectedAdmission.doctor?.name}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Department</p>
                  <p className='font-medium'>
                    {selectedAdmission.department?.name}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Room / Bed</p>
                  <p className='font-medium'>
                    {selectedAdmission.bed?.room?.roomNumber}-
                    {selectedAdmission.bed?.bedNumber}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Admission Date</p>
                  <p className='font-medium'>
                    {new Date(
                      selectedAdmission.admissionDate,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
                  <p className='text-gray-500 text-sm'>Expected Discharge</p>
                  <p className='font-medium'>
                    {new Date(
                      selectedAdmission.expectedDischargeDate,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
                  <p className='text-gray-500 text-sm'>Diagnosis</p>
                  <p className='font-medium'>{selectedAdmission.diagnosis}</p>
                </div>
              </div>

              <div className='flex justify-end'>
                <button
                  onClick={() => setShowView(false)}
                  className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsViewModal;
