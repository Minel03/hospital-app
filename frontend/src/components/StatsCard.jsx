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
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 2,
      name: "Today's Appointments",
      value: appointments.length,
      icon: CalendarCheck,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      id: 3,
      name: 'Active Admissions',
      value: activeAdmissions,
      icon: Bed,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
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
              className='bg-white rounded-lg border border-gray-200 p-6 flex items-center gap-4'>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className='text-sm text-gray-500'>{stat.name}</p>
                <p className='text-xl font-semibold text-gray-900'>
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
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>
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
                  stroke='#e5e7eb'
                />
                <XAxis
                  dataKey='month'
                  stroke='#6b7280'
                />
                <YAxis
                  stroke='#6b7280'
                  allowDecimals={false}
                />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='Patients'
                  stroke='#3b82f6'
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Department Distribution Pie Chart */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='font-semibold text-gray-900 mb-4'>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
