import bedModel from '../models/bedModel.js';

export const addBed = async (req, res) => {
  try {
    const bed = new bedModel(req.body);
    await bed.save();
    res.json({ success: true, message: 'Bed added successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllBeds = async (req, res) => {
  try {
    const beds = await bedModel
      .find()
      .populate('department')
      .populate('currentPatient');
    res.json({ success: true, beds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAvailableBedsByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const beds = await bedModel.find({
      department: departmentId,
      status: 'Available', // ← only available beds
    });
    res.json({ success: true, beds });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateBed = async (req, res) => {
  try {
    const { bedId, ...rest } = req.body;
    if (!bedId)
      return res.json({ success: false, message: 'Bed ID is required' });

    const updated = await bedModel.findByIdAndUpdate(bedId, rest, {
      new: true,
    });
    if (!updated) return res.json({ success: false, message: 'Bed not found' });

    res.json({ success: true, message: 'Bed updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBed = async (req, res) => {
  try {
    const { bedId } = req.body;
    if (!bedId)
      return res.json({ success: false, message: 'Bed ID is required' });

    const bed = await bedModel.findById(bedId);
    if (bed.status === 'Occupied')
      return res.json({
        success: false,
        message: 'Cannot delete an occupied bed',
      });

    await bedModel.findByIdAndDelete(bedId);
    res.json({ success: true, message: 'Bed deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
