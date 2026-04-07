// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    fetchRooms();
    fetchPatients();
    fetchDoctors();
    fetchDepartments();
    fetchStaff();
    fetchAdmissions();
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => useContext(AppContext);
