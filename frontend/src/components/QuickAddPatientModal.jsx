import React, { useState } from 'react';
import Modal from './Modal';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const DEFAULT_FORM = {
  name: '',
  age: '',
  gender: 'Male',
  phone: '',
  email: '',
  address: '',
  bloodType: '',
};

/**
 * QuickAddPatientModal
 * A lightweight modal to register a new patient on the spot.
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onPatientCreated - called with the new patient object after save
 */
const QuickAddPatientModal = ({ isOpen, onClose, onPatientCreated }) => {
  const { axios } = useAppContext();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/patient/add', form);
      if (res.data.success) {
        toast.success(`Patient "${form.name}" registered successfully!`);
        onPatientCreated(res.data.patient);
        setForm(DEFAULT_FORM);
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to add patient');
      }
    } catch (err) {
      toast.error('Error registering patient');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Quick Register Patient'>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        <p className='text-sm text-gray-500 dark:text-gray-400 -mt-2'>
          Register a new patient and they will be automatically selected.
        </p>

        {/* Name */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
            Full Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder='e.g. Maria Santos'
            className={inputClass}
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {/* Age */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Age
            </label>
            <input
              required
              type='number'
              min='0'
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
              placeholder='e.g. 35'
              className={inputClass}
            />
          </div>

          {/* Gender */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              className={inputClass}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          {/* Phone */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Phone
            </label>
            <input
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder='e.g. 09XX-XXX-XXXX'
              className={inputClass}
            />
          </div>

          {/* Blood Type */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
              Blood Type
            </label>
            <select
              value={form.bloodType}
              onChange={(e) => handleChange('bloodType', e.target.value)}
              className={inputClass}>
              <option value=''>Unknown</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                <option key={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
            Email
          </label>
          <input
            type='email'
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder='e.g. patient@email.com'
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1'>
            Address
          </label>
          <input
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder='e.g. 123 Rizal St., Manila'
            className={inputClass}
          />
        </div>

        <div className='pt-2'>
          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60'>
            {loading ? 'Registering...' : 'Register & Select'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddPatientModal;
