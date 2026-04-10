import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

import DoctorHeader from './components/DoctorHeader';
import DoctorSearchFilter from './components/DoctorSearchFilter';
import DoctorTable from './components/DoctorTable';
import DoctorFormModal from './components/DoctorFormModal';

const Doctors = () => {
  const { axios, doctors, fetchDoctors } = useAppContext();

  const [departments, setDepartments] = useState([]);
  const [doctorUsers, setDoctorUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    specialty: [],
  });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  const [formData, setFormData] = useState({
    userId: null,
    name: '',
    specialty: '',
    phone: '',
    gender: 'Male',
    email: '',
    experience: '',
    rating: 0,
    patients: 0,
    status: 'Available',
    department: null,
  });

  // Fetch doctors and departments on mount
  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchDoctorUsers();

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/department/list');
      if (data.success) setDepartments(data.departments);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch departments');
    }
  };

  const fetchDoctorUsers = async () => {
    try {
      const { data } = await axios.get('/api/user/all');
      if (data.success)
        setDoctorUsers(data.users.filter((u) => u.role === 'doctor'));
    } catch (error) {
      console.log(error);
    }
  };

  // Users not yet linked to any doctor profile
  const linkedDoctorUserIds = new Set(
    doctors.filter((d) => d.userId).map((d) => d.userId.toString())
  );
  const availableDoctorUsers = doctorUsers.filter(
    (u) => !linkedDoctorUserIds.has(u._id.toString())
  );

  // Add / Edit doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        userId: formData.userId || null,
        department:
          formData.department?.value ||
          formData.department?._id ||
          null,
      };

      if (mode === 'add') {
        const { data } = await axios.post('/api/doctor/add', payload);
        if (data.success) {
          toast.success(data.message);
          fetchDoctors();
          setShowModal(false);
        } else toast.error(data.message);
      } else if (mode === 'edit' && selectedDoctor) {
        const { data } = await axios.post('/api/doctor/update', {
          doctorId: selectedDoctor._id,
          ...payload,
        });
        if (data.success) {
          toast.success(data.message);
          fetchDoctors();
          setShowModal(false);
        } else toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSelectedDoctor(null);
      setFormData({
        userId: null,
        name: '',
        specialty: '',
        phone: '',
        gender: 'Male',
        email: '',
        experience: '',
        rating: 0,
        patients: 0,
        status: 'Available',
        department: null,
      });
    }
  };

  const handleAddDoctor = () => {
    setMode('add');
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setMode('edit');
    setFormData({
      userId: doctor.userId || null,
      name: doctor.name || '',
      age: doctor.age || '',
      gender: doctor.gender || 'Male',
      phone: doctor.phone || '',
      email: doctor.email || '',
      specialty: doctor.specialty || '',
      experience: doctor.experience || '',
      patients: doctor.patients || 0,
      status: doctor.status || 'Available',
      department: doctor.department
        ? { value: doctor.department._id, label: doctor.department.name }
        : null,
    });
    setShowModal(true);
  };

  const deleteDoctor = async (id) => {
    try {
      const { data } = await axios.delete('/api/doctor/delete', {
        data: { doctorId: id },
      });
      if (data.success) {
        toast.success(data.message);
        fetchDoctors();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (updated[type].includes(value)) {
        updated[type] = updated[type].filter((v) => v !== value);
      } else {
        updated[type].push(value);
      }
      return updated;
    });
  };

  const resetFilters = () => {
    setFilters({
      status: [],
      specialty: [],
    });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      doctor.name?.toLowerCase().includes(query) ||
      doctor.specialty?.toLowerCase().includes(query);

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(doctor.status);

    const matchesSpecialty =
      filters.specialty.length === 0 ||
      filters.specialty.includes(doctor.specialty);

    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  return (
    <div className='p-8 space-y-6'>
      <DoctorHeader onAddDoctor={handleAddDoctor} />

      <DoctorSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        toggleFilter={toggleFilter}
        resetFilters={resetFilters}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        filterRef={filterRef}
      />

      <DoctorTable
        doctors={filteredDoctors}
        onEdit={handleEditDoctor}
        onDelete={deleteDoctor}
      />

      <DoctorFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        selectedDoctor={selectedDoctor}
        handleSubmit={handleSubmit}
        departments={departments}
        doctorUsers={availableDoctorUsers}
      />
    </div>
  );
};

export default Doctors;
