import React from 'react';
import Title from '../Title';
import { Icons } from '../../context/AppContext';

const PatientHeader = () => {
  const { Plus } = Icons;
  return (
    <div>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <Title
          title='Patients'
          subtitle='Manage and view all patient records'
        />
        <button
          onClick={() => {
            setMode('add');
            setFormData({
              name: '',
              age: '',
              gender: 'Male',
              phone: '',
              email: '',
              address: '',
              bloodType: 'A+',
              allergies: '',
              medicalHistory: '',
            });
            setShowModal(true);
          }}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Patient</span>
        </button>
      </div>
    </div>
  );
};

export default PatientHeader;
