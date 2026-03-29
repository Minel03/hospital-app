import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
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

  return (
    <div className='p-8 space-y-6'>
      <PatientHeader onAddPatient={handleAddPatient} />

      <PatientSearchFilter />

      <PatientTable
        patients={patients}
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
