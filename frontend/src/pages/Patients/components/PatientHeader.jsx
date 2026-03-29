import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const PatientHeader = ({ onAddPatient }) => {
  const { Plus } = Icons;

  return (
    <div className='flex items-center justify-between'>
      <Title
        title='Patients'
        subtitle='Manage and view all patient records'
      />

      <button
        onClick={onAddPatient}
        className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
        <Plus className='w-5 h-5' />
        <span className='hidden sm:inline'>Add Patient</span>
      </button>
    </div>
  );
};

export default PatientHeader;
