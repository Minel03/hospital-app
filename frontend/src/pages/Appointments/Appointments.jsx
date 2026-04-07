import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, Icons } from '../../context/AppContext';
import { toast } from 'react-toastify';

import AppointmentHeader from './components/AppointmentHeader';
import AppointmentSearchFilter from './components/AppointmentSearchFilter';
import AppointmentTable from './components/AppointmentTable';
import AppointmentFormModal from './components/AppointmentFormModal';
import AppointmentQuickStats from './components/AppointmentQuickStats';

const Appointments = () => {
  const { axios } = useAppContext();
  const { Search, Filter, Calendar, Clock } = Icons;

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: [], type: [] });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: null,
    datetime: '', // single datetime field
    status: 'Pending',
    type: 'Check-up',
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
      setPatients(patientsRes.data.patients || []);
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

  return (
    <div className='p-8 space-y-6'>
      <AppointmentHeader onAddAppointment={handleAddAppointment} />

      <AppointmentSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        setFilters={setFilters}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        filterRef={filterRef}
      />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <AppointmentTable
          appointments={appointments}
          filters={filters}
          searchQuery={searchQuery}
          onEditAppointment={handleEditAppointment}
          onCancelAppointment={handleCancelAppointment}
        />

        <AppointmentQuickStats appointments={appointments} />
      </div>

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
      />
    </div>
  );
};

export default Appointments;
