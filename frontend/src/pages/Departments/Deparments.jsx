import React from 'react';
import {
  Search,
  Filter,
  Plus,
  Users,
  Stethoscope,
  Activity,
  Phone,
} from 'lucide-react';

const DepartmentsView = () => {
  const departments = [
    {
      id: 1,
      name: 'Emergency',
      head: 'Dr. David Kim',
      doctors: 12,
      nurses: 24,
      patients: 45,
      beds: 30,
      phone: '+1 555-0301',
      status: 'Active',
      description: 'Emergency medical services and critical care',
    },
    {
      id: 2,
      name: 'Cardiology',
      head: 'Dr. Sarah Wilson',
      doctors: 8,
      nurses: 16,
      patients: 32,
      beds: 20,
      phone: '+1 555-0302',
      status: 'Active',
      description: 'Heart and cardiovascular disease treatment',
    },
    {
      id: 3,
      name: 'Neurology',
      head: 'Dr. Michael Brown',
      doctors: 6,
      nurses: 12,
      patients: 28,
      beds: 15,
      phone: '+1 555-0303',
      status: 'Active',
      description: 'Nervous system disorders and brain health',
    },
    {
      id: 4,
      name: 'Pediatrics',
      head: 'Dr. James Lee',
      doctors: 10,
      nurses: 20,
      patients: 56,
      beds: 35,
      phone: '+1 555-0304',
      status: 'Active',
      description: "Children's healthcare and development",
    },
    {
      id: 5,
      name: 'Orthopedics',
      head: 'Dr. Emily Chen',
      doctors: 7,
      nurses: 14,
      patients: 38,
      beds: 25,
      phone: '+1 555-0305',
      status: 'Active',
      description: 'Bone, joint, and musculoskeletal treatment',
    },
    {
      id: 6,
      name: 'Maternity',
      head: 'Dr. Jennifer Taylor',
      doctors: 9,
      nurses: 22,
      patients: 42,
      beds: 28,
      phone: '+1 555-0306',
      status: 'Active',
      description: 'Pregnancy, childbirth, and postpartum care',
    },
    {
      id: 7,
      name: 'Radiology',
      head: 'Dr. Robert Lee',
      doctors: 5,
      nurses: 8,
      patients: 120,
      beds: 0,
      phone: '+1 555-0307',
      status: 'Active',
      description: 'Medical imaging and diagnostic services',
    },
    {
      id: 8,
      name: 'Surgery',
      head: 'Dr. Amanda Rodriguez',
      doctors: 15,
      nurses: 30,
      patients: 24,
      beds: 18,
      phone: '+1 555-0308',
      status: 'Active',
      description: 'General and specialized surgical procedures',
    },
  ];

  const stats = [
    {
      label: 'Total Departments',
      value: '12',
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      label: 'Total Doctors',
      value: '142',
      icon: Stethoscope,
      color: 'bg-green-500',
    },
    {
      label: 'Total Nurses',
      value: '284',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Active Patients',
      value: '385',
      icon: Users,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className='p-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>Departments</h2>
          <p className='text-gray-500 mt-1'>
            Manage hospital departments and their resources
          </p>
        </div>

        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          Add Department
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm text-gray-500 mb-1'>{stat.label}</p>
                  <p className='text-3xl font-semibold text-gray-900'>
                    {stat.value}
                  </p>
                </div>

                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className='w-6 h-6 text-white' />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />

          <input
            type='text'
            placeholder='Search departments...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
        {departments.map((dept) => (
          <div
            key={dept.id}
            className='bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 mb-1'>
                  {dept.name}
                </h3>

                <p className='text-sm text-gray-500'>{dept.description}</p>
              </div>

              <span className='px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700'>
                {dept.status}
              </span>
            </div>

            <div className='mb-4'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Stethoscope className='w-4 h-4' />
                <span className='font-medium'>Head:</span>
                <span>{dept.head}</span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4 mb-4'>
              <div className='bg-blue-50 rounded-lg p-3'>
                <p className='text-xs text-gray-600 mb-1'>Doctors</p>
                <p className='text-2xl font-semibold text-blue-600'>
                  {dept.doctors}
                </p>
              </div>

              <div className='bg-purple-50 rounded-lg p-3'>
                <p className='text-xs text-gray-600 mb-1'>Nurses</p>
                <p className='text-2xl font-semibold text-purple-600'>
                  {dept.nurses}
                </p>
              </div>

              <div className='bg-green-50 rounded-lg p-3'>
                <p className='text-xs text-gray-600 mb-1'>Patients</p>
                <p className='text-2xl font-semibold text-green-600'>
                  {dept.patients}
                </p>
              </div>

              <div className='bg-orange-50 rounded-lg p-3'>
                <p className='text-xs text-gray-600 mb-1'>Beds</p>
                <p className='text-2xl font-semibold text-orange-600'>
                  {dept.beds}
                </p>
              </div>
            </div>

            <div className='pt-4 border-t border-gray-200'>
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <Phone className='w-4 h-4' />
                {dept.phone}
              </div>
            </div>

            <button className='w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition-colors'>
              View Department
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentsView;
