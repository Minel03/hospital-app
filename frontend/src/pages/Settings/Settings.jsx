import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const { Bell, Lock, Users, Building, Shield, Mail, Palette, CheckCircle } =
  Icons;

const Settings = () => {
  const { axios } = useAppContext();

  const [activeSection, setActiveSection] = useState('General');
  const [loading, setLoading] = useState(true);

  // ---------------- States ----------------
  const [general, setGeneral] = useState({
    hospitalName: import.meta.env.VITE_APP_TITLE || 'My Hospital',
    address: '',
    contactNumber: '',
    email: '',
  });

  const [appearance, setAppearance] = useState({
    theme: 'light', // light / dark
  });

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

  // ---------------- Sidebar ----------------
  const sidebarItems = [
    { name: 'General', icon: Building },
    { name: 'Appearance', icon: Palette },
    { name: 'Notifications', icon: Bell },
    { name: 'Email Settings', icon: Mail },
  ];

  // ---------------- Fetch User Settings ----------------
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/settings');
      if (res.data.success) {
        const data = res.data.settings;

        setGeneral(data.general || general);
        setAppearance(data.appearance || appearance);
        setNotifications(data.notifications || notifications);
        setEmailSettings(data.emailSettings || emailSettings);

        // Update document title
        document.title = data.general?.hospitalName || general.hospitalName;
      }
    } catch (err) {
      toast.error('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ---------------- Handlers ----------------
  const handleGeneralChange = (key, value) => {
    setGeneral((prev) => ({ ...prev, [key]: value }));

    // Update page title immediately for hospital name
    if (key === 'hospitalName') document.title = value;
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance((prev) => ({ ...prev, [key]: value }));
    // Optionally update body class for dark/light theme
    if (key === 'theme') {
      document.documentElement.classList.toggle('dark', value === 'dark');
    }
  };

  const handleNotificationsChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleEmailSettingsChange = (key, value) => {
    setEmailSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      const payload = { general, appearance, notifications, emailSettings };
      const res = await axios.post('/api/settings', payload);

      if (res.data.success) {
        toast.success('Settings saved successfully');
      } else {
        toast.error(res.data.message || 'Failed to save settings');
      }
    } catch (err) {
      toast.error('Error saving settings');
      console.error(err);
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>Settings</h2>
          <p className='text-gray-500 mt-1'>
            Manage your system configuration and preferences
          </p>
        </div>

        <button
          onClick={saveSettings}
          className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'>
          <CheckCircle className='w-5 h-5' />
          Save Changes
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
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
          {/* General */}
          {activeSection === 'General' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                General Settings
              </h3>
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

          {/* Appearance */}
          {activeSection === 'Appearance' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-4'>Appearance</h3>
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

          {/* Notifications */}
          {activeSection === 'Notifications' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Notifications
              </h3>
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

          {/* Email Settings */}
          {activeSection === 'Email Settings' && (
            <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-4'>
              <h3 className='font-semibold text-gray-900 mb-4'>
                Email Settings
              </h3>

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

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  SMTP Port
                </label>
                <input
                  type='number'
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    handleEmailSettingsChange('smtpPort', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  SMTP Email
                </label>
                <input
                  type='email'
                  value={emailSettings.smtpEmail}
                  onChange={(e) =>
                    handleEmailSettingsChange('smtpEmail', e.target.value)
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg'
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
