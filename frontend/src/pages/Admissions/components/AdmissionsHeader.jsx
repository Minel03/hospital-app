import SummaryStats from '../../../components/SummaryStats';
import Title from '../../../components/Title';
import { Icons } from '../../../context/AppContext';

const AdmissionsHeader = ({ openAddModal, stats }) => {
  const { Plus } = Icons;
  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <Title
          title='Admissions'
          subtitle='Manage patient admissions and discharges'
        />
        <button
          onClick={openAddModal}
          className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
          <Plus className='w-5 h-5' />
          <span>New Admission</span>
        </button>
      </div>

      <SummaryStats stats={stats} />
    </div>
  );
};

export default AdmissionsHeader;
