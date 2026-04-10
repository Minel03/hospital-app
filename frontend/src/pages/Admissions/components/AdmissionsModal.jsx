import React from 'react';
import Select from 'react-select';
import { useAppContext } from '../../../context/AppContext';

const AdmissionsModal = ({
  showModal,
  mode,
  formData,
  setFormData,
  handleSubmit,
  closeModal,
  patients,
  doctors,
  departments,
  beds,
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
                {mode === 'add' ? 'New Admission' : 'Edit Admission'}
              </h3>
              <button
                type='button'
                onClick={closeModal}
                className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors'>
                <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-3'>
              {/* PATIENT */}
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
                      .find((opt) => opt.value === formData.patient) || null
                  }
                  onChange={(selected) =>
                    setFormData({ ...formData, patient: selected?.value || '' })
                  }
                  placeholder='Select Patient'
                  isSearchable
                  required
                />
              </div>

              {/* DOCTOR */}
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
                      .find((opt) => opt.value === formData.doctor) || null
                  }
                  onChange={(selected) =>
                    setFormData({ ...formData, doctor: selected?.value || '' })
                  }
                  placeholder='Select Doctor'
                  isSearchable
                  required
                />
              </div>

              {/* DEPARTMENT */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Department</label>
                <Select styles={getSelectStyles()}
                  options={departments.map((d) => ({
                    value: d._id,
                    label: d.name,
                  }))}
                  value={
                    departments
                      .map((d) => ({ value: d._id, label: d.name }))
                      .find((opt) => opt.value === formData.department) || null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      department: selected?.value || '',
                    })
                  }
                  placeholder='Select Department'
                  isSearchable
                  required
                />
              </div>

              {/* BED */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Bed</label>
                <Select
                  options={[
                    // Only available beds + current bed (for edit)
                    ...beds
                      .filter(
                        (b) =>
                          b.status === 'Available' ||
                          (mode === 'edit' && b._id === formData.bed),
                      )
                      .map((b) => ({
                        value: b._id,
                        label: `Room ${b.room?.roomNumber || 'N/A'} - Bed ${b.bedNumber}`,
                        status: b.status,
                      })),
                  ]}
                  value={
                    [
                      ...beds
                        .filter(
                          (b) =>
                            b.status === 'Available' ||
                            (mode === 'edit' && b._id === formData.bed),
                        )
                        .map((b) => ({
                          value: b._id,
                          label: `Room ${b.room?.roomNumber || 'N/A'} - Bed ${b.bedNumber}`,
                          status: b.status,
                        })),
                    ].find((opt) => opt.value === formData.bed) || null
                  }
                  onChange={(selected) =>
                    setFormData({ ...formData, bed: selected?.value || '' })
                  }
                  placeholder='Select Bed'
                  isSearchable
                  required
                  styles={{
                    ...getSelectStyles(),
                    option: (provided, state) => {
                      const baseStyles = getSelectStyles().option(provided, state);
                      let bgColor = '#d1fae5'; // green-100 for Available
                      let textColor = '#047857'; // green-700
                      const isDark = document.documentElement.classList.contains('dark');

                      if (state.data.status === 'Occupied') {
                        bgColor = isDark ? '#450a0a' : '#fee2e2'; // red-900 or red-100
                        textColor = isDark ? '#f87171' : '#b91c1c'; // red-400 or red-700
                      } else if (state.data.status === 'Reserved') {
                        bgColor = isDark ? '#451a03' : '#fef3c7'; // orange-900 or yellow-100
                        textColor = isDark ? '#fb923c' : '#78350f'; // orange-400 or yellow-700
                      } else if (state.data.status === 'Available') {
                        bgColor = isDark ? '#064e3b' : '#d1fae5'; // green-900 or green-100
                        textColor = isDark ? '#34d399' : '#047857'; // green-400 or green-700
                      }

                      return {
                        ...baseStyles,
                        backgroundColor: state.isFocused ? bgColor : baseStyles.backgroundColor,
                        color: textColor,
                        padding: 10,
                      };
                    },
                    singleValue: (provided) => {
                      const baseStyles = getSelectStyles().singleValue(provided);
                      const status =
                        beds.find((b) => b._id === formData.bed)?.status ||
                        'Occupied';
                      
                      const isDark = document.documentElement.classList.contains('dark');
                      let color = '#047857';
                      if (status === 'Occupied') color = isDark ? '#f87171' : '#b91c1c';
                      else if (status === 'Reserved') color = isDark ? '#fb923c' : '#78350f';
                      else if (status === 'Available') color = isDark ? '#34d399' : '#047857';

                      return {
                        ...baseStyles,
                        color: color,
                      };
                    },
                  }}
                  formatOptionLabel={(option) => (
                    <div className='flex justify-between items-center'>
                      <span>{option.label}</span>
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          option.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : option.status === 'Occupied'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {option.status}
                      </span>
                    </div>
                  )}
                />
              </div>

              {/* ADMISSION DATE & TIME */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
                  Admission Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:light] dark:[color-scheme:dark]'
                  value={formData.admissionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* EXPECTED DISCHARGE DATE & TIME */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
                  Expected Discharge Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:light] dark:[color-scheme:dark]'
                  value={formData.expectedDischargeDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expectedDischargeDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* DIAGNOSIS */}
              <div>
                <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>Diagnosis</label>
                <textarea
                  className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  required
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className='flex justify-end gap-3 pt-3'>
                <button 
                  type='submit'
                  className='bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                  {mode === 'add' ? 'Admit Patient' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionsModal;
