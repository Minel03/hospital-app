import React, { useState } from 'react';
import {
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
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: '', label: 'Dashboard', icon: Home },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'admissions', label: 'Admissions', icon: ClipboardList },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope },
    { id: 'staffs', label: 'Staff', icon: UserCog },
    { id: 'departments', label: 'Departments', icon: Activity },
    { id: 'beds', label: 'Rooms & Beds', icon: Bed },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 flex flex-col w-64
        transform transition-transform duration-300 z-20
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static
      `}>
        {/* Logo */}
        <div className='p-6 border-b border-gray-200 relative flex items-center'>
          <div className='flex items-center gap-2 min-w-0'>
            <Activity className='w-8 h-8 text-blue-600 shrink-0' />

            <div>
              <h1 className='font-semibold text-gray-900 text-xl whitespace-nowrap'>
                {import.meta.env.VITE_APP_TITLE}
              </h1>
              <p className='text-xs text-gray-500'>Hospital Management</p>
            </div>
          </div>

          {/* Close button */}
          <button
            className='md:hidden absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-gray-100'
            onClick={() => setIsOpen(!isOpen)}>
            <X className='w-6 h-6 text-gray-700' />
          </button>
        </div>

        {/* Navigation */}
        <nav className='flex-1 p-4 overflow-y-auto'>
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.id}
                to={`/${item.id}`}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors font-semibold ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }>
                <Icon className='w-5 h-5' />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Profile */}
        <div className='p-4 border-t border-gray-200'>
          <div className='flex items-center gap-3 px-4 py-3'>
            <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='font-semibold text-blue-600'>AS</span>
            </div>
            <div>
              <p className='text-sm font-medium text-gray-900'>Admin User</p>
              <p className='text-xs text-gray-500'>admin@medicare.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile hamburger outside sidebar */}
      {!isOpen && (
        <button
          className='md:hidden fixed top-4 left-4 z-10 p-2 bg-white rounded-md shadow'
          onClick={() => setIsOpen(true)}>
          <Menu className='w-6 h-6 text-gray-700' />
        </button>
      )}

      {/* Overlay */}
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
