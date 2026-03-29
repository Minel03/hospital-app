import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const DoctorHeader = ({ onAddDoctor }) => {
  const { Plus } = Icons;
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Doctors'
            subtitle='Manage medical staff and their schedules'
          />
        </div>
        <button
          onClick={onAddDoctor}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Doctor</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorHeader;
