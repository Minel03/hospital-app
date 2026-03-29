import React from 'react';
import { Icons } from '../../../context/AppContext';

const DoctorFormModal = ({
  showModal,
  setShowModal,
  mode,
  formData,
  setFormData,
  selectedDoctor,
  handleSubmit,
}) => {
  const { X } = Icons;

  // Default values to reset the form
  const defaultFormData = {
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    specialty: '',
    experience: '',
    patients: 0,
    status: 'Available',
  };

  if (!showModal) return null;

  const handleClose = () => {
    setShowModal(false);
    setFormData(defaultFormData);
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900'>
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
            {/* Name */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Name
              </label>
              <input
                type='text'
                required
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='Dr. John Doe'
              />
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
