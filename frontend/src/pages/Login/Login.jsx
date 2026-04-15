// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { fetchAllData } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hospitalName, setHospitalName] = useState('MediCare');

  // Fetch hospital name for display
  useEffect(() => {
    const fetchName = async () => {
      try {
        const { data } = await axios.get('/api/settings/public');
        if (data.success) setHospitalName(data.hospitalName);
      } catch (err) {
        console.error('Failed to fetch hospital name');
      }
    };
    fetchName();
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) navigate('/');
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/login', { email, password });
      if (res.data.success) {
        sessionStorage.setItem('token', res.data.token);
        await fetchAllData();
        navigate('/');
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-50'>
      <div className='w-full max-w-md px-6'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 dark:border dark:border-gray-700'>
          <div className='flex flex-col items-center mb-8'>
            <div className='w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4'>
              <Activity className='w-10 h-10 text-white' />
            </div>
            <h1 className='text-gray-900 dark:text-gray-200 text-2xl font-semibold'>
              {hospitalName}
            </h1>
            <p className='text-gray-500 mt-1'>Hospital Management System</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className='space-y-5'>
            <div>
              <label className='block text-sm text-gray-700 mb-2'>
                Email Address
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='admin@medicare.com'
                required
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <label className='block text-sm text-gray-700 mb-2'>
                Password
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='password123'
                required
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <button
              type='submit'
              className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors'>
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
