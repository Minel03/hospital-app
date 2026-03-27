import React from 'react';
import { Icons } from '../context/AppContext';
import { patients } from '../data/dummyData';
import Title from '../components/Title';

const Patients = () => {
  const { Search, Filter, Plus, MoreVertical, Phone, Mail } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Title
            title='Patients'
            subtitle='Manage and view all patient records'
          />
        </div>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Patient</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search patients by name, ID, or phone...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Patients Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Patient
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Age
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gender
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contact
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Last Visit
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
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                        <span className='text-sm font-medium text-blue-600'>
                          {patient.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          {patient.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          ID: P{patient.id.toString().padStart(4, '0')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {patient.age}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {patient.gender}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Phone className='w-3 h-3' />
                        {patient.phone}
                      </div>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Mail className='w-3 h-3' />
                        {patient.email}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {patient.lastVisit}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        patient.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    <button className='p-1 hover:bg-gray-100 rounded'>
                      <MoreVertical className='w-5 h-5 text-gray-400' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
