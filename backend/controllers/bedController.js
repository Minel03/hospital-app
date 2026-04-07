import bedModel from '../models/bedModel.js';
import roomModel from '../models/roomModel.js';

export const addBed = async (req, res) => {
  try {
    const { room, bedNumber } = req.body;

    const roomExists = await roomModel.findById(room);
    if (!roomExists) {
      return res.json({ success: false, message: 'Room not found' });
    }

    const bed = new bedModel({
      room,
      bedNumber,
    });

    await bed.save();

    res.json({ success: true, message: 'Bed added successfully', bed });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBeds = async (req, res) => {
  try {
    const beds = await bedModel
      .find()
      .populate({
        path: 'room',
        populate: { path: 'department' }, // nested populate for department name
      })
      .populate('currentPatient', 'name');

    res.json({ success: true, beds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAvailableBedsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;

    const beds = await bedModel.find({ status: 'Available' }).populate({
      path: 'room',
      match: { department: departmentId },
    });

    const filteredBeds = beds.filter((bed) => bed.room !== null);

    res.json({ success: true, beds: filteredBeds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateBed = async (req, res) => {
  try {
    const { bedId, ...rest } = req.body;

    if (!bedId) {
      return res.json({ success: false, message: 'Bed ID is required' });
    }

    const updated = await bedModel.findByIdAndUpdate(bedId, rest, {
      returnDocument: 'after',
    });

    if (!updated) {
      return res.json({ success: false, message: 'Bed not found' });
    }

    res.json({ success: true, message: 'Bed updated successfully', updated });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const { bedId } = req.body;

    if (!bedId) {
      return res.json({ success: false, message: 'Bed ID is required' });
    }

    const bed = await bedModel.findById(bedId);

    if (!bed) {
      return res.json({ success: false, message: 'Bed not found' });
    }

    if (bed.status === 'Occupied') {
      return res.json({
        success: false,
        message: 'Cannot delete an occupied bed',
      });
    }

    await bedModel.findByIdAndDelete(bedId);

    res.json({ success: true, message: 'Bed deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAvailableBeds = async (req, res) => {
  try {
    const status = req.query.status || 'Available'; // default to Available

    const beds = await bedModel
      .find({ status }) // filter by status
      .populate({
        path: 'room',
        populate: { path: 'department' },
      });

    res.json({ success: true, beds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
