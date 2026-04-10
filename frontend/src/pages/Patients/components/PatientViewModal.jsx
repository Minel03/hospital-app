import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../../context/AppContext';

const { X, FlaskConical, User, CheckCircle, Bed, CalendarDays, Clock } = Icons;

const TABS = ['Info', 'Lab Reports', 'Admissions'];

const PatientViewModal = ({
  showViewModal,
  setShowViewModal,
  selectedPatient,
}) => {
  const { axios } = useAppContext();
  const [activeTab, setActiveTab] = useState('Info');
  const [labReports, setLabReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [admissions, setAdmissions] = useState([]);
  const [loadingAdmissions, setLoadingAdmissions] = useState(false);

  useEffect(() => {
    if (showViewModal && selectedPatient) {
      if (activeTab === 'Lab Reports') fetchLabReports();
      if (activeTab === 'Admissions') fetchAdmissions();
    }
  }, [showViewModal, selectedPatient, activeTab]);

  const fetchLabReports = async () => {
    setLoadingReports(true);
    try {
      const res = await axios.get(`/api/lab/patient/reports?patientId=${selectedPatient._id}`);
      if (res.data.success) setLabReports(res.data.reports);
    } catch (err) {
      console.error('Failed to fetch lab reports', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchAdmissions = async () => {
    setLoadingAdmissions(true);
    try {
      const res = await axios.get(`/api/admission/patient?patientId=${selectedPatient._id}`);
      if (res.data.success) setAdmissions(res.data.admissions);
    } catch (err) {
      console.error('Failed to fetch admissions', err);
    } finally {
      setLoadingAdmissions(false);
    }
  };

  if (!showViewModal || !selectedPatient) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl dark:border dark:border-gray-700'>
        {/* Header */}
        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold'>
              {selectedPatient.name?.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>{selectedPatient.name}</h3>
              <p className='text-sm text-gray-500 dark:text-gray-400'>{selectedPatient.email}</p>
            </div>
          </div>
          <button
            onClick={() => { setShowViewModal(false); setActiveTab('Info'); setAdmissions([]); setLabReports([]); }}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'>
            <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Tabs */}
        <div className='flex gap-1 p-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-[89px] z-10'>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}>
              {tab === 'Lab Reports' && <FlaskConical className='w-4 h-4' />}
              {tab === 'Info' && <User className='w-4 h-4' />}
              {tab === 'Admissions' && <Bed className='w-4 h-4' />}
              {tab}
            </button>
          ))}
        </div>

        <div className='p-6'>
          {/* --- INFO TAB --- */}
          {activeTab === 'Info' && (
            <div className='space-y-4'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {[
                  { label: 'Age', value: selectedPatient.age },
                  { label: 'Gender', value: selectedPatient.gender },
                  { label: 'Blood Type', value: selectedPatient.bloodType },
                  { label: 'Status', value: selectedPatient.status },
                  { label: 'Phone', value: selectedPatient.phone },
                ].map((item) => (
                  <div key={item.label} className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl'>
                    <p className='text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1'>{item.label}</p>
                    <p className='font-medium text-gray-900 dark:text-white'>{item.value || '—'}</p>
                  </div>
                ))}
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl sm:col-span-2'>
                  <p className='text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1'>Address</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{selectedPatient.address || '—'}</p>
                </div>
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl sm:col-span-2'>
                  <p className='text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1'>Allergies</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{selectedPatient.allergies || 'None'}</p>
                </div>
                <div className='bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl sm:col-span-2'>
                  <p className='text-gray-400 dark:text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1'>Medical History</p>
                  <p className='font-medium text-gray-900 dark:text-white'>{selectedPatient.medicalHistory || 'No records'}</p>
                </div>
              </div>
            </div>
          )}

          {/* --- LAB REPORTS TAB --- */}
          {activeTab === 'Lab Reports' && (
            <div className='space-y-4'>
              {loadingReports ? (
                <div className='py-12 text-center text-gray-400'>
                  <FlaskConical className='w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse' />
                  <p>Loading lab reports...</p>
                </div>
              ) : labReports.length === 0 ? (
                <div className='py-12 text-center text-gray-400'>
                  <FlaskConical className='w-10 h-10 mx-auto mb-3 opacity-20' />
                  <p className='font-medium'>No completed lab reports for this patient.</p>
                </div>
              ) : (
                labReports.map((report) => (
                  <div
                    key={report._id}
                    className='bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3'>
                    {/* Report Header */}
                    <div className='flex items-start justify-between gap-2'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center'>
                          <FlaskConical className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                        </div>
                        <div>
                          <p className='font-bold text-gray-900 dark:text-white'>{report.test?.name}</p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{report.test?.category}</p>
                        </div>
                      </div>
                      <span className='flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full'>
                        <CheckCircle className='w-3 h-3' />
                        Completed
                      </span>
                    </div>

                    {/* Result Value vs Normal Range */}
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                        <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5'>Result</p>
                        <p className='font-bold text-gray-900 dark:text-white'>{report.resultValue}</p>
                      </div>
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                        <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5'>Normal Range</p>
                        <p className='font-bold text-gray-900 dark:text-white'>{report.normalRangeSnapshot || '—'}</p>
                      </div>
                    </div>

                    {/* Findings */}
                    {report.findings && (
                      <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                        <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1'>Findings</p>
                        <p className='text-sm text-gray-700 dark:text-gray-300'>{report.findings}</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className='flex justify-between text-xs text-gray-400 dark:text-gray-500 pt-1'>
                      <span>🩺 Dr. {report.doctor?.name || '—'}</span>
                      <span>🕐 {new Date(report.completedAt || report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- ADMISSIONS TAB --- */}
          {activeTab === 'Admissions' && (
            <div className='space-y-4'>
              {loadingAdmissions ? (
                <div className='py-12 text-center text-gray-400'>
                  <Bed className='w-10 h-10 mx-auto mb-3 opacity-30 animate-pulse' />
                  <p>Loading admission history...</p>
                </div>
              ) : admissions.length === 0 ? (
                <div className='py-12 text-center text-gray-400'>
                  <Bed className='w-10 h-10 mx-auto mb-3 opacity-20' />
                  <p className='font-medium'>No admission records for this patient.</p>
                </div>
              ) : (
                admissions.map((adm) => {
                  const isActive = adm.status === 'Admitted';
                  return (
                    <div key={adm._id} className='bg-gray-50 dark:bg-gray-700/40 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3'>
                      {/* Header */}
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-green-100 dark:bg-green-900/40' : 'bg-gray-200 dark:bg-gray-600/40'}`}>
                            <Bed className={`w-5 h-5 ${isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
                          </div>
                          <div>
                            <p className='font-bold text-gray-900 dark:text-white'>
                              Room {adm.bed?.room?.roomNumber || '—'} — Bed {adm.bed?.bedNumber || '—'}
                            </p>
                            <p className='text-xs text-gray-500'>{adm.bed?.room?.roomType || '—'}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          isActive
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {adm.status}
                        </span>
                      </div>

                      {/* Dates grid */}
                      <div className='grid grid-cols-2 gap-3'>
                        <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                          <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5'>Admitted</p>
                          <p className='font-semibold text-gray-900 dark:text-white text-sm'>
                            {adm.admissionDate ? new Date(adm.admissionDate).toLocaleDateString() : '—'}
                          </p>
                        </div>
                        <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                          <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5'>
                            {adm.status === 'Discharged' ? 'Discharged' : 'Expected Discharge'}
                          </p>
                          <p className='font-semibold text-gray-900 dark:text-white text-sm'>
                            {(adm.dischargeDate || adm.expectedDischargeDate)
                              ? new Date(adm.dischargeDate || adm.expectedDischargeDate).toLocaleDateString()
                              : '—'}
                          </p>
                        </div>
                      </div>

                      {/* Diagnosis + Doctor */}
                      {adm.diagnosis && (
                        <div className='bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700'>
                          <p className='text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1'>Diagnosis</p>
                          <p className='text-sm text-gray-700 dark:text-gray-300'>{adm.diagnosis}</p>
                        </div>
                      )}

                      <div className='flex justify-between text-xs text-gray-400 dark:text-gray-500 pt-1'>
                        <span>🩺 Dr. {adm.doctor?.name || '—'}</span>
                        <span>🏥 {adm.department?.name || '—'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          <div className='flex justify-end pt-4'>
            <button
              onClick={() => { setShowViewModal(false); setActiveTab('Info'); setAdmissions([]); setLabReports([]); }}
              className='px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none'>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientViewModal;
