import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, X, ClipboardList } from 'lucide-react';

const Admissions = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [admissions, setAdmissions] = useState([
    {
      id: 1,
      patient: 'John Smith',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      roomNumber: '301',
      bedNumber: 'A',
      admissionDate: '2026-03-20',
      expectedDischargeDate: '2026-03-30',
      diagnosis: 'Acute Coronary Syndrome',
      status: 'Admitted',
    },
    {
      id: 2,
      patient: 'Emma Johnson',
      doctor: 'Dr. Michael Brown',
      department: 'Neurology',
      roomNumber: '205',
      bedNumber: 'B',
      admissionDate: '2026-03-22',
      expectedDischargeDate: '2026-03-28',
      diagnosis: 'Migraine Management',
      status: 'Admitted',
    },
    {
      id: 3,
      patient: 'Robert Davis',
      doctor: 'Dr. Emily Chen',
      department: 'Orthopedics',
      roomNumber: '402',
      bedNumber: 'A',
      admissionDate: '2026-03-15',
      expectedDischargeDate: '2026-03-25',
      diagnosis: 'Hip Fracture',
      status: 'Discharged',
    },
    {
      id: 4,
      patient: 'Maria Garcia',
      doctor: 'Dr. James Lee',
      department: 'Pediatrics',
      roomNumber: '108',
      bedNumber: 'C',
      admissionDate: '2026-03-25',
      expectedDischargeDate: '2026-03-29',
      diagnosis: 'Pneumonia',
      status: 'Admitted',
    },
    {
      id: 5,
      patient: 'David Wilson',
      doctor: 'Dr. Sarah Wilson',
      department: 'Cardiology',
      roomNumber: '302',
      bedNumber: 'B',
      admissionDate: '2026-03-18',
      expectedDischargeDate: '2026-03-27',
      diagnosis: 'Heart Failure',
      status: 'Admitted',
    },
    {
      id: 6,
      patient: 'Lisa Anderson',
      doctor: 'Dr. David Kim',
      department: 'Emergency',
      roomNumber: '501',
      bedNumber: 'A',
      admissionDate: '2026-03-26',
      expectedDischargeDate: '2026-03-31',
      diagnosis: 'Trauma - Multiple Injuries',
      status: 'Admitted',
    },
  ]);

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    roomNumber: '',
    bedNumber: '',
    admissionDate: '',
    expectedDischargeDate: '',
    diagnosis: '',
    status: 'Admitted',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAdmission = {
      id: admissions.length + 1,
      ...formData,
    };
    setAdmissions([...admissions, newAdmission]);
    setShowAddModal(false);
    setFormData({
      patient: '',
      doctor: '',
      department: '',
      roomNumber: '',
      bedNumber: '',
      admissionDate: '',
      expectedDischargeDate: '',
      diagnosis: '',
      status: 'Admitted',
    });
  };

  const stats = [
    { label: 'Total Admissions', value: '342', color: 'bg-blue-500' },
    { label: 'Currently Admitted', value: '124', color: 'bg-green-500' },
    { label: 'This Month', value: '68', color: 'bg-purple-500' },
    { label: 'Discharged Today', value: '12', color: 'bg-orange-500' },
  ];

  return (
    <div className='p-8 space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>
            Patient Admissions
          </h2>
          <p className='text-gray-500 mt-1'>
            Manage patient admissions and discharges
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          New Admission
        </button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {stats.map((stat, index) => (
          <div
            key={index}
            className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>{stat.label}</p>
                <p className='text-3xl font-semibold text-gray-900'>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <ClipboardList className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search admissions by patient name...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Doctor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Room/Bed
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Admission Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Expected Discharge
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Diagnosis
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {admissions.map((admission) => (
                <tr
                  key={admission.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                        <span className='text-sm font-medium text-blue-600'>
                          {admission.patient
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <p className='text-sm font-medium text-gray-900'>
                        {admission.patient}
                      </p>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {admission.doctor}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {admission.department}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {admission.roomNumber}-{admission.bedNumber}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {admission.admissionDate}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {admission.expectedDischargeDate}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600 max-w-xs truncate'>
                    {admission.diagnosis}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        admission.status === 'Admitted'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                      {admission.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <button className='text-blue-600 hover:text-blue-800'>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-900'>
                New Patient Admission
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-4'>
              {/* Form fields here, same as original */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admissions;
