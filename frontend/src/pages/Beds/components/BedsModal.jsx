import Modal from '../../../components/Modal';
import { useAppContext } from '../../../context/AppContext';
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
  const { getSelectStyles } = useAppContext();
  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: d.name,
  }));

  return (
    <>
      {/* ---------------- ROOM MODAL ---------------- */}
      <Modal
        isOpen={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        title={roomMode === 'add' ? 'Add Room' : 'Edit Room'}>
        <form
          onSubmit={handleRoomSubmit}
          className='space-y-4'>
          {/* Room Number */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Room Number
            </label>
            <input
              type='text'
              value={roomForm.roomNumber}
              required
              onChange={(e) =>
                setRoomForm({ ...roomForm, roomNumber: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
              placeholder='Enter room number'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* Floor */}
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
                Floor
              </label>
              <input
                type='number'
                value={roomForm.floor}
                required
                onChange={(e) =>
                  setRoomForm({ ...roomForm, floor: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
                placeholder='Floor'
              />
            </div>

            {/* Capacity */}
            <div>
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
                Capacity
              </label>
              <input
                type='number'
                value={roomForm.capacity}
                required
                onChange={(e) =>
                  setRoomForm({ ...roomForm, capacity: e.target.value })
                }
                className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
                placeholder='Beds'
              />
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Room Type
            </label>
            <select
              value={roomForm.type}
              onChange={(e) =>
                setRoomForm({ ...roomForm, type: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option>General</option>
              <option>ICU</option>
              <option>Private</option>
              <option>Semi-Private</option>
              <option>Emergency</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Department
            </label>
            <Select
              styles={getSelectStyles()}
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
            />
          </div>

          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
              {roomMode === 'add' ? 'Add Room' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ---------------- BED MODAL ---------------- */}
      <Modal
        isOpen={showBedModal}
        onClose={() => setShowBedModal(false)}
        title={bedMode === 'add' ? 'Add Bed(s)' : 'Edit Bed'}>
        <form
          onSubmit={handleBedSubmit}
          className='p-6 space-y-4'>
          {/* Room */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Room
            </label>
            <select
              value={bedForm.roomId}
              required
              onChange={(e) =>
                setBedForm({ ...bedForm, roomId: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
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
              <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
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
                className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
                placeholder='Enter number of beds'
              />
            </div>
          )}

          {/* Status */}
          <div>
            <label className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block'>
              Status
            </label>
            <select
              value={bedForm.status}
              onChange={(e) =>
                setBedForm({ ...bedForm, status: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
              <option>Available</option>
              <option>Occupied</option>
              <option>Under Maintenance</option>
            </select>
          </div>

          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              className='bg-blue-600 text-white px-8 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
              {bedMode === 'add' ? 'Add Bed(s)' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default BedsModal;
