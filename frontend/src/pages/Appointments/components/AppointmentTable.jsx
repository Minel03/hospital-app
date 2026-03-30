import React from 'react';
import { Icons } from '../../../context/AppContext';

const AppointmentTable = ({
  appointments,
  filters,
  searchQuery,
  onEditAppointment,
  onCancelAppointment,
}) => {
  const { Calendar, Clock } = Icons;
  const formatTime12Hour = (time) => {
    if (!time) return '';
    const [hourStr, minute] = time.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      appointment.patient?.name?.toLowerCase().includes(query) ||
      appointment.doctor?.name?.toLowerCase().includes(query) ||
      appointment.department?.toLowerCase().includes(query);

    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(appointment.status);

    const matchesType =
      filters.type.length === 0 || filters.type.includes(appointment.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className='lg:col-span-2 space-y-4'>
      {filteredAppointments.map((appointment) => {
        const today = new Date();
        today.setSeconds(0, 0); // strip seconds and milliseconds

        const apptDateTime = new Date(appointment.date);
        // set the time from appointment.time field
        const [hours, minutes] = appointment.time.split(':');
        apptDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const isFuture = apptDateTime >= today;
        return (
          <div
            key={appointment._id}
            className='bg-white rounded-lg border border-gray-200 p-6'>
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
                    <h3 className='font-semibold text-gray-900'>
                      {appointment.patient?.name}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {appointment.doctor?.name} - {appointment.department}
                    </p>
                  </div>
                </div>

                {/* Date, Time & Type */}
                <div className='flex items-center gap-4 text-sm text-gray-600 mb-2'>
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    {appointment.date?.slice(0, 10)}
                  </div>
                  <div className='flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    {formatTime12Hour(appointment.time)}
                  </div>
                  <span className='px-2 py-1 bg-gray-100 rounded text-xs'>
                    {appointment.type}
                  </span>
                </div>

                {/* Actions */}
                {isFuture && (
                  <div className='flex gap-2'>
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className='px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700'>
                      Edit
                    </button>
                    <button
                      onClick={() => onCancelAppointment(appointment._id)}
                      className='px-3 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700'>
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Status */}
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-700'
                    : appointment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
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
