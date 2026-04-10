import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';
import Select from 'react-select';

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

  return (
    <Modal
      isOpen={showAddModal}
      onClose={() => setShowAddModal(false)}
      title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        {/* User (Name) Picker — full width */}
        <div>
          <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
            Select Staff (User Account)
          </label>
          <div className='mt-2'>
            <Select
              styles={getSelectStyles()}
              options={userOptions}
              value={selectedUser}
              onChange={handleUserSelect}
              placeholder='Search and select a staff user...'
              isClearable
              isDisabled={!!editingStaff}
            />
          </div>
          {editingStaff && (
            <p className='text-xs text-blue-500 mt-1 font-medium'>
              User link cannot be changed after creation.
            </p>
          )}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Age */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Age
            </label>
            <input
              type='number'
              value={formData.age}
              placeholder='Age'
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Gender */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value=''>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Phone
            </label>
            <input
              type='text'
              value={formData.phone}
              placeholder='Phone number'
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Email */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Email
            </label>
            <input
              type='email'
              value={formData.email}
              placeholder='Email address'
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Role */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Role
            </label>
            <input
              type='text'
              value={formData.role}
              placeholder='Role'
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Department */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
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
            />
          </div>

          {/* Experience */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Experience (Years)
            </label>
            <input
              type='number'
              value={formData.experience}
              placeholder='Years of experience'
              onChange={(e) =>
                setFormData({ ...formData, experience: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            />
          </div>

          {/* Status */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
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
            className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
            {editingStaff ? 'Update Staff' : 'Add Staff'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StaffFormModal;
