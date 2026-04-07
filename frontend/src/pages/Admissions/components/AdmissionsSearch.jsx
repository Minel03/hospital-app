import React from 'react';
import { Icons } from '../../../context/AppContext';

const AdmissionsSearch = ({ searchQuery, setSearchQuery }) => {
  const { Search } = Icons;
  return (
    <div>
      <div className='relative'>
        <Search className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
        <input
          placeholder='Search by patient, doctor, department, bed, diagnosis, status...'
          className='w-full border pl-10 p-2 rounded-lg'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AdmissionsSearch;
