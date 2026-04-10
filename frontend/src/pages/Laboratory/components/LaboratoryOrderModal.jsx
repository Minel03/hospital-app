import React from 'react';
import Modal from '../../../components/Modal';

const LaboratoryOrderModal = ({
  isOpen,
  onClose,
  orderData,
  setOrderData,
  handleSubmit,
  patients,
  doctors,
  tests,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Create Lab Order'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Patient
          </label>
          <select
            required
            value={orderData.patient}
            onChange={(e) =>
              setOrderData({ ...orderData, patient: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'>
            <option value=''>Select Patient</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Doctor
          </label>
          <select
            required
            value={orderData.doctor}
            onChange={(e) =>
              setOrderData({ ...orderData, doctor: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'>
            <option value=''>Select Doctor</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                Dr. {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Lab Test
          </label>
          <select
            required
            value={orderData.test}
            onChange={(e) =>
              setOrderData({ ...orderData, test: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'>
            <option value=''>Select Test</option>
            {tests.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            className='w-full bg-purple-600 text-white py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none'>
            Create Order
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LaboratoryOrderModal;
