import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';
import Select from 'react-select';
import QuickAddPatientModal from '../../../components/QuickAddPatientModal';

const AppointmentFormModal = ({
  showModal,
  setShowModal,
  mode,
  formData,
  setFormData,
  handleSubmit,
  doctors,
  departments,
}) => {
  const { getSelectStyles, setPatients, patients } = useAppContext();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handlePatientCreated = (newPatient) => {
    setPatients((prev) => (prev ? [...prev, newPatient] : [newPatient]));
    setFormData((prev) => ({ ...prev, patient: newPatient._id }));
  };

  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}T${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  return (
    <>
      <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      title={mode === 'add' ? 'Add Appointment' : 'Edit Appointment'}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        {/* Patient */}
        <div>
          <div className='flex items-center justify-between mb-2'>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>Patient</label>
            <button
              type='button'
              onClick={() => setShowQuickAdd(true)}
              className='text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline'>
              + New Patient
            </button>
          </div>
          <Select
            styles={getSelectStyles()}
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
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Doctor
          </label>
          <Select
            styles={getSelectStyles()}
            options={doctors?.map((d) => ({ value: d._id, label: d.name }))}
            value={
              formData.doctor
                ? {
                    value: formData.doctor,
                    label: doctors.find((d) => d._id === formData.doctor)?.name,
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
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Department
          </label>
          <Select
            styles={getSelectStyles()}
            options={departments?.map((dep) => ({
              value: dep._id,
              label: dep.name,
            }))}
            value={
              formData.department
                ? {
                    value: formData.department,
                    label: departments?.find(
                      (d) => d._id === formData.department,
                    )?.name,
                  }
                : null
            }
            onChange={(selected) =>
              setFormData({ ...formData, department: selected?.value || '' })
            }
            placeholder='Select Department'
            isClearable
          />
        </div>

        {/* Date & Time */}
        <div>
          <label
            htmlFor='appointmentDateTime'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Date & Time
          </label>
          <input
            id='appointmentDateTime'
            type='datetime-local'
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium scheme-light dark:scheme-dark'
            min={localToday}
            value={formData.datetime || ''}
            onChange={(e) =>
              setFormData({ ...formData, datetime: e.target.value })
            }
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          {/* Status */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value='Pending'>Pending</option>
              <option value='Confirmed'>Confirmed</option>
              <option value='Cancelled'>Cancelled</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option value='Check-up'>Check-up</option>
              <option value='Follow-up'>Follow-up</option>
              <option value='Emergency'>Emergency</option>
            </select>
          </div>
        </div>

        {/* Meeting Link (Telemedicine) */}
        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Telemedicine Meeting Link (Optional)
          </label>
          <input
            type='url'
            value={formData.meetingLink || ''}
            onChange={(e) =>
              setFormData({ ...formData, meetingLink: e.target.value })
            }
            placeholder='https://zoom.us/j/...'
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
          />
        </div>

        {/* Buttons */}
        <div className='pt-4 flex justify-end'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
            {mode === 'add' ? 'Add Appointment' : 'Update Appointment'}
          </button>
        </div>
      </form>
    </Modal>
      <QuickAddPatientModal
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onPatientCreated={handlePatientCreated}
      />
    </>
  );
};

export default AppointmentFormModal;
