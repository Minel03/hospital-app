import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';
import Select from 'react-select';
import { useEffect } from 'react';

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
  const { getSelectStyles } = useAppContext();

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
  }, [mode, selectedDoctor, departments]);

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      title={mode === 'add' ? 'Add Doctor' : 'Edit Doctor'}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* User (Name) Picker */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Select Doctor (User Account)
            </label>
            <Select
              styles={getSelectStyles()}
              options={userOptions}
              value={selectedUser}
              onChange={handleUserSelect}
              placeholder='Search and select a doctor user...'
              isClearable
              isDisabled={mode === 'edit'}
            />
            {mode === 'edit' && (
              <p className='text-xs text-blue-500 mt-1 font-medium'>
                User link cannot be changed after creation.
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Age
            </label>
            <input
              type='number'
              required
              value={formData.age || ''}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='35'
            />
          </div>

          {/* Gender */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Gender
            </label>
            <select
              required
              value={formData.gender || 'Male'}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>

          {/* Specialty */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Specialty
            </label>
            <input
              type='text'
              required
              value={formData.specialty || ''}
              onChange={(e) =>
                setFormData({ ...formData, specialty: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='Cardiology'
            />
          </div>

          {/* Department */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Department
            </label>
            <Select
              styles={getSelectStyles()}
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
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Phone
            </label>
            <input
              type='text'
              value={formData.phone || ''}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='(123) 456-7890'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Email
            </label>
            <input
              type='email'
              value={formData.email || ''}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='doctor@email.com'
            />
          </div>

          {/* Experience */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Experience (years)
            </label>
            <input
              type='number'
              value={formData.experience || ''}
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Patients */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Number of Patients
            </label>
            <input
              type='number'
              value={formData.patients || 0}
              onChange={(e) =>
                setFormData({ ...formData, patients: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Status */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Status
            </label>
            <select
              value={formData.status || 'Available'}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value='Available'>Available</option>
              <option value='In Surgery'>In Surgery</option>
              <option value='Offline'>Offline</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className='pt-4 flex justify-end'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
            {mode === 'add' ? 'Add Doctor' : 'Update Doctor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DoctorFormModal;
