import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Patients from './pages/Patients/Patients';
import Sidebar from './components/Sidebar';
import Doctors from './pages/Doctors/Doctors';
import Appointments from './pages/Appointments';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import Departments from './pages/Departments/Deparments';

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
            path='/doctors'
            element={<Doctors />}
          />
          <Route
            path='/departments'
            element={<Departments />}
          />
          <Route
            path='/rooms'
            element={<Rooms />}
          />
          <Route
            path='/billing'
            element={<Billing />}
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
