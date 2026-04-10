import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useAppContext, Icons } from '../../context/AppContext';
import PageHeader from '../../components/PageHeader';
import StaffSearchFilter from './components/StaffSearchFilter';
import StaffTable from './components/StaffTable';
import StaffFormModal from './components/StaffFormModal';

const Staff = () => {
  const { axios, userData } = useAppContext();
  const isAdmin = userData?.role === 'admin';

  const [staff, setStaff] = useState([]);
  const [staffUsers, setStaffUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    userId: null,
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    role: 'Nurse',
    department: '',
    experience: '',
    status: 'Active',
  });

  // Fetch staff and departments
  const fetchStaff = async () => {
    try {
      const res = await axios.get('/api/staff/list');
      if (res.data.success) setStaff(res.data.staff);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('/api/department/list');
      if (res.data.success) setDepartments(res.data.departments);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fetchStaffUsers = async () => {
    try {
      const { data } = await axios.get('/api/user/all');
      if (data.success)
        setStaffUsers(data.users.filter((u) => u.role === 'staff'));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
    fetchStaffUsers();
  }, []);

  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: d.name,
  }));

  // Users not yet linked to any staff profile
  const linkedStaffUserIds = new Set(
    staff.filter((s) => s.userId).map((s) => s.userId.toString())
  );
  const availableStaffUsers = staffUsers.filter(
    (u) => !linkedStaffUserIds.has(u._id.toString())
  );

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !filterDepartment ||
      (member.department?._id || member.department) === filterDepartment;

    const matchesStatus = !filterStatus || member.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Add/Edit Staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        const res = await axios.put('/api/staff/update', {
          staffId: editingStaff._id,
          ...formData,
          userId: formData.userId || null,
        });
        if (res.data.success) toast.success(res.data.message);
        else toast.error(res.data.message);
      } else {
        const res = await axios.post('/api/staff/add', {
          ...formData,
          userId: formData.userId || null,
        });
        if (res.data.success) toast.success(res.data.message);
        else toast.error(res.data.message);
      }
      fetchStaff();
      setShowAddModal(false);
      setEditingStaff(null);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      userId: staffMember.userId || null,
      name: staffMember.name,
      age: staffMember.age,
      gender: staffMember.gender,
      phone: staffMember.phone,
      email: staffMember.email,
      role: staffMember.role,
      department: staffMember.department?._id || staffMember.department || '',
      experience: staffMember.experience,
      status: staffMember.status,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?'))
      return;
    try {
      const res = await axios.delete('/api/staff/delete', {
        data: { staffId },
      });
      if (res.data.success) toast.success(res.data.message);
      else toast.error(res.data.message);
      fetchStaff();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      userId: null,
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      role: 'Nurse',
      department: '',
      experience: '',
      status: 'Active',
    });
  };

  const { Users, User, Clock, XCircle } = Icons;

  const stats = [
    { 
      label: 'Total Staff', 
      value: staff.length, 
      icon: Users,
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Active',
      value: staff.filter((s) => s.status === 'Active').length,
      icon: User,
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'On Leave',
      value: staff.filter((s) => s.status === 'On Leave').length,
      icon: Clock,
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Inactive',
      value: staff.filter((s) => s.status === 'Inactive').length,
      icon: XCircle,
      bgColor: 'bg-gray-50 dark:bg-gray-900/30',
      textColor: 'text-gray-600 dark:text-gray-400'
    },
  ];

  return (
    <div className='p-8 space-y-8'>
      <PageHeader
        title='Hospital Staff'
        subtitle='Manage hospital personnel and roles'
        buttonLabel={isAdmin ? 'Add Staff' : null}
        onButtonClick={isAdmin ? () => {
          resetForm();
          setEditingStaff(null);
          setShowAddModal(true);
        } : null}
        stats={stats}
      />

      <StaffSearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterDepartment={filterDepartment}
        setFilterDepartment={setFilterDepartment}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        departments={departments}
      />

      <StaffTable
        staff={filteredStaff}
        onEdit={handleEdit}
        onDelete={handleDelete}
        userData={userData}
      />

      <StaffFormModal
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingStaff={editingStaff}
        departmentOptions={departmentOptions}
        staffUsers={availableStaffUsers}
      />
    </div>
  );
};

export default Staff;
