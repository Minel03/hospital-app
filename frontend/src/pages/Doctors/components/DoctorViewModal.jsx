import React from 'react';
import { Icons } from '../../../context/AppContext';

const DoctorViewModal = ({
  showViewModal,
  setShowViewModal,
  selectedDoctor,
}) => {
  const { Star, Phone, Mail } = Icons;

  if (!showViewModal || !selectedDoctor) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-md p-6 space-y-4'>
        <h2 className='text-xl font-semibold'>Doctor Details</h2>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Name:</span>
            <span>{selectedDoctor.name}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Specialty:</span>
            <span>{selectedDoctor.specialty}</span>
          </div>
          {selectedDoctor.department && (
            <div className='flex items-center justify-between'>
              <span className='font-medium'>Department:</span>
              <span>{selectedDoctor.department.name}</span>
            </div>
          )}
          <div className='flex items-center justify-between'>
            <span className='font-medium'>Experience:</span>
            <span>{selectedDoctor.experience} years</span>
          </div>
          <div className='flex items-center gap-2'>
            <Phone className='w-3 h-3' /> {selectedDoctor.phone}
          </div>
          <div className='flex items-center gap-2'>
            <Mail className='w-3 h-3' /> {selectedDoctor.email}
          </div>
          <div className='flex items-center gap-1'>
            <Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
            <span>{selectedDoctor.rating}</span>
            <span className='text-gray-500'>
              ({selectedDoctor.patients} patients)
            </span>
          </div>
        </div>

        <div className='flex justify-end mt-4'>
          <button
            onClick={() => setShowViewModal(false)}
            className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorViewModal;
