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
              className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all'>
              {/* Room Header */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-3'>
                  <DoorOpen className='w-6 h-6 text-blue-600' />
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      Room {roomNumber}
                    </h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                      {firstBed?.room?.type} • Floor {firstBed?.room?.floor} •{' '}
                      {firstBed?.room?.department?.name}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>
                    {occupied} / {roomBeds.length} Occupied
                  </div>
                  {/* ✅ Edit Room Button */}
                  <button
                    onClick={() => openEditRoomModal(firstBed.room)}
                    className='flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                    Edit Room
                  </button>
                </div>
              </div>

              {/* Beds Grid */}
              <div className='grid grid-cols-2  md:grid-cols-3 lg:grid-cols-6 gap-4'>
                {roomBeds.map((bed) => {
                  const statusColor =
                    bed.status === 'Available'
                      ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800'
                      : bed.status === 'Occupied'
                        ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800';
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
                      <p className='text-xs mt-1 opacity-80'>
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
