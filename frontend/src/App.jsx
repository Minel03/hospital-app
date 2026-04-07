import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors/Doctors';
import Appointments from './pages/Appointments/Appointments';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';
import Departments from './pages/Departments/Deparments';
import Admissions from './pages/Admissions/Admissions';
import Staff from './pages/Staff/Staff';
import Beds from './pages/Beds/Beds';
import Logs from './pages/Logs/Logs';

const App = () => {
  // Track active tab if you want to highlight the sidebar item
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className='flex h-screen'>
      <ToastContainer />
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <div className='flex-1 overflow-auto bg-gray-50 p-6'>
        <Routes>
          <Route
            path='/'
            element={<Dashboard />}
          />
          <Route
            path='/patients'
            element={<Patients />}
          />
          <Route
            path='/appointments'
            element={<Appointments />}
          />
          <Route
            path='/admissions'
            element={<Admissions />}
          />
          <Route
            path='/doctors'
            element={<Doctors />}
          />
          <Route
            path='/staffs'
            element={<Staff />}
          />
          <Route
            path='/departments'
            element={<Departments />}
          />
          <Route
            path='/beds'
            element={<Beds />}
          />
          <Route
            path='/billing'
            element={<Billing />}
          />
          <Route
            path='/logs'
            element={<Logs />}
          />
          <Route
            path='/settings'
            element={<Settings />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
