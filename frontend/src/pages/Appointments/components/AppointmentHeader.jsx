import React from 'react';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const AppointmentHeader = ({ onAddAppointment }) => {
  const { Plus } = Icons;
  return (
    <div>
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Appointments'
            subtitle='Schedule and manage patient appointments'
          />
        </div>
        <button
          onClick={onAddAppointment}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>New Appointment</span>
        </button>
      </div>
    </div>
  );
};

export default AppointmentHeader;
