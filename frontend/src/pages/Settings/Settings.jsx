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
        <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-1'>
          {sidebarItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button
                key={i}
                onClick={() => setActiveSection(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.name
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
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
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-1'>
                General Settings
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Set your primary hospital information.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Hospital Name
                </label>
                <input
                  type='text'
                  value={general.hospitalName}
                  onChange={(e) =>
                    handleGeneralChange('hospitalName', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Address
                </label>
                <input
                  type='text'
                  value={general.address}
                  onChange={(e) =>
                    handleGeneralChange('address', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Contact Number
                </label>
                <input
                  type='text'
                  value={general.contactNumber}
                  onChange={(e) =>
                    handleGeneralChange('contactNumber', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email
                </label>
                <input
                  type='email'
                  value={general.email}
                  onChange={(e) => handleGeneralChange('email', e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>
            </div>
          )}
          {activeSection === 'Appearance' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-1'>Appearance</h3>
              <p className='text-sm text-gray-500 mb-4'>
                Customize how the dashboard looks on your device.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Theme
                </label>
                <select
                  value={appearance.theme}
                  onChange={(e) =>
                    handleAppearanceChange('theme', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'>
                  <option value='light'>Light</option>
                  <option value='dark'>Dark</option>
                </select>
              </div>
            </div>
          )}
          {activeSection === 'Notifications' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-1'>
                Notifications
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Manage your alerts and notification preferences.
              </p>
              {Object.entries(notifications).map(([key, value]) => (
                <div
                  key={key}
                  className='flex items-center justify-between py-2 border-b last:border-0'>
                  <span className='capitalize'>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <input
                    type='checkbox'
                    checked={value}
                    onChange={() => handleNotificationsChange(key, !value)}
                  />
                </div>
              ))}
            </div>
          )}
          {activeSection === 'Email Settings' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-1'>
                Email Settings
              </h3>
              <p className='text-sm text-gray-500 mb-4'>
                Configure the SMTP server used to send outgoing emails to staff
                and patients.
              </p>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  SMTP Server
                </label>
                <input
                  type='text'
                  value={emailSettings.smtpServer}
                  onChange={(e) =>
                    handleEmailSettingsChange('smtpServer', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>
            </div>
          )}

          {/* ---------------- User Management ---------------- */}
          {activeSection === 'User Management' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    User Management
                  </h3>
                  <p className='text-sm text-gray-500'>
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
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Name
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Email
                      </th>
                      <th className='px-4 py-2 text-left text-sm font-medium text-gray-500'>
                        Role
                      </th>
                      <th className='px-4 py-2 text-right text-sm font-medium text-gray-500'>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-100'>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className='px-4 py-2'>{user.name}</td>
                        <td className='px-4 py-2'>{user.email}</td>
                        <td className='px-4 py-2 capitalize'>{user.role}</td>
                        <td className='px-4 py-2 text-right space-x-2'>
                          <button
                            onClick={() => openEditUser(user)}
                            className='text-blue-600 hover:underline'>
                            <Edit className='w-4 h-4 inline' />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className='text-red-600 hover:underline'>
                            <Trash2 className='w-4 h-4 inline' />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className='mt-4 p-4 border border-gray-300 rounded-lg space-y-2'>
                  <h4 className='font-medium text-gray-800'>
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <input
                      type='text'
                      placeholder='Name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='px-3 py-2 border border-gray-300 rounded-lg w-full'
                    />
                    <input
                      type='email'
                      placeholder='Email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='px-3 py-2 border border-gray-300 rounded-lg w-full'
                    />
                    <input
                      type='password'
                      placeholder={
                        editingUser
                          ? 'New password (leave blank to keep)'
                          : 'Password'
                      }
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className='px-3 py-2 border border-gray-300 rounded-lg w-full'
                    />
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className='px-3 py-2 border border-gray-300 rounded-lg w-full'>
                      <option value='admin'>Admin</option>
                      <option value='doctor'>Doctor</option>
                      <option value='staff'>Staff</option>
                    </select>
                  </div>
                  <button
                    onClick={saveUser}
                    className='mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
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
