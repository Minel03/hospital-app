import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { Icons, useAppContext } from '../../../context/AppContext';

const DepartmentFormModal = ({
  showModal,
  setShowModal,
  mode,
  selectedDepartment,
  fetchDepartments,
  doctors = [], // 👈 pass doctors here
}) => {
  const { X } = Icons;
  const { getSelectStyles } = useAppContext();
  const { axios } = useAppContext();

  const initialForm = {
    name: '',
    description: '',
    head: '',
    doctors: 0,
    staff: 0,
    patients: 0,
    roomsAndBeds: 0,
    occupiedBeds: 0,
    phone: '',
    status: 'Active',
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (mode === 'edit' && selectedDepartment) {
      const {
        name,
        description,
        head,
        doctors,
        staff,
        patients,
        roomsAndBeds,
        occupiedBeds,
        phone,
        status,
      } = selectedDepartment;

      setFormData({
        name: name || '',
        description: description || '',
        head: head?._id || head || '', // 👈 supports populated doctor
        doctors: doctors || 0,
        staff: staff || 0,
        patients: patients || 0,
        roomsAndBeds: roomsAndBeds || 0,
        occupiedBeds: occupiedBeds || 0,
        phone: phone || '',
        status: status || 'Active',
      });
    } else {
      setFormData(initialForm);
    }
  }, [mode, selectedDepartment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        mode === 'add' ? '/api/department/add' : '/api/department/update';

      const payload =
        mode === 'edit'
          ? { departmentId: selectedDepartment._id, ...formData }
          : formData;

      const numericPayload = {
        ...payload,
        doctors: Number(payload.doctors),
        staff: Number(payload.staff),
        patients: Number(payload.patients),
        roomsAndBeds: Number(payload.roomsAndBeds),
        occupiedBeds: Number(payload.occupiedBeds),
      };

      const { data } = await axios.post(endpoint, numericPayload);

      if (data.success) {
        toast.success(data.message);
        fetchDepartments();
        setShowModal(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  if (!showModal) return null;

  // 👇 doctor select options
  const doctorOptions = doctors.map((doc) => ({
    value: doc._id,
    label: `${doc.name}${doc.specialization ? ` (${doc.specialization})` : ''}`,
  }));

  return (
    <div
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={() => setShowModal(false)}>
      <div
        className='bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg p-6 relative dark:border dark:border-gray-700'
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowModal(false)}
          className='absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-300'>
          <X className='w-5 h-5' />
        </button>

        <h2 className='text-xl font-semibold mb-4'>
          {mode === 'add' ? 'Add Department' : 'Edit Department'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          {/* Name */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* 👇 UPDATED HEAD (React Select) */}
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Head (Doctor)
              </label>
              <Select styles={getSelectStyles()}
                options={doctorOptions}
                value={doctorOptions.find((opt) => opt.value === formData.head)}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    head: selected?.value || '',
                  })
                }
                placeholder='Select doctor...'
              />
            </div>

            {/* Status */}
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className='w-full border border-gray-300 rounded-lg px-3 py-2'>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          {/* 👇 NEW PHONE FIELD */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Phone</label>
            <input
              type='text'
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder='Enter phone number'
              className='w-full border border-gray-300 rounded-lg px-3 py-2'
            />
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t border-gray-200'>
            <button
              type='button'
              onClick={() => setShowModal(false)}
              className='bg-gray-50 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg'>
              Cancel
            </button>

            <button
              type='submit'
              className='bg-blue-600 text-white py-2 px-4 rounded-lg'>
              {mode === 'add' ? 'Add Department' : 'Update Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormModal;
