import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Title from '../../components/Title';
import SummaryStats from '../../components/SummaryStats';

const {
  FlaskConical,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Paperclip,
  Activity,
  Plus,
} = Icons;

const Laboratory = () => {
  const { axios } = useAppContext();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddTest, setShowAddTest] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [testData, setTestData] = useState({
    name: '',
    category: 'Blood',
    price: 0,
    normalRange: '',
    unit: '',
  });

  const [resultData, setResultData] = useState({
    resultValue: '',
    findings: '',
    status: 'Completed',
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/lab/orders/pending');
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to load lab orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchTests = async () => {
    try {
      const res = await axios.get('/api/lab/tests');
      if (res.data.success) setTests(res.data.tests);
    } catch (err) {
      toast.error('Failed to load test catalog');
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    else fetchTests();
  }, [activeTab]);

  const handleAddTest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/lab/tests/add', testData);
      if (res.data.success) {
        toast.success('Test added to catalog');
        setShowAddTest(false);
        fetchTests();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Error adding test');
    }
  };

  const handleUploadResults = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/lab/results/upload', {
        id: selectedOrder._id,
        ...resultData,
      });
      if (res.data.success) {
        toast.success('Lab results uploaded successfully');
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error('Failed to upload results');
    }
  };

  const stats = [
    { 
      label: 'Pending Orders', 
      value: orders.length, 
      icon: Clock,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    { 
      label: 'Test Catalog', 
      value: tests.length, 
      icon: FlaskConical,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      label: 'Completed Today', 
      value: 0, // Placeholder or calculated if data available
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Total Reports', 
      value: 'All Time', 
      icon: Activity,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <Title
          title='Laboratory & Diagnostics'
          subtitle='Manage test orders, diagnostic catalogs, and results entry'
        />

        {activeTab === 'catalog' && (
          <button
            onClick={() => setShowAddTest(!showAddTest)}
            className='flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none font-bold'>
            <Plus className='w-5 h-5' />
            <span>Add New Test</span>
          </button>
        )}
      </div>

      <SummaryStats stats={stats} />

      {/* Tabs */}
      <div className='flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit'>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Clock className='w-4 h-4' />
          Pending Orders
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all ${activeTab === 'catalog' ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <FlaskConical className='w-4 h-4' />
          Test Catalog
        </button>
      </div>

      {activeTab === 'orders' ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Orders List */}
          <div className='space-y-4'>
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border transition-all cursor-pointer ${selectedOrder?._id === order._id ? 'border-purple-500 ring-2 ring-purple-100 dark:ring-purple-900/30' : 'border-gray-100 dark:border-gray-700 hover:border-purple-300'}`}>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400'>
                    <FlaskConical className='w-6 h-6' />
                  </div>
                  <div>
                    <div className='font-bold text-gray-900 dark:text-white'>
                      {order.test.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {order.patient.name}
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-xs font-bold uppercase tracking-wider text-orange-500'>
                    {order.status}
                  </div>
                  <div className='text-[10px] text-gray-400'>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className='py-20 text-center text-gray-400 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700'>
                <Clock className='w-12 h-12 mx-auto mb-4 opacity-20' />
                <p>No pending test orders.</p>
              </div>
            )}
          </div>

          {/* Results Entry Form */}
          <div className='bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl h-fit'>
            {selectedOrder ? (
              <form
                onSubmit={handleUploadResults}
                className='space-y-6'>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white line-clamp-1'>
                    {selectedOrder.test.name}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    Patient: {selectedOrder.patient.name} | Ordered by: Dr.{' '}
                    {selectedOrder.doctor.name}
                  </p>
                </div>

                <div className='p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl'>
                  <div className='text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-1'>
                    Normal Range
                  </div>
                  <div className='text-sm text-gray-700 dark:text-gray-300 font-semibold'>
                    {selectedOrder.normalRangeSnapshot}
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Result Value
                  </label>
                  <input
                    required
                    value={resultData.resultValue}
                    onChange={(e) =>
                      setResultData({
                        ...resultData,
                        resultValue: e.target.value,
                      })
                    }
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-purple-500'
                    placeholder='e.g. 12.5 mg/dL'
                  />
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Lab Technician Findings
                  </label>
                  <textarea
                    rows='4'
                    value={resultData.findings}
                    onChange={(e) =>
                      setResultData({ ...resultData, findings: e.target.value })
                    }
                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-purple-500'
                    placeholder='Any observations...'
                  />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <button
                    type='button'
                    onClick={() => setSelectedOrder(null)}
                    className='py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all'>
                    Cancel
                  </button>
                  <button
                    type='submit'
                    className='bg-purple-600 text-white py-4 rounded-2xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 dark:shadow-none'>
                    Submit Results
                  </button>
                </div>
              </form>
            ) : (
              <div className='py-20 text-center text-gray-400'>
                <Activity className='w-12 h-12 mx-auto mb-4 opacity-20' />
                <p>Select an order from the list to enter results.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm'>
          <table className='w-full text-left'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider'>
                <th className='px-6 py-4'>Test Name</th>
                <th className='px-6 py-4'>Category</th>
                <th className='px-6 py-4'>Normal Range</th>
                <th className='px-6 py-4'>Status</th>
                <th className='px-6 py-4 text-right'>Cost</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
              {tests.map((test) => (
                <tr
                  key={test._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                  <td className='px-6 py-4 font-bold text-gray-900 dark:text-white'>
                    {test.name}
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs rounded-full font-medium'>
                      {test.category}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-semibold'>
                    {test.normalRange} {test.unit}
                  </td>
                  <td className='px-6 py-4 text-xs font-bold text-green-500'>
                    Available
                  </td>
                  <td className='px-6 py-4 text-right font-bold text-gray-900 dark:text-white'>
                    ${test.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tests.length === 0 && (
            <div className='py-20 text-center text-gray-400'>
              No tests defined in catalog.
            </div>
          )}
        </div>
      )}

      {/* Add Test Modal (Simple Overlay) */}
      {showAddTest && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md space-y-6 animate-in fade-in zoom-in duration-200'>
            <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
              Add New Lab Test
            </h3>
            <form
              onSubmit={handleAddTest}
              className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase'>
                  Test Name
                </label>
                <input
                  required
                  value={testData.name}
                  onChange={(e) =>
                    setTestData({ ...testData, name: e.target.value })
                  }
                  className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl'
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase'>
                  Category
                </label>
                <select
                  value={testData.category}
                  onChange={(e) =>
                    setTestData({ ...testData, category: e.target.value })
                  }
                  className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl'>
                  <option>Blood</option>
                  <option>Urine</option>
                  <option>Imaging</option>
                  <option>Neurology</option>
                </select>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>
                    Normal Range
                  </label>
                  <input
                    required
                    value={testData.normalRange}
                    onChange={(e) =>
                      setTestData({ ...testData, normalRange: e.target.value })
                    }
                    className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl'
                  />
                </div>
                <div className='space-y-1'>
                  <label className='text-xs font-bold text-gray-500 uppercase'>
                    Unit
                  </label>
                  <input
                    required
                    value={testData.unit}
                    onChange={(e) =>
                      setTestData({ ...testData, unit: e.target.value })
                    }
                    className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl'
                  />
                </div>
              </div>
              <div className='space-y-1'>
                <label className='text-xs font-bold text-gray-500 uppercase'>
                  Cost ($)
                </label>
                <input
                  type='number'
                  required
                  value={testData.price}
                  onChange={(e) =>
                    setTestData({ ...testData, price: e.target.value })
                  }
                  className='w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl'
                />
              </div>
              <div className='flex gap-2 pt-4'>
                <button
                  type='button'
                  onClick={() => setShowAddTest(false)}
                  className='flex-1 py-3 text-gray-500 font-bold'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 bg-purple-600 text-white py-3 rounded-2xl font-bold'>
                  Save Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laboratory;
