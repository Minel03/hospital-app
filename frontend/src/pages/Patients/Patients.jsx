import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, Icons } from '../../context/AppContext';
import { toast } from 'react-toastify';

import PatientHeader from '../Patients/components/PatientHeader';
import PatientSearchFilter from '../Patients/components/PatientSearchFilter';
import PatientTable from '../Patients/components/PatientTable';
import PatientFormModal from '../Patients/components/PatientFormModal';
import PatientViewModal from '../Patients/components/PatientViewModal';

const Patients = () => {
  const { axios, patients, fetchPatients } = useAppContext();

  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: [],
    bloodType: [],
    status: [],
  });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    bloodType: 'A+',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    fetchPatients();
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'add') {
        const { data } = await axios.post('/api/patient/add', formData);

        if (data.success) {
          toast.success(data.message);
          fetchPatients();
          setShowModal(false);
        } else toast.error(data.message);
      } else if (mode === 'edit' && selectedPatient) {
        const { data } = await axios.post('/api/patient/update', {
          patientId: selectedPatient._id, // send ID in body
          ...formData, // spread the rest of form data
        });

        if (data.success) {
          toast.success(data.message);
          fetchPatients();
          setShowModal(false);
        } else toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setSelectedPatient(null);

      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        email: '',
        address: '',
        bloodType: 'A+',
        allergies: '',
        medicalHistory: '',
      });
    }
  };

  const handleAddPatient = () => {
    setMode('add');
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setMode('edit');
    setSelectedPatient(patient);

    setFormData({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || 'Male',
      phone: patient.phone || '',
      email: patient.email || '',
      address: patient.address || '',
      bloodType: patient.bloodType || 'A+',
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
    });

    setShowModal(true);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const deletePatient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?'))
      return;
    try {
      const { data } = await axios.delete('/api/patient/delete', {
        data: { patientId: id },
      });

      if (data.success) {
        toast.success(data.message);
        fetchPatients();
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
      gender: [],
      bloodType: [],
      status: [],
    });
  };
  // Filter and search patients before passing to table
  const filteredPatients = patients.filter((patient) => {
    // Search filter
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      patient.name?.toLowerCase().includes(query) ||
      patient.phone?.toLowerCase().includes(query) ||
      patient._id?.toLowerCase().includes(query);

    // Gender filter
    const matchesGender =
      filters.gender.length === 0 || filters.gender.includes(patient.gender);

    // Blood Type filter
    const matchesBlood =
      filters.bloodType.length === 0 ||
      filters.bloodType.includes(patient.bloodType);

    // Status filter
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(patient.status);

    return matchesSearch && matchesGender && matchesBlood && matchesStatus;
  });

  const { Users, User, Activity } = Icons;
  const stats = [
    { 
      label: 'Total Patients', 
      value: patients.length, 
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Male', 
      value: patients.filter(p => p.gender === 'Male').length, 
      icon: User,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Female', 
      value: patients.filter(p => p.gender === 'Female').length, 
      icon: User,
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      label: 'Active Records', 
      value: patients.length, 
      icon: Activity,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
  ];

  return (
    <div className='p-8 space-y-6'>
      <PatientHeader onAddPatient={handleAddPatient} stats={stats} />

      <PatientSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        toggleFilter={toggleFilter}
        resetFilters={resetFilters}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        filterRef={filterRef}
      />

      <PatientTable
        patients={filteredPatients}
        onView={handleViewPatient}
        onEdit={handleEditPatient}
        onDelete={deletePatient}
      />

      <PatientFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        selectedPatient={selectedPatient}
        fetchPatients={fetchPatients}
        setSelectedPatient={setSelectedPatient}
        handleSubmit={handleSubmit}
      />

      <PatientViewModal
        showViewModal={showViewModal}
        setShowViewModal={setShowViewModal}
        selectedPatient={selectedPatient}
      />
    </div>
  );
};

export default Patients;
