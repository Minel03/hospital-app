import React from 'react';
import Select from 'react-select';

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
  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: d.name,
  }));
  return (
    <div>
      {/* --- Room Modal --- */}
      {showRoomModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-lg font-semibold mb-4'>
              {roomMode === 'add' ? 'Add Room' : 'Edit Room'}
            </h2>
            <form
              onSubmit={handleRoomSubmit}
              className='space-y-3'>
              <input
                type='text'
                placeholder='Room Number'
                value={roomForm.roomNumber}
                required
                onChange={(e) =>
                  setRoomForm({ ...roomForm, roomNumber: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'
              />
              <input
                type='text'
                placeholder='Floor'
                value={roomForm.floor}
                required
                onChange={(e) =>
                  setRoomForm({ ...roomForm, floor: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'
              />
              <select
                value={roomForm.type}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, type: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'>
                <option>General</option>
                <option>ICU</option>
                <option>Private</option>
                <option>Semi-Private</option>
                <option>Emergency</option>
              </select>
              <Select
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
                required // note: react-select doesn't natively support HTML required
                classNamePrefix='react-select'
              />
              <input
                type='number'
                placeholder='Capacity'
                value={roomForm.capacity}
                required
                onChange={(e) =>
                  setRoomForm({ ...roomForm, capacity: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'
              />
              <div className='flex justify-end gap-2 mt-4'>
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

      {/* --- Bed Modal --- */}
      {showBedModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-xl p-6 w-full max-w-md'>
            <h2 className='text-lg font-semibold mb-4'>
              {bedMode === 'add' ? 'Add Bed(s)' : 'Edit Bed'}
            </h2>
            <form
              onSubmit={handleBedSubmit}
              className='space-y-3'>
              <select
                value={bedForm.roomId}
                required
                onChange={(e) =>
                  setBedForm({ ...bedForm, roomId: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'>
                <option value=''>Select Room</option>
                {rooms.map((r) => (
                  <option
                    key={r._id}
                    value={r._id}>
                    {r.roomNumber} - {r.type}
                  </option>
                ))}
              </select>
              {bedMode === 'add' && (
                <input
                  type='number'
                  min={1}
                  value={bedForm.numberOfBeds}
                  required
                  onChange={(e) =>
                    setBedForm({ ...bedForm, numberOfBeds: e.target.value })
                  }
                  placeholder='Number of Beds'
                  className='w-full border px-3 py-2 rounded-lg'
                />
              )}
              <select
                value={bedForm.status}
                onChange={(e) =>
                  setBedForm({ ...bedForm, status: e.target.value })
                }
                className='w-full border px-3 py-2 rounded-lg'>
                <option>Available</option>
                <option>Occupied</option>
                <option>Under Maintenance</option>
              </select>
              <div className='flex justify-end gap-2 mt-4'>
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
    </div>
  );
};

export default BedsModal;
