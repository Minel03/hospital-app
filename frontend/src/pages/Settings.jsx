import React from 'react';
import { Icons } from '../context/AppContext';
import { settingsSections } from '../data/dummyData';

const Settings = () => {
  const {
    Bell,
    Lock,
    Users,
    Building,
    Globe,
    Shield,
    Mail,
    Palette,
    CheckCircle,
  } = Icons;
  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold text-gray-900'>Settings</h2>
          <p className='text-gray-500 mt-1'>
            Manage system configuration and preferences
          </p>
        </div>
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <CheckCircle className='w-5 h-5' />
          <span className='hidden sm:inline'>Save Changes</span>
        </button>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Sidebar */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-1'>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600'>
              <Building className='w-5 h-5' />
              <span>General</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Users className='w-5 h-5' />
              <span>User Management</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Bell className='w-5 h-5' />
              <span>Notifications</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Shield className='w-5 h-5' />
              <span>Security</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Palette className='w-5 h-5' />
              <span>Appearance</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Mail className='w-5 h-5' />
              <span>Email Settings</span>
            </button>
            <button className='w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50'>
              <Lock className='w-5 h-5' />
              <span>Privacy</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {settingsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 p-6'>
                <div className='flex items-center gap-3 mb-6'>
                  <div className='bg-blue-100 p-2 rounded-lg'>
                    <Icon className='w-5 h-5 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>
                    {section.title}
                  </h3>
                </div>

                <div className='space-y-4'>
                  {section.settings.map((setting, idx) => (
                    <div key={idx}>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        {setting.label}
                      </label>
                      {setting.type === 'select' ? (
                        <select className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                          {setting.options?.map((option, optIdx) => (
                            <option
                              key={optIdx}
                              value={option}
                              selected={option === setting.value}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={setting.type}
                          defaultValue={setting.value}
                          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Notification Preferences */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Bell className='w-5 h-5 text-blue-600' />
              </div>
              <h3 className='font-semibold text-gray-900'>
                Notification Preferences
              </h3>
            </div>

            <div className='space-y-4'>
              {[
                {
                  label: 'Email Notifications',
                  description: 'Receive email alerts for important updates',
                },
                {
                  label: 'Appointment Reminders',
                  description: 'Get notified about upcoming appointments',
                },
                {
                  label: 'Emergency Alerts',
                  description: 'Receive critical emergency notifications',
                },
                {
                  label: 'System Updates',
                  description: 'Stay informed about system maintenance',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className='flex items-center justify-between py-3 border-b border-gray-200 last:border-0'>
                  <div>
                    <p className='font-medium text-gray-900'>{item.label}</p>
                    <p className='text-sm text-gray-500'>{item.description}</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      defaultChecked={idx < 2}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='bg-red-100 p-2 rounded-lg'>
                <Shield className='w-5 h-5 text-red-600' />
              </div>
              <h3 className='font-semibold text-gray-900'>Security Settings</h3>
            </div>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Current Password
                </label>
                <input
                  type='password'
                  placeholder='Enter current password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  New Password
                </label>
                <input
                  type='password'
                  placeholder='Enter new password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Confirm New Password
                </label>
                <input
                  type='password'
                  placeholder='Confirm new password'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
              <button className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors'>
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
