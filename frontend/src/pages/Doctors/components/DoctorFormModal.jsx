import React, { useEffect } from 'react';
import Select from 'react-select';
import { Icons } from '../../../context/AppContext';

const DoctorFormModal = ({
  showModal,
  setShowModal,
  mode,
  formData,
  setFormData,
  selectedDoctor,
  handleSubmit,
  departments = [],
  doctorUsers = [],
}) => {
  const { X } = Icons;

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      userId: null,
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      specialty: '',
      experience: '',
      patients: 0,
      status: 'Available',
      department: null,
    });
  };

  // Map departments to react-select options
  const departmentOptions = departments.map((dept) => ({
    value: dept._id,
    label: dept.name,
  }));

  // Map doctor-role users to react-select options
  const userOptions = doctorUsers.map((u) => ({
    value: u._id,
    label: u.name,
    email: u.email,
    phone: u.phone || '',
  }));

  // Pre-select user in edit mode
  const selectedUser = userOptions.find((o) => o.value === formData.userId) || null;

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

  useEffect(() => {
    if (mode === 'edit' && selectedDoctor) {
      const deptOption = departments
        .map((dept) => ({ value: dept._id, label: dept.name }))
        .find((d) => d.value === selectedDoctor.department?._id);

      setFormData((prev) => ({
        ...prev,
        department: deptOption || null,
      }));
    }
  }, [mode, selectedDoctor, departments]); // departmentOptions removed — use departments directly

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
          <h3 className='text-xl font-semibold'>
            {mode === 'add' ? 'Add Doctor' : 'Edit Doctor'}
          </h3>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <X className='w-5 h-5' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* User (Name) Picker */}
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Select Doctor (User Account)
              </label>
              <Select
                options={userOptions}
                value={selectedUser}
                onChange={handleUserSelect}
                placeholder='Search and select a doctor user...'
                isClearable
                isDisabled={mode === 'edit'}
              />
              {mode === 'edit' && (
                <p className='text-xs text-gray-400 mt-1'>User link cannot be changed after creation.</p>
              )}
            </div>

            {/* Age */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Age
              </label>
              <input
                type='number'
                required
                value={formData.age || ''}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='35'
              />
            </div>

            {/* Gender */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Gender
              </label>
              <select
                required
                value={formData.gender || 'Male'}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>
            </div>

            {/* Specialty */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Specialty
              </label>
              <input
                type='text'
                required
                value={formData.specialty || ''}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Cardiology'
              />
            </div>

            {/* Department */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Department
              </label>
              <Select
                options={departmentOptions}
                value={formData.department}
                onChange={(selected) =>
                  setFormData({ ...formData, department: selected })
                }
                placeholder='Select Department'
                isClearable
              />
            </div>

            {/* Phone */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Phone
              </label>
              <input
                type='text'
                value={formData.phone || ''}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='(123) 456-7890'
              />
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                type='email'
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='doctor@email.com'
              />
            </div>

            {/* Experience */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Experience (years)
              </label>
              <input
                type='number'
                value={formData.experience || ''}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Patients */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Number of Patients
              </label>
              <input
                type='number'
                value={formData.patients || 0}
                onChange={(e) =>
                  setFormData({ ...formData, patients: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Status */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Status
              </label>
              <select
                value={formData.status || 'Available'}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                <option value='Available'>Available</option>
                <option value='In Surgery'>In Surgery</option>
                <option value='Offline'>Offline</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleClose}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'>
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
              {mode === 'add' ? 'Add Doctor' : 'Update Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal;
