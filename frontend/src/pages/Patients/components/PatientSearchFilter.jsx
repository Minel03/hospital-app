import SearchBar from '../../../components/SearchBar';
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
  const { Filter } = Icons;

  return (
    <div className='flex flex-col md:flex-row md:items-center gap-4'>
      <SearchBar
        placeholder='Search patients by name, ID, or phone...'
        value={searchQuery}
        onChange={setSearchQuery}
      />

      {/* Filter */}
      <div
        className='relative'
        ref={filterRef}>
        <button
          onClick={() => setShowFilterPopover((prev) => !prev)}
          className='flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
          <Filter className='w-5 h-5' /> Filter
        </button>

        {showFilterPopover && (
          <div className='absolute mt-2 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 w-64 z-50'>
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

export default PatientSearchFilter;
