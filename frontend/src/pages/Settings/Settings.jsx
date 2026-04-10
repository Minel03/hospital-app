import { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import Title from '../../components/Title';

const {
  Bell,
  Users,
  Building,
  Mail,
  Palette,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  XCircle,
} = Icons;

const Settings = () => {
  const { axios, fetchGlobalSettings } = useAppContext();
  const [activeSection, setActiveSection] = useState('General');

  // ---------------- General / Appearance / Notifications / Email ----------------
  const [general, setGeneral] = useState({
    hospitalName: import.meta.env.VITE_APP_TITLE || 'My Hospital',
    address: '',
    contactNumber: '',
    email: '',
  });

  const [appearance, setAppearance] = useState({ theme: 'light' });
  const [notifications, setNotifications] = useState({
    email: true,
    appointment: true,
    emergency: false,
    updates: false,
  });
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: '',
    smtpPort: '',
    smtpEmail: '',
  });

  // ---------------- User Management ----------------
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const sidebarItems = [
    { name: 'General', icon: Building },
    { name: 'Appearance', icon: Palette },
    { name: 'Notifications', icon: Bell },
    { name: 'Email Settings', icon: Mail },
    { name: 'User Management', icon: Users },
  ];

  // ---------------- Fetch Settings / Users ----------------
  const fetchSettings = async () => {
    try {
      const [globalRes, userRes] = await Promise.all([
        axios.get('/api/settings/global'),
        axios.get('/api/settings/user'),
      ]);

      if (globalRes.data.success) {
        const data = globalRes.data.settings;
        setGeneral({
          hospitalName: data.hospitalName,
          address: data.address,
          contactNumber: data.contactNumber,
          email: data.email,
        });
        document.title = data.hospitalName;
      }

      if (userRes.data.success) {
        const data = userRes.data.settings;
        setAppearance({ theme: data.theme });
        setNotifications(data.notifications);
        setEmailSettings(data.emailSettings);
        if (data.theme === 'dark')
          document.documentElement.classList.add('dark');
      }
    } catch (err) {
      toast.error('Failed to load settings');
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/user/all');
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchUsers();
  }, []);

  // ---------------- Handlers ----------------
  const handleGeneralChange = (key, value) => {
    setGeneral((prev) => ({ ...prev, [key]: value }));
    if (key === 'hospitalName') document.title = value;
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    if (key === 'theme')
      document.documentElement.classList.toggle('dark', value === 'dark');
  };

  const handleNotificationsChange = (key, value) =>
    setNotifications((prev) => ({ ...prev, [key]: value }));

  const handleEmailSettingsChange = (key, value) =>
    setEmailSettings((prev) => ({ ...prev, [key]: value }));

  const saveSettings = async () => {
    try {
      await axios.put('/api/settings/global', general);
      await axios.put('/api/settings/user', {
        theme: appearance.theme,
        notifications,
        emailSettings,
      });
      toast.success('Settings saved successfully');
      if (fetchGlobalSettings) fetchGlobalSettings(); // Refresh sidebar info
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
    }
  };

  // ---------------- User Management Handlers ----------------
  const openAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'staff' });
    setShowForm(true);
  };

  const openEditUser = (user) => {
    setEditingUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowForm(true);
  };

  const saveUser = async () => {
    try {
      if (editingUser) {
        const res = await axios.put('/api/user/update', {
          userId: editingUser,
          ...formData,
        });
        if (!res.data.success) return toast.error(res.data.message);
        toast.success('User updated successfully');
      } else {
        if (!formData.password) return toast.error('Password is required');
        const res = await axios.post('/api/user/add', formData);
        if (!res.data.success) return toast.error(res.data.message);
        toast.success('User added successfully');
      }
      fetchUsers();
      setFormData({ name: '', email: '', password: '', role: 'staff' });
      setEditingUser(null);
      setShowForm(false);
    } catch (err) {
      toast.error('Failed to save user');
      console.error(err);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await axios.delete('/api/user/delete', {
        data: { userId: id },
      });
      if (!res.data.success) return toast.error(res.data.message);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
      console.error(err);
    }
  };

  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-2'>
        <div>
          <Title
            title='Settings'
            subtitle='Manage your system configuration and preferences'
          />
        </div>

        <button
          onClick={saveSettings}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
          <CheckCircle className='w-5 h-5' />
          <span className='hidden sm:inline'>Save Changes</span>
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Sidebar */}
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-1'>
          {sidebarItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveSection(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.name
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}>
                <Icon className='w-5 h-5' />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Existing sections */}
          {activeSection === 'General' && (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                General Settings
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Set your primary hospital information.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Hospital Name
                </label>
                <input
                  type='text'
                  value={general.hospitalName}
                  onChange={(e) =>
                    handleGeneralChange('hospitalName', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Address
                </label>
                <input
                  type='text'
                  value={general.address}
                  onChange={(e) =>
                    handleGeneralChange('address', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Contact Number
                </label>
                <input
                  type='text'
                  value={general.contactNumber}
                  onChange={(e) =>
                    handleGeneralChange('contactNumber', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  value={general.email}
                  onChange={(e) => handleGeneralChange('email', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'
                />
              </div>
            </div>
          )}
          {activeSection === 'Appearance' && (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                Appearance
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Customize how the dashboard looks on your device.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Theme
                </label>
                <select
                  value={appearance.theme}
                  onChange={(e) =>
                    handleAppearanceChange('theme', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'>
                  <option value='light'>Light</option>
                  <option value='dark'>Dark</option>
                </select>
              </div>
            </div>
          )}
          {activeSection === 'Notifications' && (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                Notifications
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Manage your alerts and notification preferences.
              </p>
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className='flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0'>
                  <span className='capitalize text-gray-700 dark:text-gray-300 font-medium'>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input
                    type='checkbox'
                    checked={value}
                    className='w-4 h-4 text-blue-600 rounded dark:bg-gray-700 dark:border-gray-600'
                    onChange={() => handleNotificationsChange(key, !value)}
                  />
                </div>
              ))}
            </div>
          )}
          {activeSection === 'Email Settings' && (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                Email Settings
              </h3>
              <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                Configure the SMTP server used to send outgoing emails to staff
                and patients.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  SMTP Server
                </label>
                <input
                  type='text'
                  value={emailSettings.smtpServer}
                  onChange={(e) =>
                    handleEmailSettingsChange('smtpServer', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg'
                />
              </div>
            </div>
          )}

          {/* ---------------- User Management ---------------- */}
          {activeSection === 'User Management' && (
            <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4'>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    User Management
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>
                    Control access and roles for all staff members.
                  </p>
                </div>
                <button
                  onClick={openAddUser}
                  className='flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700'>
                  <Plus className='w-4 h-4' /> Add User
                </button>
              </div>

              {/* User Table */}
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                  <thead className='bg-gray-50 dark:bg-gray-900/50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Name
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Email
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Role
                      </th>
                      <th className='px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100 dark:divide-gray-700'>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className='hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors'>
                        <td className='px-4 py-3 text-sm text-gray-900 dark:text-gray-200'>
                          {user.name}
                        </td>
                        <td className='px-4 py-3 text-sm text-gray-600 dark:text-gray-400'>
                          {user.email}
                        </td>
                        <td className='px-4 py-3 text-sm capitalize'>
                          <span className='px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium'>
                            {user.role}
                          </span>
                        </td>
                        <td className='px-4 py-3 text-right space-x-2'>
                          <button
                            onClick={() => openEditUser(user)}
                            className='p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors'>
                            <Edit className='w-4 h-4' />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className='p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'>
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className='mt-4 p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg space-y-2'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-gray-800 dark:text-gray-100'>
                      {editingUser ? 'Edit User' : 'Add New User'}
                    </h4>
                    <button
                      onClick={() => setShowForm(false)}
                      className='text-gray-400 hover:text-red-500 transition-colors'>
                      <XCircle className='w-5 h-5' />
                    </button>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        placeholder='Enter full name'
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                      />
                    </div>

                    <div className='space-y-1'>
                      <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Email Address
                      </label>
                      <input
                        type='email'
                        placeholder='Enter email address'
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                      />
                    </div>

                    <div className='space-y-1'>
                      <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        Password
                      </label>
                      <input
                        type='password'
                        placeholder={
                          editingUser
                            ? 'New password (leave blank to keep)'
                            : 'Enter password'
                        }
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all'
                      />
                    </div>

                    <div className='space-y-1'>
                      <label className='block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                        User Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                        className='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all selection:bg-blue-500'>
                        <option value='admin'>Admin</option>
                        <option value='doctor'>Doctor</option>
                        <option value='staff'>Staff</option>
                      </select>
                    </div>
                  </div>
                  <div className='mt-3 flex gap-2'>
                    <button
                      onClick={saveUser}
                      className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                      {editingUser ? 'Update User' : 'Add User'}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className='bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
