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
  const { getSelectStyles, axios } = useAppContext();

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
    color: '#3b82f6',
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
        color,
      } = selectedDepartment;

      setFormData({
        name: name || '',
        description: description || '',
        head: head?._id || head || '',
        doctors: doctors || 0,
        staff: staff || 0,
        patients: patients || 0,
        roomsAndBeds: roomsAndBeds || 0,
        occupiedBeds: occupiedBeds || 0,
        phone: phone || '',
        status: status || 'Active',
        color: color || '#3b82f6',
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
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
      onClick={() => setShowModal(false)}>
      <div
        className='bg-white dark:bg-gray-800 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto relative dark:border dark:border-gray-700'
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            {mode === 'add' ? 'Add Department' : 'Edit Department'}
          </h2>
          <button
            type='button'
            onClick={() => setShowModal(false)}
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
            <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='p-6 space-y-4'>
          {/* Name */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Name</label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
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
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            />
          </div>

          {/* Head (Doctor) */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Head (Doctor)
            </label>
            <Select 
              styles={getSelectStyles()}
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

          <div className='grid grid-cols-2 gap-4'>
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
                className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Department Color */}
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Chart Color
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='color'
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className='w-10 h-10 border-none bg-transparent cursor-pointer p-0'
                />
                <input
                  type='text'
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className='flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-xs font-mono text-gray-900 dark:text-white uppercase'
                />
              </div>
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
              className='w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
            />
          </div>

          <div className='flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
            <button
              type='submit'
              className='bg-blue-600 text-white py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors'>
              {mode === 'add' ? 'Add Department' : 'Update Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentFormModal;
