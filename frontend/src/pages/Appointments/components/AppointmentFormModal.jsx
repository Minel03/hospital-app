import React from 'react';
import Select from 'react-select';

const AppointmentFormModal = ({
  showModal,
  setShowModal,
  mode,
  formData,
  setFormData,
  handleSubmit,
  patients,
  doctors,
  departments,
}) => {
  if (!showModal) return null;

  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='text-lg font-semibold mb-4'>
          {mode === 'add' ? 'Add Appointment' : 'Edit Appointment'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          {/* Patient */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Patient
            </label>
            <Select
              options={patients?.map((p) => ({ value: p._id, label: p.name }))}
              value={
                formData.patient
                  ? {
                      value: formData.patient,
                      label: patients.find((p) => p._id === formData.patient)
                        ?.name,
                    }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, patient: selected?.value || '' })
              }
              placeholder='Select Patient'
              isClearable
            />
          </div>

          {/* Doctor */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Doctor
            </label>
            <Select
              options={doctors?.map((d) => ({ value: d._id, label: d.name }))}
              value={
                formData.doctor
                  ? {
                      value: formData.doctor,
                      label: doctors.find((d) => d._id === formData.doctor)
                        ?.name,
                    }
                  : null
              }
              onChange={(selected) =>
                setFormData({ ...formData, doctor: selected?.value || '' })
              }
              placeholder='Select Doctor'
              isClearable
            />
          </div>

          {/* Department */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Department
            </label>
            <Select
              options={departments?.map((dep) => ({
                value: dep._id, // ← use _id not name
                label: dep.name,
              }))}
              value={formData.department || null} // ← already a {value, label} object
              onChange={
                (selected) =>
                  setFormData({ ...formData, department: selected || null }) // ← store whole object
              }
              placeholder='Select Department'
              isClearable
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Date & Time
            </label>
            <div className='flex gap-2'>
              <input
                type='date'
                value={formData.date}
                min={localToday}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className='w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
              <input
                type='time'
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                className='w-1/2 border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value='Pending'>Pending</option>
              <option value='Confirmed'>Confirmed</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className='w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'>
              <option value='Check-up'>Check-up</option>
              <option value='Follow-up'>Follow-up</option>
              <option value='Emergency'>Emergency</option>
            </select>
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-2 mt-2'>
            <button
              type='button'
              onClick={() => setShowModal(false)}
              className='px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300'>
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700'>
              {mode === 'add' ? 'Add' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentFormModal;
