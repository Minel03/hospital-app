import React from 'react';
import { Icons } from '../../../context/AppContext';

const BedsList = ({ filteredRooms, openEditRoomModal, openEditBedModal }) => {
  const { BedSingle, DoorOpen } = Icons;
  return (
    <div>
      {/* Rooms & Beds */}
      <div className='space-y-6'>
        {filteredRooms.map(([roomNumber, roomBeds]) => {
          const firstBed = roomBeds[0];
          const occupied = roomBeds.filter(
            (b) => b.status === 'Occupied',
          ).length;
          return (
            <div
              key={roomNumber}
              className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm'>
              {/* Room Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <DoorOpen className='w-6 h-6 text-blue-600' />
                  <div>
                    <h3 className='font-semibold text-gray-900'>
                      Room {roomNumber}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {firstBed?.room?.type} • Floor {firstBed?.room?.floor} •{' '}
                      {firstBed?.room?.department?.name}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='text-sm text-gray-500'>
                    {occupied} / {roomBeds.length} Occupied
                  </div>
                  {/* ✅ Edit Room Button */}
                  <button
                    onClick={() => openEditRoomModal(firstBed.room)}
                    className='flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition'>
                    Edit Room
                  </button>
                </div>
              </div>

              {/* Beds Grid */}
              <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-6 gap-4'>
                {roomBeds.map((bed) => {
                  const statusColor =
                    bed.status === 'Available'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : bed.status === 'Occupied'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200';
                  return (
                    <div
                      key={bed._id}
                      className={`p-4 rounded-lg border ${statusColor} hover:shadow-md transition cursor-pointer`}
                      onClick={() => openEditBedModal(bed)}>
                      <div className='flex items-center justify-between mb-2'>
                        <BedSingle className='w-5 h-5' />
                        <span className='text-xs font-medium'>
                          {bed.status}
                        </span>
                      </div>
                      <p className='font-semibold text-sm'>
                        Bed {bed.bedNumber}
                      </p>
                      <p className='text-xs mt-1'>
                        {bed.currentPatient?.name || 'No Patient'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BedsList;
