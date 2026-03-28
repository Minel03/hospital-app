import React, { useEffect, useState, useRef } from 'react';
import { Icons, useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import PatientHeader from '../components/Patient/PatientHeader';
import PatientSearchFilter from '../components/Patient/PatientSearchFilter';
import PatientTable from '../components/Patient/PatientTable';

const Patients = () => {
  const { Eye, Edit, Trash, Phone, Mail, X } = Icons;
  const { axios, patients, fetchPatients } = useAppContext();

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add'); // 'add' or 'edit'
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

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const [filters, setFilters] = useState({
    gender: [],
    bloodType: [],
    status: [],
  });
  const [filteredPatients, setFilteredPatients] = useState([]);
  const filterRef = useRef(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Click outside to close filter popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update filtered patients whenever patients, searchQuery, or filters change
  useEffect(() => {
    let temp = [...patients];

    // Search by name, ID, or phone
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      temp = temp.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          p._id.toString().padStart(4, '0').includes(q),
      );
    }

    // Filter by gender
    if (filters.gender.length > 0) {
      temp = temp.filter((p) => filters.gender.includes(p.gender));
    }

    // Filter by blood type
    if (filters.bloodType.length > 0) {
      temp = temp.filter((p) => filters.bloodType.includes(p.bloodType));
    }

    // Filter by status
    if (filters.status.length > 0) {
      temp = temp.filter((p) => filters.status.includes(p.status));
    }

    setFilteredPatients(temp);
  }, [patients, searchQuery, filters]);

  // Toggle filter selection
  const toggleFilter = (category, value) => {
    setFilters((prev) => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  // Reset all filters
  const resetFilters = () =>
    setFilters({ gender: [], bloodType: [], status: [] });

  // Handle Add / Edit submit
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
        const { data } = await axios.put(
          `/api/patient/update/${selectedPatient._id}`,
          formData,
        );
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

  // Edit patient
  const handleEditPatient = (patient) => {
    setMode('edit');
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodType: patient.bloodType,
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
    });
    setShowModal(true);
  };

  // View patient
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Delete patient
  const deletePatient = async (id) => {
    try {
      const { data } = await axios.delete('/api/patient/delete', {
        data: { patientId: id },
      });
      if (data.success) {
        toast.success(data.message);
        fetchPatients();
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className='p-8 space-y-6'>
      <PatientHeader />
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

      {/* Patients Table */}
      <PatientTable
        patients={filteredPatients}
        onEdit={handleEditPatient}
        onView={handleViewPatient}
        onDelete={deletePatient}
      />

      {/* Add/Edit Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {mode === 'add' ? 'Add New Patient' : 'Edit Patient'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
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
                }}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-4'>
              {/* Form fields */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Name */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='John Doe'
                  />
                </div>

                {/* Age */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Age
                  </label>
                  <input
                    type='number'
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='25'
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Other'>Other</option>
                  </select>
                </div>

                {/* Blood Type */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Blood Type
                  </label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodType: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                      (bt) => (
                        <option
                          key={bt}
                          value={bt}>
                          {bt}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='(123) 456-7890'
                  />
                </div>

                {/* Email */}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Email *
                  </label>
                  <input
                    type='email'
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='patient@email.com'
                  />
                </div>
              </div>

              {/* Address / Allergies / Medical History */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Address
                </label>
                <input
                  type='text'
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                  placeholder='123 Main St'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Allergies
                </label>
                <input
                  type='text'
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Medical History
                </label>
                <textarea
                  rows={3}
                  value={formData.medicalHistory}
                  onChange={(e) =>
                    setFormData({ ...formData, medicalHistory: e.target.value })
                  }
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              {/* Buttons */}
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={() => {
                    setShowModal(false);
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
                  }}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'>
                  Cancel
                </button>

                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                  {mode === 'add' ? 'Add Patient' : 'Update Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedPatient && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl'>
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-2xl font-bold text-gray-900'>
                Patient Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>

            {/* Profile Info */}
            <div className='p-6 space-y-6'>
              {/* Profile Card */}
              <div className='flex items-center gap-4'>
                <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold'>
                  {selectedPatient.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h4 className='text-xl font-semibold text-gray-900'>
                    {selectedPatient.name}
                  </h4>
                  <p className='text-gray-500'>{selectedPatient.email}</p>
                  <p className='text-gray-500'>{selectedPatient.phone}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Age</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.age}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Gender</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.gender}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Blood Type</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.bloodType}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg'>
                  <p className='text-gray-500 text-sm'>Status</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.status}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
                  <p className='text-gray-500 text-sm'>Address</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.address}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
                  <p className='text-gray-500 text-sm'>Allergies</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.allergies || 'None'}
                  </p>
                </div>

                <div className='bg-gray-50 p-4 rounded-lg sm:col-span-2'>
                  <p className='text-gray-500 text-sm'>Medical History</p>
                  <p className='text-gray-900 font-medium'>
                    {selectedPatient.medicalHistory || 'No records'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <div className='pt-4 flex justify-end'>
                <button
                  onClick={() => setShowViewModal(false)}
                  className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
