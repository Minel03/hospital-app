import roomModel from '../models/roomModel.js';
import bedModel from '../models/bedModel.js';

export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, floor, department, capacity } = req.body;

    const existingRoom = await roomModel.findOne({ roomNumber });

    if (existingRoom) {
      return res.json({ success: false, message: 'Room already exists' });
    }

    const room = await roomModel.create({
      roomNumber,
      type,
      floor,
      department,
      capacity,
    });

    // create beds automatically
    const beds = [];

    for (let i = 1; i <= capacity; i++) {
      beds.push({
        room: room._id,
        bedNumber: i,
      });
    }

    await bedModel.insertMany(beds);

    res.json({ success: true, message: 'Room created successfully', room });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomModel.find().populate('department').lean();

    const beds = await bedModel.find().lean();

    const roomMap = {};

    beds.forEach((bed) => {
      if (!roomMap[bed.room]) roomMap[bed.room] = [];
      roomMap[bed.room].push(bed);
    });

    const roomsWithBeds = rooms.map((room) => ({
      ...room,
      beds: roomMap[room._id] || [],
    }));

    res.json({ success: true, rooms: roomsWithBeds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId, ...rest } = req.body;

    const existingRoom = await roomModel.findById(roomId);
    if (!existingRoom) {
      return res.json({ success: false, message: 'Room not found' });
    }

    const updated = await roomModel.findByIdAndUpdate(roomId, rest, {
      returnDocument: 'after',
    });

    // Handle capacity change — add or remove beds
    const newCapacity = parseInt(rest.capacity);
    const oldCapacity = existingRoom.capacity;

    if (newCapacity !== oldCapacity) {
      const existingBeds = await bedModel
        .find({ room: roomId })
        .sort({ bedNumber: 1 });

      if (newCapacity > oldCapacity) {
        // Add missing beds
        const newBeds = [];
        for (let i = oldCapacity + 1; i <= newCapacity; i++) {
          newBeds.push({ room: roomId, bedNumber: i });
        }
        await bedModel.insertMany(newBeds);
      } else if (newCapacity < oldCapacity) {
        // Remove extra beds from the end (only if not occupied)
        const bedsToRemove = existingBeds.slice(newCapacity);
        const occupiedBeds = bedsToRemove.filter(
          (b) => b.status === 'Occupied',
        );

        if (occupiedBeds.length > 0) {
          return res.json({
            success: false,
            message: `Cannot reduce capacity — ${occupiedBeds.length} bed(s) are still occupied`,
          });
        }

        const idsToRemove = bedsToRemove.map((b) => b._id);
        await bedModel.deleteMany({ _id: { $in: idsToRemove } });
      }
    }

    res.json({ success: true, message: 'Room updated successfully', updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const beds = await bedModel.find({ room: roomId });

    const occupied = beds.some((bed) => bed.status === 'Occupied');

    if (occupied) {
      return res.json({
        success: false,
        message: 'Cannot delete room with occupied beds',
      });
    }

    await bedModel.deleteMany({ room: roomId });
    await roomModel.findByIdAndDelete(roomId);

    res.json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
