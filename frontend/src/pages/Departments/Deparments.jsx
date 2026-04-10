import React, { useEffect, useRef, useState } from 'react';
import { useAppContext, Icons } from '../../context/AppContext';
import { toast } from 'react-toastify';

import PageHeader from '../../components/PageHeader';
import DepartmentSearchFilter from './components/DepartmentSearchFilter';
import DepartmentCardGrid from './components/DepartmentCardGrid';
import DepartmentFormModal from './components/DepartmentFormModal';

const Departments = () => {
  const { axios, fetchDoctors, doctors, userData } = useAppContext();
  const isAdmin = userData?.role === 'admin';
  const { Building2, Stethoscope, Users, HeartPulse } = Icons;

  const [departments, setDepartments] = useState([]);
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
            bgColor: 'bg-blue-50 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400',
            icon: Building2,
          },
          {
            label: 'Total Doctors',
            value: totalDoctors,
            bgColor: 'bg-green-50 dark:bg-green-900/30',
            textColor: 'text-green-600 dark:text-green-400',
            icon: Stethoscope,
          },
          {
            label: 'Total Staff',
            value: totalStaff,
            bgColor: 'bg-purple-50 dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400',
            icon: Users,
          },
          {
            label: 'Active Patients',
            value: totalPatients,
            bgColor: 'bg-orange-50 dark:bg-orange-900/30',
            textColor: 'text-orange-600 dark:text-orange-400',
            icon: HeartPulse,
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
    <div className='p-8 space-y-8'>
      <PageHeader
        title='Departments'
        subtitle='Manage hospital departments and their resources'
        buttonLabel={isAdmin ? 'Add Department' : null}
        onButtonClick={isAdmin ? handleAddDepartment : null}
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
        doctors={doctors}
        userData={userData}
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
