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
    name: '',
    specialty: '',
    phone: '',
    gender: 'Male',
    email: '',
    experience: '',
    rating: 0,
    patients: 0,
    status: 'Available',
    department: null, // <--- add department here
  });

  // Fetch doctors and departments on mount
  useEffect(() => {
    fetchDoctors();
    fetchDepartments();

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

  // Add / Edit doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        department:
          formData.department?.value || // react-select object
          formData.department?._id || // raw populated object
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
        ? { value: doctor.department._id, label: doctor.department.name } // ← format for react-select
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
        departments={departments} // now properly passed
      />
    </div>
  );
};

export default Doctors;
