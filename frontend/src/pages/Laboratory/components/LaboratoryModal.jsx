import React from 'react';
import Modal from '../../../components/Modal';

const LaboratoryModal = ({
  isOpen,
  onClose,
  testData,
  setTestData,
  handleSubmit,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Add New Lab Test'
    >
      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Test Name
          </label>
          <input
            required
            value={testData.name}
            onChange={(e) =>
              setTestData({ ...testData, name: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'
          />
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Category
          </label>
          <select
            value={testData.category}
            onChange={(e) =>
              setTestData({ ...testData, category: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'>
            <option>Blood</option>
            <option>Urine</option>
            <option>Imaging</option>
            <option>Neurology</option>
          </select>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
              Normal Range
            </label>
            <input
              required
              value={testData.normalRange}
              onChange={(e) =>
                setTestData({ ...testData, normalRange: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'
            />
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
              Unit
            </label>
            <input
              required
              value={testData.unit}
              onChange={(e) =>
                setTestData({ ...testData, unit: e.target.value })
              }
              className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'
            />
          </div>
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block'>
            Cost ($)
          </label>
          <input
            type='number'
            required
            value={testData.price}
            onChange={(e) =>
              setTestData({ ...testData, price: e.target.value })
            }
            className='w-full px-4 py-2 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium'
          />
        </div>
        <div className='pt-4'>
          <button
            type='submit'
            className='w-full bg-purple-600 text-white py-3 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none'>
            Save Test
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LaboratoryModal;
