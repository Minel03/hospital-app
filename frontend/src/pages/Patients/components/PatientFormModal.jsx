import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';

const PatientFormModal = ({
  mode,
  formData,
  setFormData,
  handleSubmit,
  setShowModal,
  showModal,
  setSelectedPatient,
}) => {
  const { getSelectStyles } = useAppContext();

  const handleClose = () => {
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
  };

  return (
    <Modal
      isOpen={showModal}
      onClose={handleClose}
      title={mode === 'add' ? 'Add New Patient' : 'Edit Patient'}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        {/* Form fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Full Name
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='John Doe'
            />
          </div>

          {/* Age */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Age
            </label>
            <input
              type='number'
              required
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='25'
            />
          </div>

          {/* Gender */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Gender
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Other'>Other</option>
            </select>
          </div>

          {/* Blood Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Blood Type
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                <option
                  key={bt}
                  value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Phone Number
            </label>
            <input
              type='tel'
              required
              value={formData.phone}
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
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='patient@email.com'
            />
          </div>
        </div>

        {/* Address / Allergies / Medical History */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Address
          </label>
          <input
            type='text'
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            placeholder='123 Main St'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Allergies
          </label>
          <input
            type='text'
            value={formData.allergies}
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Medical History
          </label>
          <textarea
            rows={3}
            value={formData.medicalHistory}
            onChange={(e) =>
              setFormData({ ...formData, medicalHistory: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
          />
        </div>

        {/* Submit */}
        <div className='pt-4 flex justify-end'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
            {mode === 'add' ? 'Add Patient' : 'Update Patient'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PatientFormModal;
