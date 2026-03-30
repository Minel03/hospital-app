import React from 'react';
import Title from '../../components/Title';
import StatsCard from '../../components/StatsCard';
import {
  patientData,
  departmentData,
  recentAppointments,
} from '../../data/dummyData';
import { Icons, Charts } from '../../context/AppContext';

// Destructure icons and charts
const { Clock } = Icons;
const {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} = Charts;

const Dashboard = () => {
  return (
    <div className='p-8 space-y-6'>
      <Title
        title='Dashboard'
        subtitle="Welcome back! Here's what's happening today."
      />
      <StatsCard />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Patient Admissions Chart */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>
            Patient Admissions
          </h3>
          <ResponsiveContainer
            width='100%'
            height={250}>
            <LineChart data={patientData}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#e5e7eb'
              />
              <XAxis
                dataKey='month'
                stroke='#6b7280'
              />
              <YAxis stroke='#6b7280' />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='patients'
                stroke='#3b82f6'
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>
            Department Distribution
          </h3>
          <ResponsiveContainer
            width='100%'
            height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx='50%'
                cy='50%'
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'>
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Appointments Table */}
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <h3 className='font-semibold text-gray-900'>Today's Appointments</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Doctor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3'>
                        <span className='text-sm font-medium text-gray-600'>
                          {appointment.patient
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <span className='text-sm text-gray-900'>
                        {appointment.patient}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {appointment.doctor}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center gap-1 text-sm text-gray-500'>
                      <Clock className='w-4 h-4' />
                      {appointment.time}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        appointment.status === 'Confirmed'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
