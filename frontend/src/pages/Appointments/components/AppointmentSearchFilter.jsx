import React from 'react';
import { Icons } from '../../../context/AppContext';

const AppointmentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  showFilterPopover,
  setShowFilterPopover,
  filterRef,
}) => {
  const { Filter, Search } = Icons;
  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(value)) {
        updated[type] = updated[type].filter((v) => v !== value);
      } else {
        updated[type].push(value);
      }
      return updated;
    });
  };

  const resetFilters = () => setFilters({ status: [], type: [] });

  return (
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search appointments...'
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      <div
        ref={filterRef}
        className='relative'>
        <button
          onClick={() => setShowFilterPopover(!showFilterPopover)}
          className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>

        {showFilterPopover && (
          <div className='absolute mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 w-64 z-50'>
            <h4 className='font-semibold mb-2'>Status</h4>
            {['Pending', 'Confirmed', 'Cancelled'].map((status) => (
              <label
                key={status}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.status.includes(status)}
                  onChange={() => toggleFilter('status', status)}
                />
                {status}
              </label>
            ))}

            <h4 className='font-semibold mt-3 mb-2'>Type</h4>
            {['Check-up', 'Follow-up', 'Emergency'].map((type) => (
              <label
                key={type}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.type.includes(type)}
                  onChange={() => toggleFilter('type', type)}
                />
                {type}
              </label>
            ))}

            <div className='flex justify-end gap-2 mt-3'>
              <button
                onClick={resetFilters}
                className='mt-3 w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm'>
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSearchFilter;
