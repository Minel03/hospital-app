import React from 'react';
import Select from 'react-select';

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
  return (
    <div>
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg w-125'>
            <h3 className='text-xl font-semibold mb-4'>
              {mode === 'add' ? 'New Admission' : 'Edit Admission'}
            </h3>

            <form
              onSubmit={handleSubmit}
              className='space-y-3'>
              {/* PATIENT */}
              <div>
                <label className='block mb-1 font-medium'>Patient</label>
                <Select
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
                <label className='block mb-1 font-medium'>Doctor</label>
                <Select
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
                <label className='block mb-1 font-medium'>Department</label>
                <Select
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
                <label className='block mb-1 font-medium'>Bed</label>
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
                    option: (provided, state) => {
                      let bgColor = '#d1fae5'; // green-100 for Available
                      let textColor = '#047857'; // green-700

                      if (state.data.status === 'Occupied') {
                        bgColor = '#fee2e2'; // red-100
                        textColor = '#b91c1c'; // red-700
                      } else if (state.data.status === 'Reserved') {
                        bgColor = '#fef3c7'; // yellow-100
                        textColor = '#78350f'; // yellow-700
                      }

                      return {
                        ...provided,
                        backgroundColor: state.isFocused ? bgColor : 'white',
                        color: textColor,
                        padding: 10,
                      };
                    },
                    singleValue: (provided) => {
                      const status =
                        beds.find((b) => b._id === formData.bed)?.status ||
                        'Occupied';
                      return {
                        ...provided,
                        color:
                          status === 'Occupied'
                            ? '#b91c1c'
                            : status === 'Reserved'
                              ? '#78350f'
                              : '#047857',
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
                <label className='block mb-1 font-medium'>
                  Admission Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full border p-2 rounded'
                  value={formData.admissionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDate: e.target.value })
                  }
                  required
                />
              </div>

              {/* EXPECTED DISCHARGE DATE & TIME */}
              <div>
                <label className='block mb-1 font-medium'>
                  Expected Discharge Date & Time
                </label>
                <input
                  type='datetime-local'
                  className='w-full border p-2 rounded'
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
                <label className='block mb-1 font-medium'>Diagnosis</label>
                <textarea
                  className='w-full border p-2 rounded'
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
                  type='button'
                  onClick={closeModal}
                  className='border px-4 py-2 rounded'>
                  Cancel
                </button>
                <button className='bg-blue-600 text-white px-4 py-2 rounded'>
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
