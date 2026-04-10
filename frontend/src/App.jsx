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
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist', 'medtech']}>
                          <Patients />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='appointments'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                          <Appointments />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='admissions'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                          <Admissions />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='doctors'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor']}>
                          <Doctors />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='staffs'
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <Staff />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='departments'
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <Departments />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='beds'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse', 'receptionist']}>
                          <Beds />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='billing'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'receptionist', 'accountant']}>
                          <Billing />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='logs'
                      element={
                        <PrivateRoute allowedRoles={['admin']}>
                          <Logs />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='pharmacy'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'nurse', 'pharmacist']}>
                          <Pharmacy />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path='laboratory'
                      element={
                        <PrivateRoute allowedRoles={['admin', 'doctor', 'medtech']}>
                          <Laboratory />
                        </PrivateRoute>
                      }
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
