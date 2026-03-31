import staffModel from '../models/staffModel.js';
import departmentModel from '../models/departmentModel.js';

export const addStaff = async (req, res) => {
  try {
    const staff = new staffModel(req.body);
    await staff.save();
    res.json({ success: true, message: 'Staff added successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateStaff = async (req, res) => {
  try {
    const { staffId, ...rest } = req.body;
    if (!staffId)
      return res.json({ success: false, message: 'Staff ID is required' });

    const updated = await staffModel.findByIdAndUpdate(staffId, rest, {
      new: true,
    });
    if (!updated)
      return res.json({ success: false, message: 'Staff not found' });

    res.json({ success: true, message: 'Staff updated successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await staffModel.find().populate('department');
    res.json({ success: true, staff });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.body;
    if (!staffId)
      return res.json({ success: false, message: 'Staff ID is required' });

    await staffModel.findByIdAndDelete(staffId);
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
