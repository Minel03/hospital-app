import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import StatsCard from './components/StatsCard';
import { Icons, useAppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { Clock } = Icons;
  const { axios, userData } = useAppContext();

  const [patients, setPatients] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [labOrders, setLabOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Define which roles can fetch what
      const canSeePatients = ['admin', 'doctor', 'nurse', 'receptionist', 'medtech'].includes(userData.role);
      const canSeeDepts = ['admin'].includes(userData.role);
      const canSeeAppointments = ['admin', 'doctor', 'nurse', 'receptionist', 'accountant'].includes(userData.role);
      const canSeeAdmissions = ['admin', 'doctor', 'nurse', 'receptionist', 'accountant'].includes(userData.role);
      const canSeeAnalytics = ['admin', 'doctor', 'accountant', 'receptionist', 'pharmacist', 'nurse', 'medtech'].includes(userData.role);
      const isMedtech = userData.role === 'medtech';

      const [
        patientsRes,
        departmentsRes,
        appointmentsRes,
        admissionsRes,
        analyticsRes,
        labOrdersRes,
      ] = await Promise.all([
        canSeePatients ? axios.get('/api/patient/all') : Promise.resolve({ data: { patients: [] } }),
        canSeeDepts ? axios.get('/api/department/list') : Promise.resolve({ data: { departments: [] } }),
        canSeeAppointments ? axios.get('/api/appointment/list') : Promise.resolve({ data: { appointments: [] } }),
        canSeeAdmissions ? axios.get('/api/admission/list') : Promise.resolve({ data: { admissions: [] } }),
        canSeeAnalytics ? axios.get('/api/analytics/dashboard-summary') : Promise.resolve({ data: { data: null } }),
        isMedtech ? axios.get('/api/lab/orders/pending') : Promise.resolve({ data: { orders: [] } }),
      ]);

      setPatients(patientsRes.data.patients || []);
      setDepartments(departmentsRes.data.departments || []);
      setAppointments(appointmentsRes.data.appointments || []);
      setAdmissions(admissionsRes.data.admissions || []);
      setAnalytics(analyticsRes.data.data || null);
      setLabOrders(labOrdersRes.data.orders || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData.role) {
      fetchData();
    }
  }, [userData.role]);

  // Filter appointments to today only
  const todaysAppointments = appointments.filter((a) => {
    if (!a.datetime) return false;
    const isToday =
      new Date(a.datetime).toDateString() === new Date().toDateString();

    if (userData.role === 'doctor') {
      // If doctor, only show their own appointments
      return isToday && a.doctor?._id === userData.id;
    }

    return isToday;
  });

  if (loading)
    return <div className='p-8 text-gray-500'>Loading dashboard...</div>;

  return (
    <div className='p-8 space-y-6'>
      <Title
        title={userData.role === 'medtech' ? 'MedTech Dashboard' : `${userData.role.charAt(0).toUpperCase() + userData.role.slice(1)} Dashboard`}
        subtitle={`Welcome back, ${userData.name}! Here's what's happening today.`}
      />

      {/* StatsCard handles both the stat numbers AND the charts */}
      <StatsCard
        patients={patients}
        appointments={todaysAppointments}
        departments={departments}
        admissions={admissions}
        analytics={analytics}
        labOrders={labOrders}
      />

      {/* Conditional Rendering of bottom table */}
      {userData.role === 'medtech' ? (
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>Recent Pending Lab Orders</h3>
          </div>
          <div className='overflow-x-auto'>
            {labOrders.length === 0 ? (
              <p className='p-6 text-sm text-gray-400'>No pending lab orders.</p>
            ) : (
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Patient</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Test</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Date Ordered</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Status</th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {labOrders.slice(0, 10).map((order) => (
                    <tr key={order._id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200'>
                        {order.patient?.name || 'Unknown'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200'>
                        {order.test?.name || 'N/A'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className='px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        /* Today's Appointments Table (Existing) */
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              {userData.role === 'doctor'
                ? 'My Appointments Today'
                : "Today's Appointments"}
            </h3>
          </div>
          <div className='overflow-x-auto'>
            {todaysAppointments.length === 0 ? (
              <p className='p-6 text-sm text-gray-400'>No appointments today.</p>
            ) : (
              <table className='w-full'>
                <thead className='bg-gray-50 dark:bg-gray-900/50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Patient</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Doctor</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Time</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>Status</th>
                  </tr>
                </thead>
                <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                  {todaysAppointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3'>
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-300'>
                              {appointment.patient?.name?.split(' ').map((n) => n[0]).join('')}
                            </span>
                          </div>
                          <span className='text-sm text-gray-900 dark:text-gray-200'>{appointment.patient?.name || '—'}</span>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200'>{appointment.doctor?.name || '—'}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400'>
                          <Clock className='w-4 h-4' />
                          {new Date(appointment.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>{appointment.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
