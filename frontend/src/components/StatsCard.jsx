import React from 'react';
import { Icons, Charts } from '../context/AppContext';

const { Users, CalendarCheck, Bed } = Icons;
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

const FALLBACK_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

const StatsCard = ({
  patients = [],
  appointments = [],
  departments = [],
  admissions = [],
}) => {
  // Active admissions from patients array
  const activeAdmissions = admissions.filter(
    (a) => a.status === 'Admitted',
  ).length;

  const stats = [
    {
      id: 1,
      name: 'Total Patients',
      value: patients.length,
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      name: "Today's Appointments",
      value: appointments.length,
      icon: CalendarCheck,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      name: 'Active Admissions',
      value: activeAdmissions,
      icon: Bed,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
  ];

  // LineChart: Patient Admissions by Month
  const patientData = [];
  patients.forEach((p) => {
    const date = p.admissionDate || p.createdAt;
    if (!date) return;
    const month = new Date(date).toLocaleString('default', { month: 'short' });
    const existing = patientData.find((d) => d.month === month);
    if (existing) existing.Patients += 1;
    else patientData.push({ month, Patients: 1 });
  });

  const monthOrder = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  patientData.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month),
  );

  const departmentData = departments.map((dep, index) => ({
    name: dep.name,
    value: dep.patients || 0,
    color: dep.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  }));

  return (
    <div className='space-y-6'>
      {/* Stats Numbers */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex items-center gap-4 transition-colors'>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className='text-sm text-gray-500 dark:text-gray-400'>{stat.name}</p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Patient Admissions Line Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors'>
          <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
            Patient Admissions
          </h3>
          {patientData.length === 0 ? (
            <p className='text-sm text-gray-400 h-62.5 flex items-center justify-center'>
              No admission data available.
            </p>
          ) : (
            <ResponsiveContainer
              width='100%'
              height={250}>
              <LineChart data={patientData}>
                <CartesianGrid
                  strokeDasharray='3 3'
                  stroke='var(--chart-grid)'
                />
                <XAxis
                  dataKey='month'
                  stroke='var(--chart-axis)'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke='var(--chart-axis)'
                  allowDecimals={false}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--chart-axis)'
                  }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line
                  type='monotone'
                  dataKey='Patients'
                  stroke='#3b82f6'
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--chart-tooltip-bg)' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Department Distribution Pie Chart */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors'>
          <h3 className='font-semibold text-gray-900 dark:text-white mb-4'>
            Department Distribution
          </h3>
          {departmentData.every((d) => d.value === 0) ? (
            <p className='text-sm text-gray-400 h-62.5 flex items-center justify-center'>
              No patient data available yet.
            </p>
          ) : (
            <ResponsiveContainer
              width='100%'
              height={250}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  dataKey='value'
                  stroke='var(--chart-tooltip-bg)'
                  strokeWidth={2}>
                  {departmentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--chart-tooltip-bg)', 
                    borderColor: 'var(--chart-tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
