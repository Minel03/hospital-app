import React from 'react';
import { Icons } from '../../../context/AppContext';

const BedsSearchFilter = ({ searchQuery, setSearchQuery }) => {
  const { Search } = Icons;
  return (
    <div>
      {/* Search */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search by room number, type, floor or department...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>
    </div>
  );
};

export default BedsSearchFilter;
