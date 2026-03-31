import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

import DepartmentHeader from './components/DepartmentHeader';
import DepartmentSearchFilter from './components/DepartmentSearchFilter';
import DepartmentCardGrid from './components/DepartmentCardGrid';
import DepartmentFormModal from './components/DepartmentFormModal';

const Departments = () => {
  const { axios, fetchDoctors } = useAppContext();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]); // <-- Added doctors state
  const [statsDepartment, setStatsDepartment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('add');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: [] });
  const [showFilterPopover, setShowFilterPopover] = useState(false);
  const filterRef = useRef(null);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/department/list');
      if (data.success) {
        setDepartments(data.departments);

        // Compute stats
        const totalDoctors = data.departments.reduce(
          (sum, dept) => sum + (dept.doctors || 0),
          0,
        );
        const totalStaff = data.departments.reduce(
          (sum, dept) => sum + (dept.staff || 0),
          0,
        );
        const totalPatients = data.departments.reduce(
          (sum, dept) => sum + (dept.patients || 0),
          0,
        );

        setStatsDepartment([
          {
            label: 'Total Departments',
            value: data.departments.length,
            color: 'bg-blue-600',
            icon: 'Building2',
          },
          {
            label: 'Total Doctors',
            value: totalDoctors,
            color: 'bg-green-600',
            icon: 'Stethoscope',
          },
          {
            label: 'Total Staff',
            value: totalStaff,
            color: 'bg-purple-600',
            icon: 'Users',
          },
          {
            label: 'Active Patients',
            value: totalPatients,
            color: 'bg-orange-500',
            icon: 'HeartPulse',
          },
        ]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchDoctors(); // <-- Fetch doctors on mount

    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilterPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddDepartment = () => {
    setMode('add');
    setSelectedDepartment(null);
    setShowModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setMode('edit');
    setShowModal(true);
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?'))
      return;

    try {
      const { data } = await axios.post('/api/department/delete', {
        departmentId: id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchDepartments();
      } else toast.error(data.message);
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
    setFilters({ status: [] });
  };

  const filteredDepartments = departments.filter((dept) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = dept.name?.toLowerCase().includes(query);
    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(dept.status);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className='p-8 space-y-6'>
      <DepartmentHeader
        onAddDepartment={handleAddDepartment}
        stats={statsDepartment}
      />

      <DepartmentSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filters={filters}
        toggleFilter={toggleFilter}
        resetFilters={resetFilters}
        showFilterPopover={showFilterPopover}
        setShowFilterPopover={setShowFilterPopover}
        filterRef={filterRef}
      />

      <DepartmentCardGrid
        departments={filteredDepartments}
        onEdit={handleEditDepartment}
        onDelete={handleDeleteDepartment}
        doctors={doctors} // <-- pass doctors if needed in card/grid
      />

      <DepartmentFormModal
        showModal={showModal}
        setShowModal={setShowModal}
        mode={mode}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        fetchDepartments={fetchDepartments}
        doctors={doctors} // <-- pass doctors to modal for "Head" selection
      />
    </div>
  );
};

export default Departments;
