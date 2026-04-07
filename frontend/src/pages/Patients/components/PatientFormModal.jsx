import React from 'react';
import { Icons } from '../../../context/AppContext';

const PatientFormModal = ({
  mode,
  formData,
  setFormData,
  handleSubmit,
  setShowModal,
  showModal,
  setSelectedPatient,
}) => {
  const { X } = Icons;
  if (!showModal) return null;
  return (
    <div>
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
        <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
          <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
            <h3 className='text-xl font-semibold text-gray-900'>
              {mode === 'add' ? 'Add New Patient' : 'Edit Patient'}
            </h3>
            <button
              onClick={() => {
                setShowModal(false);
                setSelectedPatient(null);
                setFormData({
                  name: '',
                  age: '',
                  gender: 'Male',
                  phone: '',
                  email: '',
                  address: '',
                  bloodType: 'A+',
                  allergies: '',
                  medicalHistory: '',
                });
              }}
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
              <X className='w-5 h-5' />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className='p-6 space-y-4'>
            {/* Form fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Full Name
                </label>
                <input
                  type='text'
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='John Doe'
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
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='25'
                />
              </div>

              {/* Gender */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Gender
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option value='Male'>Male</option>
                  <option value='Female'>Female</option>
                  <option value='Other'>Other</option>
                </select>
              </div>

              {/* Blood Type */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Blood Type
                </label>
                <select
                  value={formData.bloodType}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodType: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                    (bt) => (
                      <option
                        key={bt}
                        value={bt}>
                        {bt}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Phone */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Phone Number
                </label>
                <input
                  type='tel'
                  required
                  value={formData.phone}
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
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='patient@email.com'
                />
              </div>
            </div>

            {/* Address / Allergies / Medical History */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Address
              </label>
              <input
                type='text'
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                placeholder='123 Main St'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Allergies
              </label>
              <input
                type='text'
                value={formData.allergies}
                onChange={(e) =>
                  setFormData({ ...formData, allergies: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Medical History
              </label>
              <textarea
                rows={3}
                value={formData.medicalHistory}
                onChange={(e) =>
                  setFormData({ ...formData, medicalHistory: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            {/* Buttons */}
            <div className='flex gap-3 pt-4'>
              <button
                type='button'
                onClick={() => {
                  setShowModal(false);
                  setSelectedPatient(null);
                  setFormData({
                    name: '',
                    age: '',
                    gender: 'Male',
                    phone: '',
                    email: '',
                    address: '',
                    bloodType: 'A+',
                    allergies: '',
                    medicalHistory: '',
                  });
                }}
                className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'>
                Cancel
              </button>

              <button
                type='submit'
                className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                {mode === 'add' ? 'Add Patient' : 'Update Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientFormModal;
