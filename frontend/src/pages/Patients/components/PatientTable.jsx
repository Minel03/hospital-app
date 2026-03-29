import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientTable = ({ patients, onView, onEdit, onDelete }) => {
  const { Eye, Edit, Trash, Phone, Mail } = Icons;

  return (
    <div>
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
                  key={patient._id}
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
                          ID: {patient._id.toString().padStart(4, '0')}
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
                        <Phone className='w-3 h-3' /> {patient.phone}
                      </div>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Mail className='w-3 h-3' /> {patient.email}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {new Date(patient.lastVisit).toLocaleString()}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className='p-6 whitespace-nowrap text-sm flex gap-2'>
                    <button
                      onClick={() => onView(patient)}
                      className='p-1 bg-gray-100 rounded hover:bg-gray-200'>
                      <Eye className='w-4 h-4 text-gray-700' />
                    </button>
                    <button
                      onClick={() => onEdit(patient)}
                      className='p-1 bg-blue-100 rounded hover:bg-blue-200'>
                      <Edit className='w-4 h-4 text-blue-700' />
                    </button>
                    <button
                      onClick={() => onDelete(patient._id)}
                      className='p-1 bg-red-100 rounded hover:bg-red-200'>
                      <Trash className='w-4 h-4 text-red-600' />
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

export default PatientTable;
