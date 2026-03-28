// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Lucide-react icons
import {
  Users,
  Calendar,
  DollarSign,
  Bed,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Star,
  Phone,
  Mail,
  MoreVertical,
  Bell,
  Lock,
  Building,
  Globe,
  Shield,
  Palette,
  X,
  Eye,
  Edit,
  Trash,
} from 'lucide-react';

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
  Users,
  Calendar,
  DollarSign,
  Bed,
  TrendingUp,
  TrendingDown,
  Clock,
  Search,
  Filter,
  Plus,
  Download,
  CheckCircle,
  AlertCircle,
  Search,
  Calendar,
  Star,
  Phone,
  Mail,
  MoreVertical,
  Bell,
  Lock,
  Building,
  Globe,
  Shield,
  Palette,
  X,
  Eye,
  Edit,
  Trash,
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
  const [loading, setLoading] = useState(false);

  // Fetch rooms example
  // const fetchRooms = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get('/api'); // replace with your API
  //     if (data.success) setRooms(data.rooms);
  //     else toast.error(data.message);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Fetch patients example
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/patient/list'); // replace with your API
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
    setLoading(true);
    try {
      const { data } = await axios.get('/api/doctor/list'); // replace with your API
      if (data.success) setDoctors(data.doctors);
      else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchRooms();
    fetchPatients();
    fetchDoctors();
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
    // fetchRooms,
    fetchPatients,
    fetchDoctors,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use context
export const useAppContext = () => useContext(AppContext);
