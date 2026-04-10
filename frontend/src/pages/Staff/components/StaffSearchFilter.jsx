import React from 'react';
import SearchBar from '../../../components/SearchBar';

const StaffSearchFilter = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  filterStatus,
  setFilterStatus,
  departments,
}) => {
  return (
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      <SearchBar
        placeholder='Search staff, email, or role...'
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <div className='flex gap-2 flex-wrap'>
        {/* Department Filter */}
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className='border border-gray-100 dark:border-gray-700 px-4 py-2 rounded-2xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
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
          className='border border-gray-100 dark:border-gray-700 px-4 py-2 rounded-2xl text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
          <option value=''>All Status</option>
          <option value='Active'>Active</option>
          <option value='On Leave'>On Leave</option>
          <option value='Inactive'>Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default StaffSearchFilter;
