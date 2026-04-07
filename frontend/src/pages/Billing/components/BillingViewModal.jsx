import React from 'react';

const BillingViewModal = ({ showModal, setShowModal, invoice }) => {
  if (!showModal || !invoice) return null;

  return (
    <div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto'>
        <h2 className='text-lg font-bold mb-4'>
          Invoice #{invoice._id.slice(-6).toUpperCase()}
        </h2>

        <p>
          <strong>Patient:</strong> {invoice.patient?.name || 'N/A'}
        </p>
        <p>
          <strong>Doctor:</strong> {invoice.doctor?.name || 'N/A'}
        </p>
        <p>
          <strong>Status:</strong> {invoice.status}
        </p>
        <p>
          <strong>Due Date:</strong>{' '}
          {new Date(invoice.dueDate).toLocaleDateString()}
        </p>

        <div className='mt-4'>
          <h3 className='font-bold mb-2'>Services:</h3>
          <ul className='list-disc list-inside'>
            {invoice.services.map((s, idx) => (
              <li key={idx}>
                {s.name} - ${parseFloat(s.amount).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <p className='mt-4 font-semibold'>
          Total: ${invoice.totalAmount.toLocaleString()}
        </p>

        <button
          onClick={() => setShowModal(false)}
          className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
          Close
        </button>
      </div>
    </div>
  );
};

export default BillingViewModal;
