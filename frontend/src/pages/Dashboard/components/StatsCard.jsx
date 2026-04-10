import React from 'react';
import { Icons, Charts } from '../../../context/AppContext';
import SummaryStats from '../../../components/SummaryStats';

const { Users, CalendarCheck, Bed, DollarSign, Activity } = Icons;
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
  BarChart,
  Bar,
} = Charts;

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

const StatsCard = ({
  patients = [],
  appointments = [],
  departments = [],
  admissions = [],
  analytics = null,
}) => {
  // Use analytics data for stats if available, fallback to counts
  const totalPatients =
    analytics?.demographics?.reduce((a, b) => a + b.count, 0) ||
    patients.length;
  const activeAdmissionsCount =
    analytics?.beds?.occupied ||
    admissions.filter((a) => a.status === 'Admitted').length;
  const todayAppointmentsCount = appointments.length;

  const stats = [
    {
      id: 1,
      label: 'Total Patients',
      value: totalPatients,
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      label: "Today's Appointments",
      value: todayAppointmentsCount,
      icon: CalendarCheck,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      label: 'Active Admissions',
      value: activeAdmissionsCount,
      icon: Bed,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      id: 4,
      label: 'Total Revenue (Paid)',
      value: `$${analytics?.revenue?.reduce((a, b) => a + b.amount, 0).toLocaleString() || '0'}`,
      icon: DollarSign,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  // Bed data for Pie Chart
  const bedData = analytics
    ? [
        {
          name: 'Available',
          value: analytics.beds.available,
          color: '#10b981',
        },
        { name: 'Occupied', value: analytics.beds.occupied, color: '#ef4444' },
        {
          name: 'Maintenance',
          value: analytics.beds.maintenance,
          color: '#f59e0b',
        },
      ]
    : [];

  // Demographics for Bar Chart
  const demoData = analytics?.demographics || [];

  return (
    <div className='space-y-6'>
      {/* Stats Numbers */}
      <SummaryStats stats={stats} />

      {/* Charts Row 1: Revenue & Bed Occupancy */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Revenue Line Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
          <div className='flex items-center gap-2 mb-6'>
            <DollarSign className='w-5 h-5 text-purple-500' />
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Monthly Revenue Trends
            </h3>
          </div>
          {analytics?.revenue?.length > 0 ? (
            <ResponsiveContainer
              width='100%'
              height={250}>
              <LineChart data={analytics.revenue}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='rgba(156, 163, 175, 0.1)'
                  vertical={false}
                />
                <XAxis
                  dataKey='month'
                  stroke='#9ca3af'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='#9ca3af'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Line
                  type='monotone'
                  dataKey='amount'
                  stroke='#8b5cf6'
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#8b5cf6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className='text-center text-gray-400 py-20'>
              No revenue data available.
            </p>
          )}
        </div>

        {/* Bed Occupancy Pie Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
          <div className='flex items-center gap-2 mb-6'>
            <Bed className='w-5 h-5 text-blue-500' />
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Bed Capacity Status
            </h3>
          </div>
          {bedData.length > 0 ? (
            <div className='flex flex-col md:flex-row items-center'>
              <ResponsiveContainer
                width='100%'
                height={250}>
                <PieChart>
                  <Pie
                    data={bedData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey='value'>
                    {bedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className='w-full md:w-48 space-y-2 mt-4 md:mt-0'>
                {bedData.map((d) => (
                  <div
                    key={d.name}
                    className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: d.color }}></div>
                      <span className='text-gray-500 dark:text-gray-400'>
                        {d.name}
                      </span>
                    </div>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className='text-center text-gray-400 py-20'>
              No bed data available.
            </p>
          )}
        </div>
      </div>

      {/* Charts Row 2: Demographics & Departments */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Patient Demographics Bar Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
          <div className='flex items-center gap-2 mb-6'>
            <Users className='w-5 h-5 text-green-500' />
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Patient Age Distribution
            </h3>
          </div>
          {demoData.length > 0 ? (
            <ResponsiveContainer
              width='100%'
              height={250}>
              <BarChart data={demoData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='rgba(156, 163, 175, 0.1)'
                  vertical={false}
                />
                <XAxis
                  dataKey='range'
                  stroke='#9ca3af'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='#9ca3af'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar
                  dataKey='count'
                  fill='#10b981'
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className='text-center text-gray-400 py-20'>
              No demographic data available.
            </p>
          )}
        </div>

        {/* Department Distribution (Original Chart updated) */}
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
          <div className='flex items-center gap-2 mb-6'>
            <Activity className='w-5 h-5 text-blue-500' />
            <h3 className='font-semibold text-gray-900 dark:text-white'>
              Departmental Patient Load
            </h3>
          </div>
          {analytics?.departments?.length > 0 ? (
            <ResponsiveContainer
              width='100%'
              height={250}>
              <PieChart>
                <Pie
                  data={analytics.departments}
                  cx='50%'
                  cy='50%'
                  label={({ name }) => name}
                  outerRadius={80}
                  dataKey='patients'>
                  {analytics.departments.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className='text-center text-gray-400 py-20'>
              No department data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
