import departmentModel from '../models/departmentModel.js';

export const createDepartment = async (req, res) => {
  try {
    const {
      name,
      head,
      doctors,
      nurses,
      patients,
      beds,
      phone,
      status,
      description,
    } = req.body;

    // Check if required fields are provided
    if (!name || !head) {
      return res.json({
        success: false,
        message: 'Name and Head are required.',
      });
    }

    // Check if department already exists
    const existing = await departmentModel.findOne({ name });
    if (existing) {
      return res.json({
        success: false,
        message: 'Department already exists.',
      });
    }

    // Create new department
    const department = new departmentModel({
      name,
      head,
      doctors: doctors || 0,
      nurses: nurses || 0,
      patients: patients || 0,
      beds: beds || 0,
      phone: phone || '',
      status: status || 'Active',
      description: description || '',
    });

    await department.save();

    res.json({
      success: true,
      message: 'Department created successfully',
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const department = await departmentModel.findByIdAndDelete(departmentId);

    res.json({
      success: true,
      message: 'Department deleted successfully',
      department,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const {
      departmentId,
      name,
      head,
      doctors,
      nurses,
      patients,
      beds,
      phone,
      status,
      description,
    } = req.body;

    const updatedDepartment = await departmentModel.findByIdAndUpdate(
      departmentId,
      {
        name,
        head,
        doctors: doctors || 0,
        nurses: nurses || 0,
        patients: patients || 0,
        beds: beds || 0,
        phone: phone || '',
        status: status || 'Active',
        description: description || '',
      },
      { new: true },
    );

    res.json({
      success: true,
      message: 'Department updated successfully',
      department: updatedDepartment,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Server error', error: error.message });
  }
};

export const getDeparmentById = async (req, res) => {
  try {
    const { departmentId } = req.body;
    const department = await departmentModel.findById(departmentId);
    res.json({
      success: true,
      department,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.find({});
    res.json({
      success: true,
      departments,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
