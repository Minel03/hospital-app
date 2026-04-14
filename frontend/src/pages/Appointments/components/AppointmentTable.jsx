import React from 'react';
import { Icons } from '../../../context/AppContext';

const AppointmentTable = ({
  appointments,
  onEditAppointment,
  onCancelAppointment,
  userData,
}) => {
  const { Calendar, Edit, X } = Icons;

  const canManage = ['admin', 'doctor', 'nurse', 'receptionist'].includes(userData?.role);

  // Format datetime to MM/DD/YYYY hh:mm AM/PM
  const formatDateTime = (datetime) => {
    if (!datetime) return '';
    return new Date(datetime).toLocaleString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <>
      {appointments.map((appointment) => {
        const today = new Date();
        today.setSeconds(0, 0);

        const apptDateTime = new Date(appointment.datetime || appointment.date);
        const isFuture = apptDateTime >= today;

        return (
          <div
            key={appointment._id}
            className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow relative'>
            
            {/* Status Badge - Top Right */}
            <div className='absolute top-6 right-6'>
              <span
                className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : appointment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                {appointment.status}
              </span>
            </div>

            {/* Patient Info */}
            <div className='flex items-center gap-4 mb-6 pt-2'>
              <div className='w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/50 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800'>
                <span className='font-bold text-blue-600 dark:text-blue-400'>
                  {appointment.patient?.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className='overflow-hidden'>
                <h3 className='font-bold text-gray-900 dark:text-white truncate'>
                  {appointment.patient?.name}
                </h3>
                <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                  Dr. {appointment.doctor?.name}
                </p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className='space-y-3 mb-6'>
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <Calendar className='w-4 h-4 text-blue-500' />
                <span className='font-medium'>{formatDateTime(appointment.datetime)}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold'>
                  {appointment.type}
                </span>
                <span className='text-xs text-gray-400 dark:text-gray-500'>
                  {appointment.department?.name}
                </span>
              </div>
            </div>

            {/* Actions */}
            {isFuture && appointment.status !== 'Cancelled' && canManage ? (
              <div className='grid grid-cols-2 gap-3 pt-4 border-t border-gray-50 dark:border-gray-700/50'>
                <button
                  onClick={() => onEditAppointment(appointment)}
                  className='flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all font-medium text-sm'>
                  <Edit className='w-4 h-4' />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onCancelAppointment(appointment._id)}
                  className='flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all font-medium text-sm'>
                  <X className='w-4 h-4' />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <div className='pt-4 border-t border-gray-50 dark:border-gray-700/50 text-center'>
                 <p className='text-xs text-gray-400 italic font-medium'>
                   {appointment.status === 'Cancelled' ? 'Appointment Cancelled' : !isFuture ? 'Appointment Passed' : 'No management access'}
                 </p>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default AppointmentTable;
