import React from 'react';
import { Icons } from '../../../context/AppContext';

const DepartmentSearchFilter = ({
  searchQuery,
  setSearchQuery,
  filters,
  toggleFilter,
  resetFilters,
  showFilterPopover,
  setShowFilterPopover,
  filterRef,
}) => {
  const { Search, Filter } = Icons;

  return (
    <div className='flex items-center gap-4'>
      {/* Search input */}
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Search departments...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* Filter popover */}
      <div
        className='relative'
        ref={filterRef}>
        <button
          onClick={() => setShowFilterPopover(!showFilterPopover)}
          className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>

        {showFilterPopover && (
          <div className='absolute mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 w-48 z-50'>
            {/* Status */}
            <h4 className='font-semibold mb-2'>Status</h4>
            {['Active', 'Inactive'].map((status) => (
              <label
                key={status}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.status.includes(status)}
                  onChange={() => toggleFilter('status', status)}
                  className='h-4 w-4'
                />
                <span className='text-sm text-gray-600'>{status}</span>
              </label>
            ))}

            {/* Reset Button */}
            <div className='flex justify-end mt-3'>
              <button
                onClick={resetFilters}
                className='w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm'>
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentSearchFilter;
