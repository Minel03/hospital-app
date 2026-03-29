import { Icons } from '../../context/AppContext';
import { statsDepartment, departments } from '../../data/dummyData';

const Departments = () => {
  const { Search, Filter, Plus, Stethoscope, Phone } = Icons;

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
        {statsDepartment.map((statDepartment, index) => {
          const Icon = statDepartment.icon;
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

export default Departments;
