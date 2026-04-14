import React from 'react';
import { Icons } from '../../../context/AppContext';

const BedsList = ({ filteredRooms, openEditRoomModal, openEditBedModal, userData }) => {
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
                  {/* ✅ Edit Room Button - Admin Only */}
                  {userData?.role === 'admin' && (
                    <button
                      onClick={() => openEditRoomModal(firstBed.room)}
                      className='flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                      Edit Room
                    </button>
                  )}
                </div>
              </div>

              {/* Beds Grid - Scrollable for many beds */}
              <div className='max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
                <div 
                  className={`grid gap-3 ${
                    roomBeds.length > 24 
                      ? 'grid-cols-3 md:grid-cols-5 lg:grid-cols-10' 
                      : roomBeds.length > 12
                        ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8'
                        : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
                  }`}>
                  {roomBeds.map((bed) => {
                    const statusColor =
                      bed.status === 'Available'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800'
                        : bed.status === 'Occupied'
                          ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-400 dark:border-yellow-800';
                    
                    const isCompact = roomBeds.length > 12;

                    return (
                      <div
                        key={bed._id}
                        className={`rounded-xl border ${statusColor} hover:shadow-md transition-all duration-200 ${
                          userData?.role === 'admin' ? 'cursor-pointer' : 'cursor-default'
                        } ${isCompact ? 'p-3' : 'p-4'}`}
                        onClick={() => userData?.role === 'admin' && openEditBedModal(bed)}>
                        <div className={`flex items-center justify-between ${isCompact ? 'mb-1' : 'mb-2'}`}>
                          <BedSingle className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
                          <span className={`font-bold uppercase tracking-tighter ${isCompact ? 'text-[8px]' : 'text-xs'}`}>
                            {bed.status}
                          </span>
                        </div>
                        <p className={`font-bold ${isCompact ? 'text-xs' : 'text-sm'}`}>
                          B-{bed.bedNumber}
                        </p>
                        {!isCompact && (
                          <p className='text-[10px] mt-1 opacity-80 font-medium truncate'>
                            {bed.currentPatient?.name || 'Vacant'}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BedsList;
