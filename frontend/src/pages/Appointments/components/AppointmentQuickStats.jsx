import React from 'react';

const AppointmentQuickStats = ({ appointments }) => {
  const today = new Date();

  const countToday = appointments.filter(
    (a) => new Date(a.date).toDateString() === today.toDateString(),
  ).length;

  const countThisWeek = appointments.filter((a) => {
    const appointmentDate = new Date(a.date);
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    return (
      appointmentDate >= firstDayOfWeek && appointmentDate <= lastDayOfWeek
    );
  }).length;

  const countThisMonth = appointments.filter((a) => {
    const appointmentDate = new Date(a.date);
    return (
      appointmentDate.getFullYear() === today.getFullYear() &&
      appointmentDate.getMonth() === today.getMonth()
    );
  }).length;

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 h-fit'>
      <h3 className='font-semibold text-gray-900 mb-4'>Quick Stats</h3>
      <div className='space-y-4'>
        {/* Today */}
        <div className='p-4 bg-blue-50 rounded-lg'>
          <p className='text-sm text-blue-600'>Today</p>
          <p className='text-2xl font-semibold text-blue-900 mt-1'>
            {countToday}
          </p>
          <p className='text-xs text-blue-600 mt-1'>Appointments</p>
        </div>

        {/* This Week */}
        <div className='p-4 bg-green-50 rounded-lg'>
          <p className='text-sm text-green-600'>This Week</p>
          <p className='text-2xl font-semibold text-green-900 mt-1'>
            {countThisWeek}
          </p>
          <p className='text-xs text-green-600 mt-1'>Appointments</p>
        </div>

        {/* This Month */}
        <div className='p-4 bg-purple-50 rounded-lg'>
          <p className='text-sm text-purple-600'>This Month</p>
          <p className='text-2xl font-semibold text-purple-900 mt-1'>
            {countThisMonth}
          </p>
          <p className='text-xs text-purple-600 mt-1'>Appointments</p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentQuickStats;
