import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import StatsCard from './components/StatsCard';
import { Icons, useAppContext } from '../../context/AppContext';

const { Clock } = Icons;

const Dashboard = () => {
  const { axios } = useAppContext();

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        patientsRes,
        departmentsRes,
        appointmentsRes,
        admissionsRes,
        analyticsRes,
      ] = await Promise.all([
        axios.get('/api/patient/all'),
        axios.get('/api/department/list'),
        axios.get('/api/appointment/list'),
        axios.get('/api/admission/list'),
        axios.get('/api/analytics/dashboard-summary'),
      ]);

      setPatients(patientsRes.data.patients || []);
      setDepartments(departmentsRes.data.departments || []);
      setAppointments(appointmentsRes.data.appointments || []);
      setAdmissions(admissionsRes.data.admissions || []);
      setAnalytics(analyticsRes.data.data || null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter appointments to today only
  const todaysAppointments = appointments.filter((a) => {
    if (!a.datetime) return false;
    return new Date(a.datetime).toDateString() === new Date().toDateString();
  });

  if (loading)
    return <div className='p-8 text-gray-500'>Loading dashboard...</div>;

  return (
    <div className='p-8 space-y-6'>
      <Title
        title='Dashboard'
        subtitle="Welcome back! Here's what's happening today."
      />

      {/* StatsCard handles both the stat numbers AND the charts */}
      <StatsCard
        patients={patients}
        appointments={todaysAppointments}
        departments={departments}
        admissions={admissions}
        analytics={analytics}
      />

      {/* Today's Appointments Table */}
      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors'>
        <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-white'>
            Today's Appointments
          </h3>
        </div>

        <div className='overflow-x-auto'>
          {todaysAppointments.length === 0 ? (
            <p className='p-6 text-sm text-gray-400'>No appointments today.</p>
          ) : (
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-gray-900/50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Patient
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Doctor
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Time
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {todaysAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3'>
                          <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                            {appointment.patient?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <span className='text-sm text-gray-900 dark:text-gray-200'>
                          {appointment.patient?.name || '—'}
                        </span>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200'>
                      {appointment.doctor?.name || '—'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                        <Clock className='w-4 h-4' />
                        {new Date(appointment.datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'Confirmed'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                            : appointment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                        }`}>
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
