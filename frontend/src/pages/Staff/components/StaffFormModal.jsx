import React from 'react';
import Select from 'react-select';
import { Icons } from '../../../context/AppContext';

const StaffFormModal = ({
  showAddModal,
  setShowAddModal,
  handleSubmit,
  formData,
  setFormData,
  editingStaff,
  departmentOptions,
}) => {
  const { X } = Icons;

  if (!showAddModal) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900'>
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
          {/* Name + Age */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Full Name
              </label>
              <input
                type='text'
                value={formData.name}
                placeholder='Enter full name'
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='mt-1 border px-3 py-2 rounded w-full'
                required
              />
            </div>

            <div>
              <label className='text-sm font-medium text-gray-700'>Age</label>
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
              <label className='text-sm font-medium text-gray-700'>
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
              <label className='text-sm font-medium text-gray-700'>Phone</label>
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
              <label className='text-sm font-medium text-gray-700'>Role</label>
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
              <label className='text-sm font-medium text-gray-700'>
                Department
              </label>
              <Select
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
              <label className='text-sm font-medium text-gray-700'>
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
              <label className='text-sm font-medium text-gray-700'>
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
