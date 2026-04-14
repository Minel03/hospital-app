import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, Icons } from '../../context/AppContext';
import { toast } from 'react-toastify';

import PageHeader from '../../components/PageHeader';
import AppointmentSearchFilter from './components/AppointmentSearchFilter';
import AppointmentTable from './components/AppointmentTable';
import AppointmentFormModal from './components/AppointmentFormModal';
import Pagination from '../../components/Pagination';

const Appointments = () => {
  const { axios, patients, fetchPatients, userData } = useAppContext();
  const { Search, Filter, Calendar, Clock } = Icons;

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: [], type: [] });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: null,
    datetime: '', // single datetime field
    status: 'Pending',
    type: 'Check-up',
    meetingLink: '',
  });

  // Fetch appointments & related data
  const loadAppointmentsData = async () => {
    try {
      const [appointmentsRes, patientsRes, doctorsRes, departmentsRes] =
        await Promise.all([
          axios.get('/api/appointment/list'),
          axios.get('/api/patient/all'),
          axios.get('/api/doctor/list'),
          axios.get('/api/department/list'),
        ]);

      if (appointmentsRes.data.success)
        setAppointments(appointmentsRes.data.appointments || []);
      fetchPatients(); // This updates the global state
      setDoctors(doctorsRes.data.doctors || []);
      setDepartments(departmentsRes.data.departments || []);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    loadAppointmentsData();

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Add / Edit Appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        patient: formData.patient,
        doctor: formData.doctor,
        department: formData.department?.value || formData.department || null,
        datetime: formData.datetime, // ← send single datetime
        status: formData.status,
        type: formData.type,
        meetingLink: formData.meetingLink || '',
      };

      if (mode === 'add') {
        const { data } = await axios.post('/api/appointment/add', payload);
        if (data.success) toast.success(data.message || 'Appointment added');
        else toast.error(data.message);
      } else if (mode === 'edit' && selectedAppointment) {
        const { data } = await axios.post('/api/appointment/update', {
          appointmentId: selectedAppointment._id,
          ...payload,
        });
        if (data.success) toast.success(data.message || 'Appointment updated');
        else toast.error(data.message);
      }

      setShowModal(false);
      setSelectedAppointment(null);
      setFormData({
        patient: '',
        doctor: '',
        department: null,
        datetime: '',
        status: 'Pending',
        type: 'Check-up',
        meetingLink: '',
      });

      loadAppointmentsData();
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Add new appointment
  const handleAddAppointment = () => {
    setMode('add');
    setSelectedAppointment(null);
    setFormData({
      patient: '',
      doctor: '',
      department: null,
      datetime: '',
      status: 'Pending',
      type: 'Check-up',
      meetingLink: '',
    });
    setShowModal(true);
  };

  // Edit appointment
  const handleEditAppointment = (appointment) => {
    setMode('edit');
    setSelectedAppointment(appointment);

    // format datetime for datetime-local input
    const dt = new Date(appointment.datetime);
    const pad = (n) => String(n).padStart(2, '0');
    const formattedDatetime = `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

    setFormData({
      patient: appointment.patient?._id || '',
      doctor: appointment.doctor?._id || '',
      department: appointment.department
        ? {
            value: appointment.department._id,
            label: appointment.department.name,
          }
        : null,
      datetime: formattedDatetime,
      status: appointment.status || 'Pending',
      type: appointment.type || 'Check-up',
      meetingLink: appointment.meetingLink || '',
    });

    setShowModal(true);
  };

  // Cancel appointment
  const handleCancelAppointment = async (id) => {
    try {
      const { data } = await axios.post('/api/appointment/cancel', {
        appointmentId: id,
      });
      if (data.success) {
        toast.success('Appointment cancelled successfully');
        loadAppointmentsData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      appointment.patient?.name?.toLowerCase().includes(query) ||
      appointment.doctor?.name?.toLowerCase().includes(query) ||
      appointment.department?.name?.toLowerCase().includes(query);

    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(appointment.status);

    const matchesType =
      filters.type.length === 0 || filters.type.includes(appointment.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const today = new Date();
    const dateA = new Date(a.datetime || a.date);
    const dateB = new Date(b.datetime || b.date);

    const isAFuture = dateA >= today && a.status !== 'Cancelled';
    const isBFuture = dateB >= today && b.status !== 'Cancelled';

    if (isAFuture && !isBFuture) return -1;
    if (!isAFuture && isBFuture) return 1;

    return dateA - dateB;
  });

  const paginatedAppointments = sortedAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  /* ================= STATS ================= */
  const today = new Date();
  const countToday = appointments.filter(
    (a) => new Date(a.datetime).toDateString() === today.toDateString(),
  ).length;

  const countPending = appointments.filter(
    (a) => a.status === 'Pending',
  ).length;
  const countTelemedicine = appointments.filter(
    (a) => a.type === 'Telemedicine' || a.meetingLink,
  ).length;

  const { Activity, Video } = Icons;
  const stats = [
    {
      label: 'Total Appointments',
      value: appointments.length,
      icon: Calendar,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: "Today's",
      value: countToday,
      icon: Clock,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Pending',
      value: countPending,
      icon: Activity,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: 'Telemedicine',
      value: countTelemedicine,
      icon: Video,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <PageHeader
        title='Appointments'
        subtitle='Schedule and manage patient visits'
        buttonLabel={
          ['admin', 'doctor', 'nurse', 'receptionist'].includes(userData.role)
            ? 'New Appointment'
            : null
        }
        onButtonClick={
          ['admin', 'doctor', 'nurse', 'receptionist'].includes(userData.role)
            ? handleAddAppointment
            : null
        }
        stats={stats}
      />

      <AppointmentSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        filterRef={filterRef}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        <AppointmentTable
          appointments={paginatedAppointments}
          onEditAppointment={handleEditAppointment}
          onCancelAppointment={handleCancelAppointment}
          userData={userData}
        />
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(sortedAppointments.length / itemsPerPage)}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        totalItems={sortedAppointments.length}
      />

      <AppointmentFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        patients={patients}
        doctors={doctors}
        departments={departments}
        appointments={appointments}
      />
    </div>
  );
};

export default Appointments;
