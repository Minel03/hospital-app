import React from 'react';
import { Icons, Charts, useAppContext } from '../../../context/AppContext';
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
  labOrders = [],
}) => {
  const { userData } = useAppContext();

  // Use analytics data for stats if available, fallback to counts
  const totalPatients =
    analytics?.demographics?.reduce((a, b) => a + b.count, 0) ||
    patients.length;
  const activeAdmissionsCount =
    analytics?.beds?.occupied ||
    admissions.filter((a) => a.status === 'Admitted').length;
  const todayAppointmentsCount = appointments.length;

  // Role-specific stats
  let displayStats = [];

  if (userData.role === 'admin') {
    displayStats = [
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
  } else if (userData.role === 'doctor') {
    displayStats = [
      {
        id: 1,
        label: 'My Appointments Today',
        value: todayAppointmentsCount,
        icon: CalendarCheck,
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        id: 2,
        label: 'Total Patients',
        value: totalPatients,
        icon: Users,
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        id: 3,
        label: 'Active Consultations',
        value: appointments.filter(a => a.status === 'Confirmed').length,
        icon: Activity,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        textColor: 'text-yellow-600 dark:text-yellow-400',
      },
      {
        id: 4,
        label: 'Recent Admissions',
        value: activeAdmissionsCount,
        icon: Bed,
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
    ];
  } else if (userData.role === 'medtech') {
    displayStats = [
      {
        id: 1,
        label: 'Pending Lab Orders',
        value: labOrders.length,
        icon: Icons.FlaskConical,
        bgColor: 'bg-orange-50 dark:bg-orange-900/30',
        textColor: 'text-orange-600 dark:text-orange-400',
      },
      {
        id: 2,
        label: 'Total Tests (Today)',
        value: labOrders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length + 12, // +12 for simulation of completed
        icon: Icons.Activity,
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        id: 3,
        label: 'Critical Results',
        value: 2, // Hardcoded simulation
        icon: Icons.AlertCircle || Icons.Activity,
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        textColor: 'text-red-600 dark:text-red-400',
      },
      {
        id: 4,
        label: 'Equipment Status',
        value: '98%',
        icon: Icons.Settings,
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
    ];
  } else {
    // Staff
    displayStats = [
      {
        id: 1,
        label: 'Active Admissions',
        value: activeAdmissionsCount,
        icon: Bed,
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400',
      },
      {
        id: 2,
        label: 'Bed Availability',
        value: analytics?.beds?.available || 0,
        icon: Activity,
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        textColor: 'text-green-600 dark:text-green-400',
      },
      {
        id: 3,
        label: "Today's Appointments",
        value: todayAppointmentsCount,
        icon: CalendarCheck,
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        textColor: 'text-yellow-600 dark:text-yellow-400',
      },
      {
        id: 4,
        label: 'Total Patients',
        value: totalPatients,
        icon: Users,
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        textColor: 'text-purple-600 dark:text-purple-400',
      },
    ];
  }

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
      <SummaryStats stats={displayStats} />

      {/* Charts Row 1: Revenue & Bed Occupancy */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Revenue Line Chart - Only for Admin */}
        {userData.role === 'admin' ? (
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
        ) : (
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
        )}

        {/* Bed Capacity Status Chart - Hidden for MedTech */}
        {userData.role !== 'medtech' && (
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
        )}

        {/* Lab Productivity Chart - For MedTech and Admin */}
        {(userData.role === 'medtech' || userData.role === 'admin') && (
          <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <Icons.Activity className='w-5 h-5 text-orange-500' />
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Laboratory Load & Productivity
              </h3>
            </div>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={[
                { name: 'Hematology', pending: 5, completed: 12 },
                { name: 'Biochemistry', pending: 8, completed: 20 },
                { name: 'Microbiology', pending: 3, completed: 7 },
                { name: 'Immunology', pending: 2, completed: 5 },
              ]}>
                <CartesianGrid strokeDasharray='3 3' stroke='rgba(156, 163, 175, 0.1)' vertical={false} />
                <XAxis dataKey='name' stroke='#9ca3af' fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke='#9ca3af' fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey='pending' fill='#f59e0b' radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey='completed' fill='#10b981' radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
            <div className='flex justify-center gap-4 mt-4 text-xs font-medium'>
              <div className='flex items-center gap-1 text-orange-600'><div className='w-3 h-3 bg-orange-500 rounded-full'></div> Pending</div>
              <div className='flex items-center gap-1 text-green-600'><div className='w-3 h-3 bg-green-500 rounded-full'></div> Completed</div>
            </div>
          </div>
        )}

        {/* MedTech Specific: Equipment Status Feed - Exclusively for MedTech */}
        {userData.role === 'medtech' && (
          <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <Icons.Settings className='w-5 h-5 text-blue-500' />
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Equipment Status Monitoring
              </h3>
            </div>
            <div className='space-y-4'>
              {[
                { name: 'Auto-Analyzer XL-100', status: 'Optimal', health: 98, color: 'bg-green-500' },
                { name: 'Sysmex Hematology', status: 'Maintenance Due', health: 75, color: 'bg-yellow-500' },
                { name: 'Beckman Centrifuge', status: 'Optimal', health: 100, color: 'bg-green-500' },
                { name: 'PCR Thermal Cycler', status: 'Optimal', health: 92, color: 'bg-green-500' },
              ].map((eq) => (
                <div key={eq.name} className='space-y-1'>
                  <div className='flex justify-between text-sm'>
                    <span className='font-medium text-gray-700 dark:text-gray-300'>{eq.name}</span>
                    <span className='text-xs text-gray-500'>{eq.status}</span>
                  </div>
                  <div className='w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5'>
                    <div className={`${eq.color} h-1.5 rounded-full`} style={{ width: `${eq.health}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts Row 2 - Conditionally show more or hide redundant */}
      {userData.role === 'admin' && (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Patient Demographics Bar Chart (Already moved up for non-admins) */}
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

          {/* Department Distribution */}
          <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm'>
            <div className='flex items-center gap-2 mb-6'>
              <Activity className='w-5 h-5 text-blue-500' />
              <h3 className='font-semibold text-gray-900 dark:text-white'>
                Departmental Patient Load
              </h3>
            </div>
            {analytics?.departments?.length > 0 ? (
              <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                  <Pie
                    data={analytics.departments.filter(d => d.patients > 0)}
                    cx='50%'
                    cy='45%'
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey='patients'
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    stroke='none'
                  >
                    {analytics.departments.filter(d => d.patients > 0).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
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
      )}
    </div>
  );
};

export default StatsCard;
