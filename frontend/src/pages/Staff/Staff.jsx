import React, { useState } from 'react';
import { Search, Filter, Plus, Phone, Mail, X, Users } from 'lucide-react';

const Staff = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: 'Jennifer Martinez',
      age: 32,
      gender: 'Female',
      phone: '+1 555-0401',
      email: 'j.martinez@medicare.com',
      role: 'Nurse',
      department: 'Emergency',
      experience: 8,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Robert Thompson',
      age: 28,
      gender: 'Male',
      phone: '+1 555-0402',
      email: 'r.thompson@medicare.com',
      role: 'Medical Technologist',
      department: 'Laboratory',
      experience: 5,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Lisa Chen',
      age: 35,
      gender: 'Female',
      phone: '+1 555-0403',
      email: 'l.chen@medicare.com',
      role: 'Radiologist',
      department: 'Radiology',
      experience: 10,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Michael Johnson',
      age: 45,
      gender: 'Male',
      phone: '+1 555-0404',
      email: 'm.johnson@medicare.com',
      role: 'Pharmacist',
      department: 'Pharmacy',
      experience: 18,
      status: 'On Leave',
    },
    {
      id: 5,
      name: 'Sarah Williams',
      age: 29,
      gender: 'Female',
      phone: '+1 555-0405',
      email: 's.williams@medicare.com',
      role: 'Physical Therapist',
      department: 'Rehabilitation',
      experience: 6,
      status: 'Active',
    },
    {
      id: 6,
      name: 'David Anderson',
      age: 38,
      gender: 'Male',
      phone: '+1 555-0406',
      email: 'd.anderson@medicare.com',
      role: 'Administrative',
      department: 'Administration',
      experience: 12,
      status: 'Active',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    role: 'Nurse',
    department: '',
    experience: '',
    status: 'Active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = {
      id: staff.length + 1,
      name: formData.name,
      age: parseInt(formData.age),
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      experience: parseInt(formData.experience),
      status: formData.status,
    };
    setStaff([...staff, newStaff]);
    setShowAddModal(false);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      role: 'Nurse',
      department: '',
      experience: '',
      status: 'Active',
    });
  };

  const stats = [
    { label: 'Total Staff', value: '248', color: 'bg-blue-500' },
    { label: 'Active', value: '232', color: 'bg-green-500' },
    { label: 'On Leave', value: '12', color: 'bg-yellow-500' },
    { label: 'Inactive', value: '4', color: 'bg-gray-500' },
  ];

  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>Staff</h2>
          <p className='text-gray-500 mt-1'>Manage hospital staff members</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          Add Staff
        </button>
      </div>

      {/* Stats */}
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
                <Users className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search staff by name or role...'
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Staff Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Age
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Gender
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Experience
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Contact
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
              {staff.map((member) => (
                <tr
                  key={member.id}
                  className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3'>
                        <span className='text-sm font-medium text-blue-600'>
                          {member.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          {member.name}
                        </p>
                        <p className='text-xs text-gray-500'>
                          ID: S{member.id.toString().padStart(4, '0')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {member.age}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {member.gender}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {member.role}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {member.department}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                    {member.experience} years
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Phone className='w-3 h-3' />
                        {member.phone}
                      </div>
                      <div className='flex items-center gap-2 text-xs text-gray-600'>
                        <Mail className='w-3 h-3' />
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : member.status === 'On Leave'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}>
                      {member.status}
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-900'>
                Add New Staff Member
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
              {/* Form fields here (same as original) */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
