import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientTable = ({ patients, onView, onEdit, onDelete }) => {
  const { Eye, Edit, Trash, Phone, Mail } = Icons;

  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <div className='overflow-x-auto'>
        <div className='w-full'>
          {/* ------------ List Table Title (Desktop Only) ------------ */}
          <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_2fr_2fr_1fr_auto] items-center py-2 px-3 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600'>
            <b>Patient</b>
            <b>Age</b>
            <b>Gender</b>
            <b>Contact</b>
            <b>Last Visit</b>
            <b>Status</b>
            <b className='w-28 text-center'>Actions</b>
          </div>

          {/* ------------ Patient List ------------ */}
          {patients.map((patient) => (
            <div
              key={patient._id}
              className='border-b border-gray-200 px-3 py-3 hover:bg-gray-50 flex flex-col gap-2 md:grid md:grid-cols-[2fr_1fr_1fr_2fr_2fr_1fr_auto] md:items-center text-sm'>
              {/* Patient */}
              <div className='flex flex-col md:flex-row md:items-center gap-1'>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Patient
                </p>
                <div className='flex items-center gap-2'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0'>
                    <span className='text-sm font-medium text-blue-600'>
                      {patient.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div className='flex flex-col'>
                    <p className='font-medium text-gray-900'>{patient.name}</p>
                    <p className='text-xs text-gray-500'>
                      ID: {patient._id.toString().padStart(4, '0')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Age
                </p>
                <p className='text-gray-900'>{patient.age}</p>
              </div>

              {/* Gender */}
              <div>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Gender
                </p>
                <p className='text-gray-900'>{patient.gender}</p>
              </div>

              {/* Contact */}
              <div className='flex flex-col text-gray-600 text-xs gap-1'>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Contact
                </p>
                <div className='flex items-center gap-1'>
                  <Phone className='w-3 h-3' /> {patient.phone}
                </div>
                <div className='flex items-center gap-1'>
                  <Mail className='w-3 h-3' /> {patient.email}
                </div>
              </div>

              {/* Last Visit */}
              <div>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Last Visit
                </p>
                <p className='text-gray-900'>
                  {new Date(patient.lastVisit).toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className='md:hidden text-xs text-gray-500 font-medium'>
                  Status
                </p>
                <span
                  className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                    patient.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                  {patient.status}
                </span>
              </div>

              {/* Actions */}
              <div className='flex gap-2 w-28 justify-center'>
                <button
                  onClick={() => onView(patient)}
                  className='p-2 bg-gray-50 rounded hover:bg-gray-100 flex-1 md:flex-none flex justify-center'>
                  <Eye className='w-4 h-4 text-gray-700' />
                </button>
                <button
                  onClick={() => onEdit(patient)}
                  className='p-2 bg-blue-50 rounded hover:bg-blue-100 flex-1 md:flex-none flex justify-center'>
                  <Edit className='w-4 h-4 text-blue-700' />
                </button>
                <button
                  onClick={() => onDelete(patient._id)}
                  className='p-2 bg-red-50 rounded hover:bg-red-100 flex-1 md:flex-none flex justify-center'>
                  <Trash className='w-4 h-4 text-red-600' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
