import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Lucide-react icons
import * as LucideIcons from 'lucide-react';

// Recharts components
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from 'react-toastify';

// Set Axios base URL from VITE environment variable
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Attach JWT token to every request automatically
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Create context
const AppContext = createContext({});

// Export icons and charts for global reuse
export const Icons = {
  ...LucideIcons,
};

export const Charts = {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
};

// Context provider
export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY || '$';

  // Example state
  const [rooms, setRooms] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [admission, setAdmission] = useState([]);
  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', role: '' });

  const refreshUserData = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const data = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        };
        setUserData(data);
        return data; // Return for immediate use in fetchAllData
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    return null;
  };

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/room/list');
      if (data.success) setRooms(data.rooms);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/department/list');
      if (data.success) setDepartments(data.departments);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch patients example
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/patient/all'); // replace with your API
      if (data.success) setPatients(data.patients);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors example
  const fetchDoctors = async () => {
    try {
      const { data } = await axios.get('/api/doctor/list'); // <-- doctor endpoint
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get('/api/staff/list');
      if (res.data.success) setStaff(res.data.staff);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const fetchAdmissions = async () => {
    try {
      const res = await axios.get('/api/admission/list');
      if (res.data.success) setAdmission(res.data.admission);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const fetchGlobalSettings = async () => {
    try {
      const { data } = await axios.get('/api/settings/global');
      if (data.success) {
        setGlobalSettings(data.settings);
        if (data.settings?.hospitalName) {
           document.title = data.settings.hospitalName;
        }
      }
    } catch (error) {
      console.error('Error fetching global settings:', error);
    }
  };

  const fetchUserSettings = async () => {
    try {
      if (!sessionStorage.getItem('token')) return;
      const { data } = await axios.get('/api/settings/user');
      if (data.success && data.settings) {
        document.documentElement.classList.toggle('dark', data.settings.theme === 'dark');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  };

  // Helper for react-select dark mode styling
  const getSelectStyles = () => {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      control: (base, state) => ({
        ...base,
        backgroundColor: isDark ? '#1f2937' : '#ffffff', // gray-800 or white
        borderColor: isDark ? '#374151' : '#e5e7eb', // gray-700 or gray-200
        color: isDark ? '#ffffff' : '#000000',
        '&:hover': {
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
        boxShadow: state.isFocused ? (isDark ? '0 0 0 1px #3b82f6' : '0 0 0 1px #3b82f6') : 'none',
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        border: isDark ? '1px solid #374151' : '1px solid #e5e7eb',
      }),
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected 
          ? '#3b82f6' 
          : state.isFocused 
            ? (isDark ? '#374151' : '#f3f4f6') 
            : 'transparent',
        color: state.isSelected ? '#ffffff' : (isDark ? '#e5e7eb' : '#374151'),
        '&:active': {
          backgroundColor: '#3b82f6',
        },
      }),
      singleValue: (base) => ({
        ...base,
        color: isDark ? '#ffffff' : '#000000',
      }),
      input: (base) => ({
        ...base,
        color: isDark ? '#ffffff' : '#000000',
      }),
      placeholder: (base) => ({
        ...base,
        color: isDark ? '#9ca3af' : '#6b7280', // gray-400 or gray-500
      }),
    };
  };

  const fetchAllData = () => {
    const currentData = refreshUserData();
    if (!currentData) return;

    const { role } = currentData;

    // Admin and Clinical coordination
    if (['admin', 'doctor', 'nurse', 'receptionist'].includes(role)) {
      fetchStaff();
    }

    if (role === 'admin') {
      fetchGlobalSettings();
    }

    // Clinical and Administrative
    if (['admin', 'doctor', 'nurse', 'receptionist'].includes(role)) {
      fetchRooms();
      fetchAdmissions();
    }

    // Role-specific patients access
    if (['admin', 'doctor', 'nurse', 'receptionist', 'medtech'].includes(role)) {
      fetchPatients();
    }

    // Always fetch
    fetchDoctors();
    fetchDepartments();
    fetchUserSettings();
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    
    // Always fetch public settings (hospital name) for login page
    const fetchPublicName = async () => {
      try {
        const { data } = await axios.get('/api/settings/public');
        if (data.success && data.hospitalName && !globalSettings) {
          setGlobalSettings({ hospitalName: data.hospitalName });
        }
      } catch (err) {}
    };
    fetchPublicName();

    if (token) {
      fetchAllData();
    }
  }, []);

  const value = {
    axios,
    navigate,
    currency,
    loading,
    rooms,
    setRooms,
    patients,
    setPatients,
    doctors,
    setDoctors,
    fetchRooms,
    fetchPatients,
    fetchDoctors,
    fetchDepartments,
    fetchStaff,
    fetchAdmissions,
    globalSettings,
    setGlobalSettings,
    fetchGlobalSettings,
    fetchUserSettings,
    getSelectStyles,
    Icons,
    userData,
    refreshUserData,
    fetchAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => useContext(AppContext);
