import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import AdmissionsHeader from './components/AdmissionsHeader';
import AdmissionsSearch from './components/AdmissionsSearch';
import AdmissionsTable from './components/AdmissionsTable';
import AdmissionsModal from './components/AdmissionsModal';
import AdmissionsViewModal from './components/AdmissionsViewModal';

const Admissions = () => {
  const { axios } = useAppContext();

  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [beds, setBeds] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showView, setShowView] = useState(false);

  const [mode, setMode] = useState('add');
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    department: '',
    bed: '',
    admissionDate: '',
    expectedDischargeDate: '',
    diagnosis: '',
  });

  const fetchAdmissions = async () => {
    const { data } = await axios.get('/api/admission/list');
    if (data.success) setAdmissions(data.admissions);
  };

  const fetchPatients = async () => {
    const { data } = await axios.get('/api/patient/list');
    if (data.success) setPatients(data.patients);
  };

  const fetchDoctors = async () => {
    const { data } = await axios.get('/api/doctor/list');
    if (data.success) setDoctors(data.doctors);
  };

  const fetchDepartments = async () => {
    const { data } = await axios.get('/api/department/list');
    if (data.success) setDepartments(data.departments);
  };

  const fetchBeds = async () => {
    const { data } = await axios.get('/api/bed/available');
    if (data.success) setBeds(data.beds);
  };

  useEffect(() => {
    fetchAdmissions();
    fetchPatients();
    fetchDoctors();
    fetchDepartments();
    fetchBeds();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'add') {
        const { data } = await axios.post('/api/admission/admit', formData);

        if (data.success) {
          toast.success(data.message);
          fetchAdmissions();
          fetchBeds();
          setShowModal(false);
        } else toast.error(data.message);
      }

      if (mode === 'edit') {
        const { data } = await axios.post('/api/admission/update', {
          admissionId: selectedAdmission._id,
          ...formData,
        });

        if (data.success) {
          toast.success(data.message);
          fetchAdmissions();
          fetchBeds();
          fetchPatients();
          setShowModal(false);
        } else toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  /* ================= DELETE ================= */

  const deleteAdmission = async (id) => {
    if (!confirm('Delete this admission?')) return;

    const { data } = await axios.post('/api/admission/delete', {
      admissionId: id,
    });

    if (data.success) {
      toast.success(data.message);
      fetchAdmissions();
      fetchBeds();
      fetchPatients();
    }
  };

  /* ================= DISCHARGE ================= */

  const dischargePatient = async (id) => {
    if (!confirm('Discharge patient?')) return;

    const { data } = await axios.post('/api/admission/discharge', {
      admissionId: id,
    });

    if (data.success) {
      toast.success(data.message);
      fetchAdmissions();
      fetchBeds();
      fetchPatients();
    }
  };

  /* ================= MODALS ================= */

  const openAddModal = async () => {
    await fetchBeds(); // Refresh bed availability
    setMode('add');
    setFormData({
      patient: '',
      doctor: '',
      department: '',
      bed: '',
      admissionDate: '',
      expectedDischargeDate: '',
      diagnosis: '',
    });
    setShowModal(true);
  };

  const openEditModal = async (admission) => {
    setMode('edit');
    setSelectedAdmission(admission);

    const [bedsRes, patientsRes] = await Promise.all([
      axios.get('/api/bed/list'),
      axios.get('/api/patient/all'),
    ]);

    if (bedsRes.data.success) setBeds(bedsRes.data.beds);
    if (patientsRes.data.success) setPatients(patientsRes.data.patients);

    setFormData({
      patient: admission.patient._id,
      doctor: admission.doctor._id,
      department: admission.department._id,
      bed: admission.bed._id,
      admissionDate: admission.admissionDate.slice(0, 10),
      expectedDischargeDate: admission.expectedDischargeDate.slice(0, 10),
      diagnosis: admission.diagnosis,
    });

    setShowModal(true);
  };

  const openViewModal = (admission) => {
    setSelectedAdmission(admission);
    setShowView(true);
  };

  const closeModal = async () => {
    setShowModal(false);
    await fetchBeds();
    await fetchPatients();
  };

  /* ================= SEARCH ================= */

  const filteredAdmissions = admissions.filter((a) => {
    const query = searchQuery.toLowerCase();
    return (
      a.patient?.name?.toLowerCase().includes(query) ||
      a.patient?._id?.toLowerCase().includes(query) ||
      a.doctor?.name?.toLowerCase().includes(query) ||
      a.department?.name?.toLowerCase().includes(query) ||
      a.bed?.room?.roomNumber?.toString().includes(query) ||
      a.bed?.bedNumber?.toString().includes(query) ||
      a.diagnosis?.toLowerCase().includes(query) ||
      a.status?.toLowerCase().includes(query)
    );
  });

  /* ================= STATS ================= */

  const admitted = admissions.filter((a) => a.status === 'Admitted').length;
  const discharged = admissions.filter((a) => a.status === 'Discharged').length;

  const stats = [
    { label: 'Total Admissions', value: admissions.length },
    { label: 'Currently Admitted', value: admitted },
    { label: 'Discharged', value: discharged },
  ];

  return (
    <div className='p-8 space-y-6'>
      <AdmissionsHeader
        openAddModal={openAddModal}
        stats={stats}
      />

      <AdmissionsSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <AdmissionsTable
        filteredAdmissions={filteredAdmissions}
        openEditModal={openEditModal}
        openViewModal={openViewModal}
        deleteAdmission={deleteAdmission}
        dischargePatient={dischargePatient}
      />

      <AdmissionsModal
        showModal={showModal}
        mode={mode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        patients={patients}
        doctors={doctors}
        departments={departments}
        beds={beds}
      />

      <AdmissionsViewModal
        showView={showView}
        setShowView={setShowView}
        selectedAdmission={selectedAdmission}
      />
    </div>
  );
};

export default Admissions;
