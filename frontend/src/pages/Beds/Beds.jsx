import React, { useEffect, useState } from 'react';
import Title from '../../components/Title';
import { Icons, useAppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const Beds = () => {
  const {
    Search,
    Filter,
    Plus,
    ChevronDown,
    ChevronUp,
    BedDouble,
    BedSingle,
    DoorOpen,
  } = Icons;
  const { axios } = useAppContext();

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

  const computeStats = (beds) => {
    const rooms = [...new Set(beds.map((b) => b.roomNumber))];
    setStats({
      totalRooms: rooms.length,
      totalBeds: beds.length,
      occupiedBeds: beds.filter((b) => b.status === 'Occupied').length,
      availableBeds: beds.filter((b) => b.status === 'Available').length,
    });
  };

  useEffect(() => {
    fetchBeds();
    fetchDepartments();
  }, []);

  // Group beds by roomNumber
  const groupedRooms = beds.reduce((acc, bed) => {
    const room = bed.roomNumber;
    if (!acc[room]) acc[room] = [];
    acc[room].push(bed);
    return acc;
  }, {});

  // Filter by search
  const filteredRooms = Object.entries(groupedRooms).filter(
    ([roomNumber, beds]) => {
      const query = searchQuery.toLowerCase();
      return (
        roomNumber.toLowerCase().includes(query) ||
        beds[0]?.type?.toLowerCase().includes(query) ||
        beds[0]?.department?.name?.toLowerCase().includes(query) ||
        beds[0]?.floor?.toLowerCase().includes(query)
      );
    },
  );

  const toggleRoom = (roomNumber) => {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomNumber]: !prev[roomNumber],
    }));
  };

  const getRoomStatus = (beds) => {
    const occupied = beds.filter((b) => b.status === 'Occupied').length;
    if (occupied === 0) return 'Available';
    if (occupied === beds.length) return 'Fully Occupied';
    return 'Partially Occupied';
  };

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
      <div className='flex items-center justify-between'>
        <Title
          title='Rooms & Beds'
          subtitle='Manage hospital rooms and bed allocation'
        />
        <button className='flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
          <Plus className='w-5 h-5' />
          <span className='hidden sm:inline'>Add Bed</span>
        </button>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {statsConfig.map((stat, index) => {
          const Icon = stat.icon; // ← add this
          return (
            <div
              key={index}
              className='flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200'>
              <div>
                <p className='text-sm text-gray-500'>{stat.label}</p>
                <p className='text-2xl font-bold text-gray-900'>{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className='w-6 h-6 text-white' />{' '}
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className='flex items-center gap-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='Search by room number, type, floor or department...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
        <button className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50'>
          <Filter className='w-5 h-5' />
          Filter
        </button>
      </div>

      {/* Rooms Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50 border-b border-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8'></th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Room
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Floor
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Department
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Beds
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Occupied
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredRooms.map(([roomNumber, roomBeds]) => {
                const isExpanded = expandedRooms[roomNumber];
                const occupied = roomBeds.filter(
                  (b) => b.status === 'Occupied',
                ).length;
                const roomStatus = getRoomStatus(roomBeds);
                const firstBed = roomBeds[0];

                return (
                  <React.Fragment key={roomNumber}>
                    {/* Room Row */}
                    <tr
                      className='hover:bg-gray-50 cursor-pointer'
                      onClick={() => toggleRoom(roomNumber)}>
                      <td className='px-6 py-4'>
                        {isExpanded ? (
                          <ChevronUp className='w-4 h-4 text-gray-400' />
                        ) : (
                          <ChevronDown className='w-4 h-4 text-gray-400' />
                        )}
                      </td>
                      <td className='px-6 py-4 font-medium text-gray-900'>
                        Room {roomNumber}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {firstBed?.type}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        Floor {firstBed?.floor}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {firstBed?.department?.name}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {roomBeds.length}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {occupied} / {roomBeds.length}
                      </td>
                      <td className='px-6 py-4'>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            roomStatus === 'Available'
                              ? 'bg-green-100 text-green-700'
                              : roomStatus === 'Fully Occupied'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {roomStatus}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Beds */}
                    {isExpanded &&
                      roomBeds.map((bed) => (
                        <tr
                          key={bed._id}
                          className='bg-gray-50 border-l-4 border-blue-200'>
                          <td className='px-6 py-3'></td>
                          <td className='px-6 py-3 text-sm text-gray-500 pl-10'>
                            ↳ Bed {bed.bedNumber}
                          </td>
                          <td className='px-6 py-3 text-sm text-gray-500'>
                            {bed.type}
                          </td>
                          <td className='px-6 py-3 text-sm text-gray-500'>
                            Floor {bed.floor}
                          </td>
                          <td className='px-6 py-3 text-sm text-gray-500'>
                            {bed.department?.name}
                          </td>
                          <td className='px-6 py-3 text-sm text-gray-500'>—</td>
                          <td className='px-6 py-3 text-sm text-gray-500'>
                            {bed.currentPatient?.name || '—'}
                          </td>
                          <td className='px-6 py-3'>
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                bed.status === 'Available'
                                  ? 'bg-green-100 text-green-700'
                                  : bed.status === 'Occupied'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-red-100 text-red-700'
                              }`}>
                              {bed.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })}

              {filteredRooms.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className='px-6 py-8 text-center text-gray-400'>
                    No rooms found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Beds;
