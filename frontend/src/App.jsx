import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';

import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Patients from './pages/Patients/Patients';
import Doctors from './pages/Doctors/Doctors';
import Appointments from './pages/Appointments/Appointments';
import Billing from './pages/Billing/Billing';
import Settings from './pages/Settings/Settings';
import Departments from './pages/Departments/Deparments';
import Admissions from './pages/Admissions/Admissions';
import Staff from './pages/Staff/Staff';
import Beds from './pages/Beds/Beds';
import Logs from './pages/Logs/Logs';
import Pharmacy from './pages/Pharmacy/Pharmacy';
import Laboratory from './pages/Laboratory/Laboratory';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Public Route */}
        <Route
          path='/login'
          element={<Login />}
        />

        {/* Protected Routes */}
        <Route
          path='/*'
          element={
            <PrivateRoute>
              <div className='flex h-screen'>
                <Sidebar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <div className='flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-200'>
                  <Routes>
                    <Route
                      path='/'
                      element={<Dashboard />}
                    />
                    <Route
                      path='patients'
                      element={<Patients />}
                    />
                    <Route
                      path='appointments'
                      element={<Appointments />}
                    />
                    <Route
                      path='admissions'
                      element={<Admissions />}
                    />
                    <Route
                      path='doctors'
                      element={<Doctors />}
                    />
                    <Route
                      path='staffs'
                      element={<Staff />}
                    />
                    <Route
                      path='departments'
                      element={<Departments />}
                    />
                    <Route
                      path='beds'
                      element={<Beds />}
                    />
                    <Route
                      path='billing'
                      element={<Billing />}
                    />
                    <Route
                      path='logs'
                      element={<Logs />}
                    />
                    <Route
                      path='pharmacy'
                      element={<Pharmacy />}
                    />
                    <Route
                      path='laboratory'
                      element={<Laboratory />}
                    />
                    <Route
                      path='settings'
                      element={<Settings />}
                    />
                  </Routes>
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
