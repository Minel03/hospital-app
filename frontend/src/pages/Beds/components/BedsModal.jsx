import React from 'react';
import Select from 'react-select';
import { useAppContext } from '../../../context/AppContext';

const BedsModal = ({
  showRoomModal,
  showBedModal,
  roomMode,
  handleRoomSubmit,
  handleBedSubmit,
  roomForm,
  setRoomForm,
  bedForm,
  setBedForm,
  setShowRoomModal,
  setShowBedModal,
  departments,
  rooms,
  bedMode,
}) => {
  const { getSelectStyles } = useAppContext();
  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: d.name,
  }));

  return (
    <>
      {/* ---------------- ROOM MODAL ---------------- */}
      {showRoomModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700'>
            {/* Header */}
            <div className='flex justify-between items-center px-6 py-4'>
              <h2 className='text-lg font-semibold'>
                {roomMode === 'add' ? 'Add Room' : 'Edit Room'}
              </h2>

              <button
                onClick={() => setShowRoomModal(false)}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-300'>
                ✕
              </button>
            </div>

            <form
              onSubmit={handleRoomSubmit}
              className='p-6 space-y-4'>
              {/* Room Number */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Room Number
                </label>
                <input
                  type='text'
                  value={roomForm.roomNumber}
                  required
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, roomNumber: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Enter room number'
                />
              </div>

              {/* Floor */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Floor
                </label>
                <input
                  type='number'
                  value={roomForm.floor}
                  required
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, floor: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Floor number'
                />
              </div>

              {/* Room Type */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Room Type
                </label>
                <select
                  value={roomForm.type}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, type: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option>General</option>
                  <option>ICU</option>
                  <option>Private</option>
                  <option>Semi-Private</option>
                  <option>Emergency</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Department
                </label>

                <Select styles={getSelectStyles()}
                  options={departmentOptions}
                  value={
                    departmentOptions.find(
                      (o) => o.value === roomForm.department,
                    ) || null
                  }
                  onChange={(selected) =>
                    setRoomForm({
                      ...roomForm,
                      department: selected?.value || '',
                    })
                  }
                  placeholder='Select Department'
                  isClearable
                  className='mt-1'
                />
              </div>

              {/* Capacity */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Capacity
                </label>

                <input
                  type='number'
                  value={roomForm.capacity}
                  required
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, capacity: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='Number of beds'
                />
              </div>

              {/* Buttons */}
              <div className='flex justify-end gap-2 pt-3'>
                <button
                  type='button'
                  onClick={() => setShowRoomModal(false)}
                  className='px-4 py-2 rounded-lg border hover:bg-gray-100'>
                  Cancel
                </button>

                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                  {roomMode === 'add' ? 'Add Room' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- BED MODAL ---------------- */}
      {showBedModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto dark:border dark:border-gray-700'>
            {/* Header */}
            <div className='flex justify-between items-center border-b px-6 py-4'>
              <h2 className='text-lg font-semibold'>
                {bedMode === 'add' ? 'Add Bed(s)' : 'Edit Bed'}
              </h2>

              <button
                onClick={() => setShowBedModal(false)}
                className='text-gray-500 hover:text-gray-700 dark:text-gray-300'>
                ✕
              </button>
            </div>

            <form
              onSubmit={handleBedSubmit}
              className='p-6 space-y-4'>
              {/* Room */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Room
                </label>

                <select
                  value={bedForm.roomId}
                  required
                  onChange={(e) =>
                    setBedForm({ ...bedForm, roomId: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option value=''>Select Room</option>
                  {rooms.map((r) => (
                    <option
                      key={r._id}
                      value={r._id}>
                      {r.roomNumber} - {r.type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Beds (only when adding) */}
              {bedMode === 'add' && (
                <div>
                  <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Number of Beds
                  </label>

                  <input
                    type='number'
                    min={1}
                    value={bedForm.numberOfBeds}
                    required
                    onChange={(e) =>
                      setBedForm({
                        ...bedForm,
                        numberOfBeds: e.target.value,
                      })
                    }
                    className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter number of beds'
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Status
                </label>

                <select
                  value={bedForm.status}
                  onChange={(e) =>
                    setBedForm({ ...bedForm, status: e.target.value })
                  }
                  className='mt-1 w-full border border-gray-300 dark:border-gray-600 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Under Maintenance</option>
                </select>
              </div>

              {/* Buttons */}
              <div className='flex justify-end gap-2 pt-3'>
                <button
                  type='button'
                  onClick={() => setShowBedModal(false)}
                  className='px-4 py-2 rounded-lg border hover:bg-gray-100'>
                  Cancel
                </button>

                <button
                  type='submit'
                  className='px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700'>
                  {bedMode === 'add' ? 'Add Bed(s)' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BedsModal;
