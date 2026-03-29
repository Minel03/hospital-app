import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientViewModal = ({
  showViewModal,
  setShowViewModal,
  selectedPatient,
}) => {
  const { X } = Icons;

  if (!showViewModal || !selectedPatient) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
          <h3 className='text-2xl font-bold text-gray-900'>Patient Details</h3>
          <button
            onClick={() => setShowViewModal(false)}
            className='p-2 hover:bg-gray-100 rounded-full'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Profile */}
        <div className='p-6 space-y-6'>
          <div className='flex items-center gap-4'>
            <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold'>
              {selectedPatient.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>

            <div>
              <h4 className='text-xl font-semibold'>{selectedPatient.name}</h4>
              <p className='text-gray-500'>{selectedPatient.email}</p>
              <p className='text-gray-500'>{selectedPatient.phone}</p>
            </div>
          </div>

          {/* Info */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Age</p>
              <p className='font-medium'>{selectedPatient.age}</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Gender</p>
              <p className='font-medium'>{selectedPatient.gender}</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Blood Type</p>
              <p className='font-medium'>{selectedPatient.bloodType}</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-gray-500 text-sm'>Status</p>
              <p className='font-medium'>{selectedPatient.status}</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
              <p className='text-gray-500 text-sm'>Address</p>
              <p className='font-medium'>{selectedPatient.address}</p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
              <p className='text-gray-500 text-sm'>Allergies</p>
              <p className='font-medium'>
                {selectedPatient.allergies || 'None'}
              </p>
            </div>

            <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
              <p className='text-gray-500 text-sm'>Medical History</p>
              <p className='font-medium'>
                {selectedPatient.medicalHistory || 'No records'}
              </p>
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              onClick={() => setShowViewModal(false)}
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientViewModal;
