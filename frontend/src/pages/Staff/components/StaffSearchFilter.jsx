import React from 'react';
import { Icons } from '../../../context/AppContext';

const StaffSearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  departments,
}) => {
  const { Search } = Icons;
  return (
    <div>
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        {/* Search */}
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search staff, email, or role...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex gap-2 flex-wrap'>
          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className='border border-gray-300 px-3 py-2 rounded-lg text-sm'>
            <option value=''>All Departments</option>
            {departments.map((d) => (
              <option
                key={d._id}
                value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='border border-gray-300 px-3 py-2 rounded-lg text-sm'>
            <option value=''>All Status</option>
            <option value='Active'>Active</option>
            <option value='On Leave'>On Leave</option>
            <option value='Inactive'>Inactive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StaffSearchFilter;
