import React from 'react';
import Select from 'react-select';
import { useAppContext } from '../../../context/AppContext';

const BillingModal = ({
  showModal,
  setShowModal,
  mode,
  formData,
  setFormData,
  patients,
  doctors,
  handleSubmit,
  admissions,
  appointments,
  updateService,
  addService,
  removeService,
  totalAmount,
  SERVICE_TYPES,
}) => {
  const { getSelectStyles, Icons } = useAppContext();
  const { X } = Icons;
  return (
    <div>
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg w-125 max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700'>
            {/* Header */}
            <div className='sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10'>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {mode === 'add' ? 'New Invoice' : 'Edit Invoice'}
              </h3>
              <button
                type='button'
                onClick={() => setShowModal(false)}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-3'>
              {/* Patient */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Patient</label>
                <Select styles={getSelectStyles()}
                  options={patients.map((p) => ({
                    value: p._id,
                    label: p.name,
                  }))}
                  value={
                    patients
                      .map((p) => ({ value: p._id, label: p.name }))
                      .find((o) => o.value === formData.patient) || null
                  }
                  onChange={(s) =>
                    setFormData({ ...formData, patient: s?.value || '' })
                  }
                  placeholder='Select Patient'
                  isSearchable
                  required
                />
              </div>

              {/* Doctor */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Doctor</label>
                <Select styles={getSelectStyles()}
                  options={doctors.map((d) => ({
                    value: d._id,
                    label: d.name,
                  }))}
                  value={
                    doctors
                      .map((d) => ({ value: d._id, label: d.name }))
                      .find((o) => o.value === formData.doctor) || null
                  }
                  onChange={(s) =>
                    setFormData({ ...formData, doctor: s?.value || '' })
                  }
                  placeholder='Select Doctor'
                  isSearchable
                  required
                />
              </div>

              {/* Admission (optional) */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
                  Admission{' '}
                  <span className='text-gray-400 font-normal'>(optional)</span>
                </label>
                <Select styles={getSelectStyles()}
                  options={admissions.map((a) => ({
                    value: a._id,
                    label: `${a.patient?.name} - ${new Date(a.admissionDate).toLocaleDateString()}`,
                  }))}
                  value={
                    admissions
                      .map((a) => ({
                        value: a._id,
                        label: `${a.patient?.name} - ${new Date(a.admissionDate).toLocaleDateString()}`,
                      }))
                      .find((o) => o.value === formData.admission) || null
                  }
                  onChange={(s) =>
                    setFormData({ ...formData, admission: s ? s.value : null })
                  }
                  placeholder='Select Admission'
                  isSearchable
                  isClearable
                />
              </div>

              {/* Appointment (optional) */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
                  Appointment{' '}
                  <span className='text-gray-400 font-normal'>(optional)</span>
                </label>
                <Select styles={getSelectStyles()}
                  options={appointments.map((a) => ({
                    value: a._id,
                    label: `${a.patient?.name} - ${new Date(a.date).toLocaleDateString()}`,
                  }))}
                  value={
                    appointments
                      .map((a) => ({
                        value: a._id,
                        label: `${a.patient?.name} - ${new Date(a.date).toLocaleDateString()}`,
                      }))
                      .find((o) => o.value === formData.appointment) || null
                  }
                  onChange={(s) =>
                    setFormData({
                      ...formData,
                      appointment: s ? s.value : null,
                    })
                  }
                  placeholder='Select Appointment'
                  isSearchable
                  isClearable
                />
              </div>

              {/* Due Date */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Due Date</label>
                <input
                  type='date'
                  className='w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Status</label>
                <select
                  className='w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }>
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Overdue</option>
                </select>
              </div>

              {/* Services */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Services</label>
                <div className='space-y-2'>
                  {formData.services.map((s, i) => (
                    <div
                      key={i}
                      className='flex gap-2 items-center'>
                      <select
                        className='flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={s.name}
                        onChange={(e) =>
                          updateService(i, 'name', e.target.value)
                        }>
                        {SERVICE_TYPES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                      <input
                        type='number'
                        placeholder='Amount'
                        className='w-28 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                        value={s.amount}
                        onChange={(e) =>
                          updateService(i, 'amount', e.target.value)
                        }
                        required
                      />
                      {formData.services.length > 1 && (
                        <button
                          type='button'
                          onClick={() => removeService(i)}
                          className='text-red-500 hover:text-red-700'>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type='button'
                  onClick={addService}
                  className='mt-2 text-blue-600 text-sm hover:underline'>
                  + Add Service
                </button>
                <p className='text-right font-semibold mt-2'>
                  Total: ${totalAmount.toLocaleString()}
                </p>
              </div>

              <div className='flex justify-end pt-3'>
                <button className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                  {mode === 'add' ? 'Create Invoice' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingModal;
