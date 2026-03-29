import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

import DoctorHeader from './components/DoctorHeader';
import DoctorSearchFilter from './components/DoctorSearchFilter';
import DoctorTable from './components/DoctorTable';
import DoctorFormModal from './components/DoctorFormModal';
import DoctorViewModal from './components/DoctorViewModal';

const Doctors = () => {
  const { axios, doctors, fetchDoctors } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: [],
    specialty: [],
  });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    phone: '',
    gender: 'Male',
    email: '',
    experience: '',
    rating: 0,
    patients: 0,
    status: 'Available',
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Add / Edit doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'add') {
        const { data } = await axios.post('/api/doctor/add', formData);
        if (data.success) {
          toast.success(data.message);
          fetchDoctors();
          setShowModal(false);
        } else toast.error(data.message);
      } else if (mode === 'edit' && selectedDoctor) {
        const { data } = await axios.post('/api/doctor/update', {
          doctorId: selectedDoctor._id,
          ...formData,
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
        name: '',
        specialty: '',
        phone: '',
        gender: 'Male',
        email: '',
        experience: '',
        rating: 0,
        patients: 0,
        status: 'Available',
      });
    }
  };

  const handleAddDoctor = () => {
    setMode('add');
    setShowModal(true);
  };

  const handleEditDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name || '',
      age: doctor.age || '',
      gender: doctor.gender || 'Male',
      phone: doctor.phone || '',
      email: doctor.email || '',
      specialty: doctor.specialty || '',
      experience: doctor.experience || '',
      patients: doctor.patients || 0,
      status: doctor.status || 'Available',
    });
    setShowModal(true);
  };

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowViewModal(true);
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

  // Filter & search doctors
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
        onView={handleViewDoctor}
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
        fetchDoctors={fetchDoctors}
        handleSubmit={handleSubmit}
      />

      <DoctorViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedDoctor={selectedDoctor}
      />
    </div>
  );
};

export default Doctors;
