import React from 'react';
import { Icons } from '../../../context/AppContext';

const AppointmentTable = ({
  appointments,
  filters,
  searchQuery,
  onEditAppointment,
  onCancelAppointment,
}) => {
  const { Calendar, Edit, X } = Icons;

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

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      appointment.patient?.name?.toLowerCase().includes(query) ||
      appointment.doctor?.name?.toLowerCase().includes(query) ||
      appointment.department?.name?.toLowerCase().includes(query);

    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(appointment.status);

    const matchesType =
      filters.type.length === 0 || filters.type.includes(appointment.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort: nearest upcoming appointment first
  const sortedAppointments = filteredAppointments.sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a.datetime || a.date);
    const dateB = new Date(b.datetime || b.date);

    const isAFuture = dateA >= today && a.status !== 'Cancelled';
    const isBFuture = dateB >= today && b.status !== 'Cancelled';

    // Future appointments first
    if (isAFuture && !isBFuture) return -1;
    if (!isAFuture && isBFuture) return 1;

    // Otherwise, sort by datetime ascending
    return dateA - dateB;
  });

  return (
    <div className='lg:col-span-2 space-y-4'>
      {sortedAppointments.map((appointment) => {
        const today = new Date();
        today.setSeconds(0, 0);

        const apptDateTime = new Date(appointment.datetime || appointment.date);
        const isFuture = apptDateTime >= today;

        return (
          <div
            key={appointment._id}
            className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors'>
            <div className='flex justify-between items-start'>
              <div className='flex-1'>
                {/* Patient Info */}
                <div className='flex items-center gap-3 mb-2'>
                  <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                    <span className='font-medium text-blue-600'>
                      {appointment.patient?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {appointment.patient?.name}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {appointment.doctor?.name} -{' '}
                      {appointment.department?.name}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>{formatDateTime(appointment.datetime)}</span>
                  </div>
                  <span className='px-2 py-1 bg-gray-100 rounded text-xs'>
                    {appointment.type}
                  </span>
                </div>

                {/* Actions */}
                {isFuture && appointment.status !== 'Cancelled' && (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className='flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100'>
                      <Edit className='w-4 h-4 inline mr-1' />
                    </button>
                    <button
                      onClick={() => onCancelAppointment(appointment._id)}
                      className='flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100'>
                      <X className='w-4 h-4 inline mr-1' />
                    </button>
                  </div>
                )}
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                    : appointment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                {appointment.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppointmentTable;
