import SearchBar from '../../../components/SearchBar';

const BedsSearchFilter = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className='w-full'>
      <SearchBar
        placeholder='Search by room number, type, floor or department...'
        value={searchQuery}
        onChange={setSearchQuery}
      />
    </div>
  );
};

export default BedsSearchFilter;
