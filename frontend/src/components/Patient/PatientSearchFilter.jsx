import React from 'react';
import { Icons } from '../../context/AppContext';

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
          <div className='absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 space-y-4'>
            {/* Gender */}
            <div>
              <p className='text-sm font-semibold mb-1'>Gender</p>
              {['Male', 'Female', 'Other'].map((g) => (
                <label
                  key={g}
                  className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={filters.gender.includes(g)}
                    onChange={() => toggleFilter('gender', g)}
                    className='h-4 w-4'
                  />
                  {g}
                </label>
              ))}
            </div>

            {/* Blood Type */}
            <div>
              <p className='text-sm font-semibold mb-1'>Blood Type</p>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                <label
                  key={bt}
                  className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={filters.bloodType.includes(bt)}
                    onChange={() => toggleFilter('bloodType', bt)}
                    className='h-4 w-4'
                  />
                  {bt}
                </label>
              ))}
            </div>

            {/* Status */}
            <div>
              <p className='text-sm font-semibold mb-1'>Status</p>
              {['Active', 'Inactive'].map((s) => (
                <label
                  key={s}
                  className='flex items-center gap-2 text-sm'>
                  <input
                    type='checkbox'
                    checked={filters.status.includes(s)}
                    onChange={() => toggleFilter('status', s)}
                    className='h-4 w-4'
                  />
                  {s}
                </label>
              ))}
            </div>

            <button
              onClick={resetFilters}
              className='w-full text-center text-sm text-blue-600 hover:underline mt-2'>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSearchFilter;
