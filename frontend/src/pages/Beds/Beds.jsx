import React, { useEffect, useState } from 'react';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import BedsHeader from './components/BedsHeader';
import BedsSearchFilter from './components/BedsSearchFilter';
import BedsList from './components/BedsList';
import BedsModal from './components/BedsModal';

const Beds = () => {
  const { Search, Filter, Plus, BedSingle, BedDouble, DoorOpen } = Icons;
  const { axios } = useAppContext();

  // --- State ---
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRooms, setExpandedRooms] = useState({});
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
  });

  // --- Room Modal ---
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomMode, setRoomMode] = useState('add'); // 'add' | 'edit'
  const [roomForm, setRoomForm] = useState({
    roomNumber: '',
    floor: '',
    type: 'General',
    department: '',
    capacity: '',
  });
  const [editingRoomId, setEditingRoomId] = useState(null);

  // --- Bed Modal ---
  const [showBedModal, setShowBedModal] = useState(false);
  const [bedMode, setBedMode] = useState('add'); // 'add' | 'edit'
  const [bedForm, setBedForm] = useState({
    roomId: '',
    status: 'Available',
    numberOfBeds: 1,
  });
  const [editingBedId, setEditingBedId] = useState(null);

  // --- Fetch Rooms & Beds ---
  const fetchRooms = async () => {
    try {
      const { data } = await axios.get('/api/room/list');
      if (data.success) setRooms(data.rooms);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchBeds = async () => {
    try {
      const { data } = await axios.get('/api/bed/list');
      if (data.success) {
        setBeds(data.beds);
        computeStats(data.beds);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const { data } = await axios.get('/api/department/list');
      if (data.success) setDepartments(data.departments);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBeds();
    fetchDepartments();
  }, []);

  // --- Compute Stats ---
  const computeStats = (beds) => {
    const roomsSet = new Set(beds.map((b) => b.room?.roomNumber)); // ✅
    setStats({
      totalRooms: roomsSet.size,
      totalBeds: beds.length,
      occupiedBeds: beds.filter((b) => b.status === 'Occupied').length,
      availableBeds: beds.filter((b) => b.status === 'Available').length,
    });
  };

  // --- Modal Handlers ---
  const openAddRoomModal = () => {
    setRoomMode('add');
    setRoomForm({
      roomNumber: '',
      floor: '',
      type: 'General',
      department: '',
      capacity: '',
    });
    setEditingRoomId(null);
    setShowRoomModal(true);
  };

  const openEditRoomModal = (room) => {
    setRoomMode('edit');
    setRoomForm({
      roomNumber: room.roomNumber,
      floor: room.floor,
      type: room.type,
      department: room.department?._id || '',
      capacity: room.capacity,
    });
    setEditingRoomId(room._id);
    setShowRoomModal(true);
  };

  const openAddBedModal = () => {
    setBedMode('add');
    setBedForm({
      roomId: '',
      status: 'Available',
      numberOfBeds: 1,
    });
    setEditingBedId(null);
    setShowBedModal(true);
  };

  const openEditBedModal = (bed) => {
    setBedMode('edit');
    setBedForm({
      roomId: bed.room?._id || bed.room, // ✅ was: bed.roomId
      status: bed.status,
      numberOfBeds: 1,
    });
    setEditingBedId(bed._id);
    setShowBedModal(true);
  };

  // --- Submit Handlers ---
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (roomMode === 'add') {
        await axios.post('/api/room/add', roomForm);
        toast.success('Room added successfully');
      } else {
        await axios.put('/api/room/update', {
          roomId: editingRoomId,
          ...roomForm,
        });
        toast.success('Room updated successfully');
      }
      fetchRooms();
      fetchBeds(); // ✅ add this
      setShowRoomModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBedSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bedMode === 'add') {
        const count = parseInt(bedForm.numberOfBeds || 1);
        for (let i = 0; i < count; i++) {
          await axios.post('/api/bed/add', {
            roomId: bedForm.roomId,
            status: bedForm.status,
          });
        }
        toast.success(`${count} bed(s) added successfully`);
      } else {
        await axios.put('/api/bed/update', {
          bedId: editingBedId,
          roomId: bedForm.roomId,
          status: bedForm.status,
        });
        toast.success('Bed updated successfully');
      }
      fetchBeds();
      setShowBedModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- Rooms & Beds Display ---
  const groupedRooms = beds.reduce((acc, bed) => {
    const room = bed.room?.roomNumber; // ✅ was: bed.roomNumber
    if (!room) return acc;
    if (!acc[room]) acc[room] = [];
    acc[room].push(bed);
    return acc;
  }, {});

  const filteredRooms = Object.entries(groupedRooms).filter(
    ([roomNumber, roomBeds]) => {
      const query = searchQuery.toLowerCase();
      return (
        roomNumber.toLowerCase().includes(query) ||
        roomBeds[0]?.room?.type?.toLowerCase().includes(query) || // ✅ was: bed.type
        roomBeds[0]?.room?.department?.name?.toLowerCase().includes(query) || // ✅
        roomBeds[0]?.room?.floor?.toLowerCase().includes(query) // ✅ was: bed.floor
      );
    },
  );

  const statsConfig = [
    {
      label: 'Total Rooms',
      value: stats.totalRooms,
      color: 'bg-blue-600',
      icon: DoorOpen,
    },
    {
      label: 'Total Beds',
      value: stats.totalBeds,
      color: 'bg-purple-600',
      icon: BedDouble,
    },
    {
      label: 'Occupied Beds',
      value: stats.occupiedBeds,
      color: 'bg-red-500',
      icon: BedSingle,
    },
    {
      label: 'Available Beds',
      value: stats.availableBeds,
      color: 'bg-green-600',
      icon: BedSingle,
    },
  ];

  return (
    <div className='p-8 space-y-6'>
      {/* Header */}
      <BedsHeader
        openAddRoomModal={openAddRoomModal}
        openAddBedModal={openAddBedModal}
        statsConfig={statsConfig}
      />

      <BedsSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <BedsList
        filteredRooms={filteredRooms}
        openEditRoomModal={openEditRoomModal}
        openEditBedModal={openEditBedModal}
      />

      <BedsModal
        showRoomModal={showRoomModal}
        showBedModal={showBedModal}
        roomMode={roomMode}
        bedMode={bedMode}
        roomForm={roomForm}
        setRoomForm={setRoomForm}
        bedForm={bedForm}
        setBedForm={setBedForm}
        handleRoomSubmit={handleRoomSubmit}
        handleBedSubmit={handleBedSubmit}
        setShowRoomModal={setShowRoomModal}
        setShowBedModal={setShowBedModal}
        departments={departments}
        rooms={rooms}
        beds={beds}
      />
    </div>
  );
};

export default Beds;
