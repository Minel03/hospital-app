import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';

import { Icons, useAppContext } from '../../context/AppContext';
import StaffHeader from './components/StaffHeader';

const Staff = () => {
  const { axios } = useAppContext();
  const { Search, Filter, Plus, Phone, Mail, X, Users, Edit, Trash } = Icons;

  const [staff, setStaff] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const departmentOptions = departments.map((d) => ({
    value: d._id,
    label: d.name,
  }));

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
        });
        if (res.data.success) toast.success(res.data.message);
        else toast.error(res.data.message);
      } else {
        const res = await axios.post('/api/staff/add', formData);
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

  const stats = [
    { label: 'Total Staff', value: staff.length, color: 'bg-blue-500' },
    {
      label: 'Active',
      value: staff.filter((s) => s.status === 'Active').length,
      color: 'bg-green-500',
    },
    {
      label: 'On Leave',
      value: staff.filter((s) => s.status === 'On Leave').length,
      color: 'bg-yellow-500',
    },
    {
      label: 'Inactive',
      value: staff.filter((s) => s.status === 'Inactive').length,
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className='p-8 space-y-6'>
      <StaffHeader
        setShowAddModal={setShowAddModal}
        setEditingStaff={setEditingStaff}
        resetForm={resetForm}
        stats={stats}
      />

      {/* Search + Filters */}
      <div className='flex flex-col md:flex-row md:items-center gap-4'>
        {/* Search */}
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search staff, email, or role...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='flex gap-2 flex-wrap'>
          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className='border border-gray-300 px-3 py-2 rounded-lg text-sm'>
            <option value=''>All Departments</option>
            {departments.map((d) => (
              <option
                key={d._id}
                value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className='border border-gray-300 px-3 py-2 rounded-lg text-sm'>
            <option value=''>All Status</option>
            <option value='Active'>Active</option>
            <option value='On Leave'>On Leave</option>
            <option value='Inactive'>Inactive</option>
          </select>
        </div>
      </div>

      {/* Staff List */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <div className='min-w-250'>
            {/* ------------ List Table Title (Desktop Only) ------------ */}
            <div className='hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] items-center py-2 px-3 bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600'>
              <b>Name</b>
              <b>Age</b>
              <b>Gender</b>
              <b>Role</b>
              <b>Department</b>
              <b>Status</b>
              <b className='w-28 text-center'>Actions</b>
            </div>

            {/* ------------ Staff List ------------ */}
            {filteredStaff.map((member) => (
              <div
                key={member._id}
                className='border-b border-gray-200 px-3 py-3 hover:bg-gray-50 grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_2fr_1fr_auto] gap-2 md:gap-0 md:items-center text-sm'>
                {/* Name */}
                <div className='flex flex-col md:flex-row md:items-center gap-1'>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Name
                  </p>
                  <div className='flex items-center gap-2'>
                    <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0'>
                      <span className='text-sm font-medium text-blue-600'>
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div className='flex flex-col'>
                      <p className='font-medium text-gray-900'>{member.name}</p>
                      <p className='text-xs text-gray-500'>ID: {member._id}</p>
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Age
                  </p>
                  <p className='text-gray-900'>{member.age}</p>
                </div>

                {/* Gender */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Gender
                  </p>
                  <p className='text-gray-900'>{member.gender}</p>
                </div>

                {/* Role */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Role
                  </p>
                  <p className='text-gray-900'>{member.role}</p>
                </div>

                {/* Department */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Department
                  </p>
                  <p className='text-gray-900'>
                    {member.department?.name || member.department}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className='md:hidden text-xs text-gray-500 font-medium'>
                    Status
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      member.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : member.status === 'On Leave'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                    {member.status}
                  </span>
                </div>

                {/* Actions */}
                <div className='flex gap-2 md:w-28 justify-start md:justify-center'>
                  <button
                    onClick={() => handleEdit(member)}
                    className='p-2 bg-blue-50 rounded hover:bg-blue-100 flex justify-center'>
                    <Edit className='w-4 h-4 text-blue-700' />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className='p-2 bg-red-50 rounded hover:bg-red-100 flex justify-center'>
                    <Trash className='w-4 h-4 text-red-600' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Modal */}
      {showAddModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                <X className='w-5 h-5' />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className='p-6 space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='Name'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'
                />
                <input
                  type='number'
                  placeholder='Age'
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input
                  type='text'
                  placeholder='Phone'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'
                />
              </div>
              <input
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className='border px-3 py-2 rounded w-full'
              />
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='text'
                  placeholder='Role'
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'
                />
                <Select
                  options={departmentOptions}
                  value={
                    departmentOptions.find(
                      (o) => o.value === formData.department,
                    ) || null
                  }
                  onChange={(selected) =>
                    setFormData({
                      ...formData,
                      department: selected?.value || '',
                    })
                  }
                  placeholder='Select Department'
                  isClearable
                />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <input
                  type='number'
                  placeholder='Experience'
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'
                />
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className='border px-3 py-2 rounded w-full'>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </div>
              <button
                type='submit'
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors'>
                {editingStaff ? 'Update Staff' : 'Add Staff'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
