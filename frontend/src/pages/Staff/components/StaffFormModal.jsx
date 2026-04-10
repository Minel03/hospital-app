import React from 'react';
import Select from 'react-select';
import { Icons, useAppContext } from '../../../context/AppContext';

const StaffFormModal = ({
  showAddModal,
  setShowAddModal,
  handleSubmit,
  formData,
  setFormData,
  editingStaff,
  departmentOptions,
  staffUsers = [],
}) => {
  const { X } = Icons;
  const { getSelectStyles } = useAppContext();

  // Map staff-role users to react-select options
  const userOptions = staffUsers.map((u) => ({
    value: u._id,
    label: u.name,
    email: u.email,
    phone: u.phone || '',
  }));

  const selectedUser =
    userOptions.find((o) => o.value === formData.userId) || null;

  const handleUserSelect = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        userId: selected.value,
        name: selected.label,
        email: selected.email || '',
        phone: selected.phone || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        userId: null,
        name: '',
        email: '',
        phone: '',
      }));
    }
  };

  if (!showAddModal) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700'>
        {/* Header */}
        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>

          <button
            type='button'
            onClick={() => setShowAddModal(false)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-5'>
          {/* User (Name) Picker — full width */}
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Select Staff (User Account)
              </label>
              <Select
                className='mt-1'
                styles={getSelectStyles()}
                options={userOptions}
                value={selectedUser}
                onChange={handleUserSelect}
                placeholder='Search and select a staff user...'
                isClearable
                isDisabled={!!editingStaff}
              />
              {editingStaff && (
                <p className='text-xs text-gray-400 mt-1'>
                  User link cannot be changed after creation.
                </p>
              )}
            </div>
          </div>

          {/* Age */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Age</label>
              <input
                type='number'
                value={formData.age}
                placeholder='Age'
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'
              />
            </div>
          </div>

          {/* Gender + Phone */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'>
                <option value=''>Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Phone</label>
              <input
                type='text'
                value={formData.phone}
                placeholder='Phone number'
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              value={formData.email}
              placeholder='Email address'
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='mt-1 border px-3 py-2 rounded w-full'
            />
          </div>

          {/* Role + Department */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Role</label>
              <input
                type='text'
                value={formData.role}
                placeholder='Role'
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Department
              </label>
              <Select
                styles={getSelectStyles()}
                options={departmentOptions}
                value={
                  departmentOptions.find(
                    (o) => o.value === formData.department,
                  ) || null
                }
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    department: selected?.value || '',
                  })
                }
                placeholder='Select Department'
                isClearable
                className='mt-1'
              />
            </div>
          </div>

          {/* Experience + Status */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Experience (Years)
              </label>
              <input
                type='number'
                value={formData.experience}
                placeholder='Years of experience'
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'>
                <option>Active</option>
                <option>On Leave</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className='pt-4 flex justify-end'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
              {editingStaff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;
