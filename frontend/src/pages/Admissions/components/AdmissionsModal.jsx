import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';
import Select from 'react-select';
import QuickAddPatientModal from '../../../components/QuickAddPatientModal';

const AdmissionsModal = ({
  showModal,
  mode,
  formData,
  setFormData,
  handleSubmit,
  closeModal,
  doctors,
  departments,
  beds,
}) => {
  const { getSelectStyles, setPatients, patients } = useAppContext();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handlePatientCreated = (newPatient) => {
    setPatients((prev) => (prev ? [...prev, newPatient] : [newPatient]));
    setFormData((prev) => ({ ...prev, patient: newPatient._id }));
  };

  return (
    <>
      <Modal
      isOpen={showModal}
      onClose={closeModal}
      title={mode === 'add' ? 'New Admission' : 'Edit Admission'}>
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        {/* PATIENT */}
        <div>
          <div className='flex items-center justify-between mb-1'>
            <label className='font-medium text-gray-700 dark:text-gray-300'>Patient</label>
            <button
              type='button'
              onClick={() => setShowQuickAdd(true)}
              className='text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1'>
              + New Patient
            </button>
          </div>
          <Select
            styles={getSelectStyles()}
            options={patients?.map((p) => ({
              value: p._id,
              label: p.name,
            }))}
            value={
              formData.patient
                ? {
                    value: formData.patient,
                    label: patients?.find((p) => p._id === formData.patient)
                      ?.name,
                  }
                : null
            }
            onChange={(selected) =>
              setFormData({ ...formData, patient: selected?.value || '' })
            }
            placeholder='Select Patient'
            isSearchable
          />
        </div>

        {/* DOCTOR */}
        <div>
          <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Doctor
          </label>
          <Select
            styles={getSelectStyles()}
            options={doctors?.map((d) => ({
              value: d._id,
              label: d.name,
            }))}
            value={
              formData.doctor
                ? {
                    value: formData.doctor,
                    label: doctors?.find((d) => d._id === formData.doctor)
                      ?.name,
                  }
                : null
            }
            onChange={(selected) =>
              setFormData({ ...formData, doctor: selected?.value || '' })
            }
            placeholder='Select Doctor'
            isSearchable
          />
        </div>

        {/* DEPARTMENT */}
        <div>
          <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Department
          </label>
          <Select
            styles={getSelectStyles()}
            options={departments?.map((d) => ({
              value: d._id,
              label: d.name,
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
              setFormData({
                ...formData,
                department: selected?.value || '',
              })
            }
            placeholder='Select Department'
            isSearchable
          />
        </div>

        {/* BED */}
        <div>
          <label className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Bed
          </label>
          <Select
            options={beds
              ?.filter(
                (b) =>
                  b.status === 'Available' ||
                  (mode === 'edit' && b._id === formData.bed),
              )
              .map((b) => ({
                value: b._id,
                label: `Room ${b.room?.roomNumber || 'N/A'} - Bed ${b.bedNumber}`,
                status: b.status,
              }))}
            value={
              formData.bed
                ? (() => {
                    const b = beds?.find((bed) => bed._id === formData.bed);
                    return b
                      ? {
                          value: b._id,
                          label: `Room ${b.room?.roomNumber || 'N/A'} - Bed ${b.bedNumber}`,
                          status: b.status,
                        }
                      : null;
                  })()
                : null
            }
            onChange={(selected) =>
              setFormData({ ...formData, bed: selected?.value || '' })
            }
            placeholder='Select Bed'
            isSearchable
            styles={{
              ...getSelectStyles(),
              option: (provided, state) => {
                const baseStyles = getSelectStyles().option(provided, state);
                let bgColor = '#d1fae5'; // green-100 for Available
                let textColor = '#047857'; // green-700
                const isDark =
                  document.documentElement.classList.contains('dark');

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
                  backgroundColor: state.isFocused
                    ? bgColor
                    : baseStyles.backgroundColor,
                  color: textColor,
                  padding: 10,
                };
              },
              singleValue: (provided) => {
                const baseStyles = getSelectStyles().singleValue(provided);
                const status =
                  beds.find((b) => b._id === formData.bed)?.status ||
                  'Occupied';

                const isDark =
                  document.documentElement.classList.contains('dark');
                let color = '#047857';
                if (status === 'Occupied')
                  color = isDark ? '#f87171' : '#b91c1c';
                else if (status === 'Reserved')
                  color = isDark ? '#fb923c' : '#78350f';
                else if (status === 'Available')
                  color = isDark ? '#34d399' : '#047857';

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
          <label
            htmlFor='admissionDate'
            className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Admission Date & Time
          </label>
          <input
            id='admissionDate'
            type='datetime-local'
            className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 scheme-light dark:scheme-dark'
            value={formData.admissionDate || ''}
            onChange={(e) =>
              setFormData({ ...formData, admissionDate: e.target.value })
            }
            required
          />
        </div>

        {/* EXPECTED DISCHARGE DATE & TIME */}
        <div>
          <label
            htmlFor='expectedDischargeDate'
            className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Expected Discharge Date & Time
          </label>
          <input
            id='expectedDischargeDate'
            type='datetime-local'
            className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 scheme-light dark:scheme-dark'
            value={formData.expectedDischargeDate || ''}
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
          <label
            htmlFor='diagnosis'
            className='block mb-1 font-medium text-gray-700 dark:text-gray-300'>
            Diagnosis
          </label>
          <textarea
            id='diagnosis'
            className='w-full border p-2 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-100 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={formData.diagnosis || ''}
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
            className='bg-blue-600 text-white px-6 py-2 rounded-2xl hover:bg-blue-700 transition-colors font-bold'>
            {mode === 'add' ? 'Admit Patient' : 'Update'}
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

export default AdmissionsModal;
