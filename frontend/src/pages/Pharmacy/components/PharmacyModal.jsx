import React from 'react';
import Modal from '../../../components/Modal';
import { Icons, useAppContext } from '../../../context/AppContext';

const PharmacyModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  handleSubmit,
  mode = 'add',
}) => {
  const { Calendar } = Icons;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add Medicine to Stock' : 'Edit Medicine'}
    >
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Medicine Name
          </label>
          <input
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className='w-full px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            placeholder='e.g. Paracetamol'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Brand Name
          </label>
          <input
            value={formData.brand}
            onChange={(e) =>
              setFormData({ ...formData, brand: e.target.value })
            }
            className='w-full px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
            placeholder='e.g. Tylenol'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className='w-full px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'>
            <option>Tablet</option>
            <option>Capsule</option>
            <option>Syrup</option>
            <option>Injection</option>
            <option>Cream</option>
          </select>
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Stock Quantity
          </label>
          <input
            type='number'
            required
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
            className='w-full px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Unit Price
          </label>
          <input
            type='number'
            required
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className='w-full px-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
            Expiry Date
          </label>
          <div className='relative'>
            <Calendar className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
            <input
              type='date'
              required
              value={formData.expiryDate}
              onChange={(e) =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className='w-full pl-12 pr-4 py-3 border border-gray-100 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium scheme-light dark:scheme-dark'
            />
          </div>
        </div>
        <div className='md:col-span-2 mt-4'>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none'>
            {mode === 'add' ? 'Add to Inventory' : 'Update Medicine'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PharmacyModal;
