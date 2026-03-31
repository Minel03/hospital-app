import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientSearchFilter = ({
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
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      {/* Search */}
      <div className='flex-1 relative'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
        <input
          type='text'
          placeholder='Search patients by name, ID, or phone...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* Filter */}
      <div
        className='relative'
        ref={filterRef}>
        <button
          onClick={() => setShowFilterPopover((prev) => !prev)}
          className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' /> Filter
        </button>

        {showFilterPopover && (
          <div className='absolute mt-2 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64 z-50'>
            {/* Gender */}
            <h4 className='font-semibold mb-2'>Gender</h4>
            {['Male', 'Female', 'Other'].map((g) => (
              <label
                key={g}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.gender.includes(g)}
                  onChange={() => toggleFilter('gender', g)}
                  className='h-4 w-4'
                />
                {g}
              </label>
            ))}

            {/* Blood Type */}
            <h4 className='font-semibold mt-3 mb-2'>Blood Type</h4>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
              <label
                key={bt}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.bloodType.includes(bt)}
                  onChange={() => toggleFilter('bloodType', bt)}
                  className='h-4 w-4'
                />
                {bt}
              </label>
            ))}

            {/* Status */}
            <h4 className='font-semibold mt-3 mb-2'>Status</h4>
            {['Active', 'Inactive'].map((s) => (
              <label
                key={s}
                className='flex items-center gap-2 mb-1'>
                <input
                  type='checkbox'
                  checked={filters.status.includes(s)}
                  onChange={() => toggleFilter('status', s)}
                  className='h-4 w-4'
                />
                {s}
              </label>
            ))}

            {/* Reset Button */}
            <div className='flex justify-end gap-2 mt-3'>
              <button
                onClick={resetFilters}
                className='w-full bg-gray-100 text-gray-700 py-1 rounded-lg hover:bg-gray-200 text-sm'>
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSearchFilter;
