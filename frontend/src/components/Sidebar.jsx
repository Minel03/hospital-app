import React, { useState, useEffect } from 'react';
import { Icons, useAppContext } from '../context/AppContext';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const {
    Home,
    Users,
    Calendar,
    Stethoscope,
    Bed,
    DollarSign,
    Settings,
    Activity,
    Menu,
    X,
    ClipboardList,
    UserCog,
    FileText,
    LogOut,
    Package,
    FlaskConical,
  } = Icons;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { globalSettings, userData } = useAppContext();

  const menuItems = [
    { id: '', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'admissions', label: 'Admissions', icon: ClipboardList },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'staffs', label: 'Staff', icon: UserCog },
    { id: 'pharmacy', label: 'Pharmacy', icon: Package },
    { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
    { id: 'departments', label: 'Departments', icon: Activity },
    { id: 'beds', label: 'Rooms & Beds', icon: Bed },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('token'); // clear JWT
    navigate('/login'); // redirect
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col w-64 transform transition-transform duration-300 z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        {/* Logo */}
        <div className='p-6 border-b border-gray-200 dark:border-gray-700 relative flex items-center'>
          <div className='flex items-center gap-2 min-w-0'>
            <Activity className='w-8 h-8 text-blue-600 dark:text-blue-400 shrink-0' />
            <div>
              <h1 className='font-semibold text-gray-900 dark:text-white text-xl whitespace-nowrap'>
                {globalSettings?.hospitalName || import.meta.env.VITE_APP_TITLE}
              </h1>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Hospital Management
              </p>
            </div>
          </div>
          <button
            className='md:hidden absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700'
            onClick={() => setIsOpen(!isOpen)}>
            <X className='w-6 h-6 text-gray-700 dark:text-gray-300' />
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 overflow-y-auto'>
          {menuItems
            .filter((item) => {
              if (userData.role === 'medtech') {
                return !['admissions', 'staffs', 'departments', 'beds', 'billing', 'logs', 'settings'].includes(item.id);
              }
              if (userData.role === 'doctor') {
                return !['staffs', 'billing', 'logs', 'settings'].includes(item.id);
              }
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={`/${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors font-semibold ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`
                  }>
                  <Icon className='w-5 h-5' />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>

        {/* Profile + Logout */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 px-2 py-2 rounded-xl bg-gray-50/50 dark:bg-gray-700/30'>
            <div className='w-10 h-10 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-800'>
              <span className='font-semibold text-blue-600 dark:text-blue-400'>
                {userData.name ? userData.name[0] : 'U'}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-bold text-gray-900 dark:text-white truncate'>
                {userData.name || 'User'}
              </p>
              <p className='text-[10px] text-gray-500 dark:text-gray-400 truncate'>
                {userData.email || 'user@example.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className='p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors'
              title='Logout'>
              <LogOut className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile hamburger */}
      {!isOpen && (
        <button
          className='md:hidden fixed top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-md shadow'
          onClick={() => setIsOpen(true)}>
          <Menu className='w-6 h-6 text-gray-700 dark:text-gray-300' />
        </button>
      )}

      {isOpen && (
        <div
          className='fixed inset-0 bg-black/25 md:hidden z-10'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
