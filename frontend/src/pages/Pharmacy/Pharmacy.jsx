import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import PageHeader from '../../components/PageHeader';
import SearchBar from '../../components/SearchBar';
import PharmacyModal from './components/PharmacyModal';
import Pagination from '../../components/Pagination';

const {
  Package,
  Clipboard,
  AlertTriangle,
  Calendar,
  Edit,
  Trash2,
  CheckCircle,
} = Icons;

const Pharmacy = () => {
  const { axios, userData } = useAppContext();
  const isPharmacist = ['admin', 'pharmacist'].includes(userData?.role);
  const isAdmin = userData?.role === 'admin';
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Tablet',
    stock: 0,
    price: 0,
    expiryDate: '',
    manufacturer: '',
  });

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pharmacy/inventory');
      if (res.data.success) setInventory(res.data.medicines);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/pharmacy/prescriptions/pending');
      if (res.data.success) setPrescriptions(res.data.prescriptions);
    } catch (err) {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') fetchInventory();
    else fetchPrescriptions();
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/pharmacy/inventory/add', formData);
      if (res.data.success) {
        toast.success('Medicine added successfully');
        setShowModal(false);
        fetchInventory();
        setFormData({
          name: '',
          brand: '',
          category: 'Tablet',
          stock: 0,
          price: 0,
          expiryDate: '',
          manufacturer: '',
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Error adding medicine');
    }
  };

  const handleDispense = async (id) => {
    if (
      !window.confirm(
        'Mark this prescription as dispensed? This will deduct stock.',
      )
    )
      return;
    try {
      const res = await axios.post('/api/pharmacy/dispense', { id });
      if (res.data.success) {
        toast.success('Prescription dispensed');
        fetchPrescriptions();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Dispensing failed');
    }
  };

  const filteredInventory = inventory.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const stats = [
    {
      label: 'Total Medicines',
      value: inventory.length,
      icon: Package,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Pending Prescriptions',
      value: prescriptions.length,
      icon: Clipboard,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Low Stock Items',
      value: inventory.filter((m) => m.stock < 10).length,
      icon: AlertTriangle,
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Expired/Near Expiry',
      value: inventory.filter(
        (m) =>
          new Date(m.expiryDate) <
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      ).length,
      icon: Calendar,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <PageHeader
        title='Pharmacy Management'
        subtitle='Manage medicine inventory and digital prescriptions'
        buttonLabel={
          activeTab === 'inventory' && isPharmacist ? 'Add Medicine' : ''
        }
        onButtonClick={isPharmacist ? () => setShowModal(true) : null}
        stats={stats}
      />

      {/* Tabs */}
      <div className='flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit'>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-semibold ${activeTab === 'inventory' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className='w-4 h-4' />
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all font-semibold ${activeTab === 'prescriptions' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Clipboard className='w-4 h-4' />
          Prescriptions
          {prescriptions.length > 0 && (
            <span className='ml-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full'>
              {prescriptions.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
          <div className='p-6 border-b border-gray-100 dark:border-gray-700'>
            <SearchBar
              placeholder='Search medicines...'
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full text-left'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider'>
                  <th className='px-6 py-4'>Medicine</th>
                  <th className='px-6 py-4'>Category</th>
                  <th className='px-6 py-4'>Stock</th>
                  <th className='px-6 py-4'>Price</th>
                  <th className='px-6 py-4'>Expiry</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                {filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((m) => (
                  <tr
                    key={m._id}
                    className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='font-bold text-gray-900 dark:text-white'>
                        {m.name}
                      </div>
                      <div className='text-xs text-gray-500'>{m.brand}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <span className='px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full font-medium'>
                        {m.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 font-semibold text-gray-700 dark:text-gray-300'>
                      {m.stock}
                    </td>
                    <td className='px-6 py-4 font-semibold text-blue-600 dark:text-blue-400'>
                      ${m.price}
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400'>
                      {new Date(m.expiryDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4'>
                      {m.stock > 20 ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-100 dark:border-green-800/50'>
                          <CheckCircle className='w-3.5 h-3.5' /> In Stock
                        </span>
                      ) : m.stock > 0 ? (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-[10px] font-bold uppercase tracking-wider border border-orange-100 dark:border-orange-800/50 animate-pulse'>
                          <AlertTriangle className='w-3.5 h-3.5' /> Low Stock
                        </span>
                      ) : (
                        <span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-100 dark:border-red-800/50'>
                          <AlertTriangle className='w-3.5 h-3.5' /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-right space-x-2'>
                      {isPharmacist && (
                        <button className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors'>
                          <Edit className='w-4 h-4' />
                        </button>
                      )}
                      {isAdmin && (
                        <button className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      )}
                      {!isPharmacist && !isAdmin && (
                        <span className='text-xs text-gray-400 italic font-medium'>
                          View Only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='p-6'>
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredInventory.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              totalItems={filteredInventory.length}
            />
          </div>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {prescriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((p) => (
              <div
                key={p._id}
                className='bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 font-bold'>
                      {p.patient.name[0]}
                    </div>
                    <div>
                      <div className='font-bold text-gray-900 dark:text-white line-clamp-1'>
                        {p.patient.name}
                      </div>
                      <div className='text-xs text-gray-500'>
                        By Dr. {p.doctor.name}
                      </div>
                    </div>
                  </div>
                  <span className='px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold uppercase rounded-md tracking-wider'>
                    Pending
                  </span>
                </div>

                <div className='space-y-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl'>
                  {p.items.map((item, i) => (
                    <div
                      key={i}
                      className='flex justify-between items-start'>
                      <div className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                        {item.medicine.name}
                        <div className='text-[10px] text-gray-500 font-normal'>
                          {item.dosage} ({item.duration})
                        </div>
                      </div>
                      <div className='text-sm font-bold text-gray-900 dark:text-white'>
                        x{item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {isPharmacist ? (
                  <button
                    onClick={() => handleDispense(p._id)}
                    className='w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2'>
                    <CheckCircle className='w-5 h-5' />
                    Dispense Medicines
                  </button>
                ) : (
                  <div className='w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-3 rounded-2xl font-bold text-center flex items-center justify-center gap-2 cursor-not-allowed'>
                    <AlertTriangle className='w-5 h-5' />
                    Pharmacist Access Only
                  </div>
                )}
              </div>
            ))}
            {prescriptions.length === 0 && (
              <div className='col-span-full py-20 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700'>
                <Clipboard className='w-12 h-12 mx-auto mb-4 opacity-20 text-gray-400' />
                <p className='font-medium'>No pending prescriptions found.</p>
              </div>
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(prescriptions.length / itemsPerPage)}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalItems={prescriptions.length}
          />
        </>
      )}

      <PharmacyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleAddMedicine}
      />
    </div>
  );
};

export default Pharmacy;
