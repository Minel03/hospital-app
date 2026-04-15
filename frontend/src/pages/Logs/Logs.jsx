// pages/Logs/Logs.jsx
import React, { useEffect, useState } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import Title from '../../components/Title';
import PageHeader from '../../components/PageHeader';
import Pagination from '../../components/Pagination';

const ENTITY_COLORS = {
  Admission: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Appointment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  Invoice: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  Patient: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Bed: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
};

const ACTION_ICONS = {
  'Patient Admitted': '🏥',
  'Patient Discharged': '🚪',
  'Appointment Created': '📅',
  'Appointment Cancelled': '❌',
  'Appointment Updated': '✏️',
  'Admission Updated': '✏️',
  'Invoice Created': '🧾',
  'Invoice Paid': '✅',
};

const Logs = () => {
  const { Search } = Icons;
  const { axios } = useAppContext();

  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEntity, setFilterEntity] = useState('All');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchLogs = async () => {
    const { data } = await axios.get('/api/logs/list');
    if (data.success) setLogs(data.logs);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterEntity]);

  const filtered = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      log.patient?.name?.toLowerCase().includes(q) ||
      log.doctor?.name?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q) ||
      log.entity?.toLowerCase().includes(q);

    const matchesEntity = filterEntity === 'All' || log.entity === filterEntity;

    return matchesSearch && matchesEntity;
  });

  return (
    <div className='p-8 space-y-8'>
      {/* Header */}
      <PageHeader
        title='Activity Logs'
        subtitle='Track all system activity and history'
      />

      {/* Stats */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        {['All', 'Admission', 'Appointment', 'Invoice', 'Patient'].map((e) => (
          <button
            key={e}
            onClick={() => setFilterEntity(e)}
            className={`p-5 rounded-2xl border text-sm font-medium transition-all duration-200 ${
              filterEntity === e
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
            }`}>
            <p>{e}</p>
            <p className='text-2xl font-bold mt-1'>
              {e === 'All'
                ? logs.length
                : logs.filter((l) => l.entity === e).length}
            </p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-3 w-5 h-5 text-gray-400' />
        <input
          placeholder='Search by patient, doctor, action...'
          className='w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white pl-10 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Logs Timeline */}
      <div className='space-y-3'>
        {filtered.length === 0 && (
          <div className='text-center py-12 text-gray-400'>No logs found.</div>
        )}
        {filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((log) => (
          <div
            key={log._id}
            className='bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200'>
            {/* Icon */}
            <div className='text-2xl w-10 text-center'>
              {ACTION_ICONS[log.action] || '📋'}
            </div>

            {/* Content */}
            <div className='flex-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <span className='font-semibold text-gray-900 dark:text-white'>
                  {log.action}
                </span>
                <span
                   className={`px-2 py-0.5 text-xs rounded-full font-medium ${ENTITY_COLORS[log.entity] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                   {log.entity}
                </span>
              </div>

              <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>{log.details}</p>

              <div className='flex flex-wrap gap-4 mt-2 text-xs text-gray-400'>
                {log.patient && (
                  <span>
                    👤 <b>Patient:</b> {log.patient.name}
                  </span>
                )}
                {log.doctor && (
                  <span>
                    🩺 <b>Doctor:</b> {log.doctor.name}
                  </span>
                )}
                {log.bed && (
                  <span>
                    🛏️ <b>Bed:</b> {log.bed.bedNumber}
                  </span>
                )}
                <span>🕐 {new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filtered.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          totalItems={filtered.length}
        />
      </div>
    </div>
  );
};

export default Logs;
