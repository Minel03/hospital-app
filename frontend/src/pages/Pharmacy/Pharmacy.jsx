import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Title from '../../components/Title';
import SummaryStats from '../../components/SummaryStats';

const {
  Package,
  Clipboard,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Calendar,
} = Icons;

const Pharmacy = () => {
  const { axios } = useAppContext();
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/pharmacy/inventory/add', formData);
      if (res.data.success) {
        toast.success('Medicine added successfully');
        setShowAddMedicine(false);
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
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Pending Prescriptions', 
      value: prescriptions.length, 
      icon: Clipboard,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      label: 'Low Stock Items', 
      value: inventory.filter(m => m.stock < 10).length, 
      icon: AlertTriangle,
      bgColor: 'bg-red-50 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-400'
    },
    { 
      label: 'Expired/Near Expiry', 
      value: inventory.filter(m => new Date(m.expiryDate) < new Date(Date.now() + 30*24*60*60*1000)).length, 
      icon: Calendar,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <Title
          title='Pharmacy Management'
          subtitle='Manage medicine inventory and digital prescriptions'
        />

        {activeTab === 'inventory' && (
          <button
            onClick={() => setShowAddMedicine(!showAddMedicine)}
            className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none font-bold'>
            {showAddMedicine ? (
              <Clipboard className='w-5 h-5' />
            ) : (
              <Plus className='w-5 h-5' />
            )}
            {showAddMedicine ? 'View List' : 'Add New Medicine'}
          </button>
        )}
      </div>

      <SummaryStats stats={stats} />

      {/* Tabs */}
      <div className='flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit'>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Package className='w-4 h-4' />
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'prescriptions' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
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
        <>
          {showAddMedicine ? (
            <div className='bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl max-w-2xl mx-auto'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-6'>
                Add Medicine to Stock
              </h3>
              <form
                onSubmit={handleAddMedicine}
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
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-2xl focus:ring-2 focus:ring-blue-500'
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
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-2xl focus:ring-2 focus:ring-blue-500'
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
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-2xl focus:ring-2 focus:ring-blue-500'>
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
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-2xl focus:ring-2 focus:ring-blue-500'
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
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border rounded-2xl focus:ring-2 focus:ring-blue-500'
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
                      className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white scheme-light dark:scheme-dark'
                    />
                  </div>
                </div>
                <div className='md:col-span-2 mt-4'>
                  <button
                    type='submit'
                    className='w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none'>
                    Add to Inventory
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden'>
              <div className='p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                <div className='relative flex-1 max-w-md'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search medicines...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500'
                  />
                </div>
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
                    {filteredInventory.map((m) => (
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
                            <span className='flex items-center gap-1 text-green-600 text-xs font-bold'>
                              <CheckCircle className='w-4 h-4' /> In Stock
                            </span>
                          ) : m.stock > 0 ? (
                            <span className='flex items-center gap-1 text-orange-600 text-xs font-bold'>
                              <AlertTriangle className='w-4 h-4' /> Low Stock
                            </span>
                          ) : (
                            <span className='flex items-center gap-1 text-red-600 text-xs font-bold'>
                              <X className='w-4 h-4' /> Out of Stock
                            </span>
                          )}
                        </td>
                        <td className='px-6 py-4 text-right space-x-2'>
                          <button className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors'>
                            <Edit className='w-4 h-4' />
                          </button>
                          <button className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors'>
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {prescriptions.map((p) => (
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

              <button
                onClick={() => handleDispense(p._id)}
                className='w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2'>
                <CheckCircle className='w-5 h-5' />
                Dispense Medicines
              </button>
            </div>
          ))}
          {prescriptions.length === 0 && (
            <div className='col-span-full py-20 text-center text-gray-500'>
              <Clipboard className='w-12 h-12 mx-auto mb-4 opacity-20' />
              <p>No pending prescriptions found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pharmacy;
