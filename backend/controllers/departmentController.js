import departmentModel from '../models/departmentModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import staffModel from '../models/staffModel.js';
import admissionModel from '../models/admissionModel.js';
import bedModel from '../models/bedModel.js';

// Create a new department
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

    if (!name || !head) {
      return res
        .status(400)
        .json({ success: false, message: 'Name and Head are required.' });
    }

    const existing = await departmentModel.findOne({ name });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: 'Department already exists.' });
    }

    const department = new departmentModel({
      name,
      head,
      doctors: doctors ?? 0,
      nurses: nurses ?? 0,
      patients: patients ?? 0,
      beds: beds ?? 0,
      phone: phone ?? '',
      status: status ?? 'Active',
      description: description ?? '',
    });

    await department.save();

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      department,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId)
      return res
        .status(400)
        .json({ success: false, message: 'Department ID is required' });

    const department = await departmentModel.findByIdAndDelete(departmentId);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: 'Department not found' });

    res.json({
      success: true,
      message: 'Department deleted successfully',
      department,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a department (with optional incremental updates)
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
      increment,
    } = req.body;

    if (!departmentId)
      return res
        .status(400)
        .json({ success: false, message: 'Department ID is required' });

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (head !== undefined) updateFields.head = head;
    if (phone !== undefined) updateFields.phone = phone;
    if (status !== undefined) updateFields.status = status;
    if (description !== undefined) updateFields.description = description;

    let updatedDepartment;

    if (increment) {
      // Increment numeric fields
      const incFields = {};
      if (doctors !== undefined) incFields.doctors = doctors;
      if (nurses !== undefined) incFields.nurses = nurses;
      if (patients !== undefined) incFields.patients = patients;
      if (beds !== undefined) incFields.beds = beds;

      updatedDepartment = await departmentModel.findByIdAndUpdate(
        departmentId,
        {
          ...updateFields,
          ...(Object.keys(incFields).length ? { $inc: incFields } : {}),
        },
        { new: true, runValidators: true },
      );
    } else {
      // Replace numeric fields
      if (doctors !== undefined) updateFields.doctors = doctors;
      if (nurses !== undefined) updateFields.nurses = nurses;
      if (patients !== undefined) updateFields.patients = patients;
      if (beds !== undefined) updateFields.beds = beds;

      updatedDepartment = await departmentModel.findByIdAndUpdate(
        departmentId,
        updateFields,
        { new: true, runValidators: true },
      );
    }

    if (!updatedDepartment)
      return res
        .status(404)
        .json({ success: false, message: 'Department not found' });

    res.json({
      success: true,
      message: 'Department updated successfully',
      department: updatedDepartment,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get a department by ID
export const getDepartmentById = async (req, res) => {
  try {
    const { departmentId } = req.body;
    if (!departmentId)
      return res
        .status(400)
        .json({ success: false, message: 'Department ID is required' });

    const department = await departmentModel.findById(departmentId);
    if (!department)
      return res
        .status(404)
        .json({ success: false, message: 'Department not found' });

    res.json({ success: true, department });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all departments
export const getAllDepartments = async (req, res) => {
  try {
    const [departments, doctors, staff, admissions, beds] = await Promise.all([
      departmentModel.find(),
      doctorModel.find(),
      staffModel.find(),
      admissionModel.find({ status: 'Admitted' }),
      bedModel.find(), // ← add this
    ]);

    const enriched = departments.map((dept) => {
      const deptId = dept._id.toString();

      const doctorCount = doctors.filter(
        (d) => d.department?.toString() === deptId,
      ).length;

      const staffCount = staff.filter(
        (s) => s.department?.toString() === deptId,
      ).length;

      const activeAdmissions = admissions.filter(
        (a) => a.department?.toString() === deptId,
      );

      const deptBeds = beds.filter((b) => b.department?.toString() === deptId);

      const totalBeds = deptBeds.length;
      const occupiedBeds = deptBeds.filter(
        (b) => b.status === 'Occupied',
      ).length;
      const availableBeds = deptBeds.filter(
        (b) => b.status === 'Available',
      ).length;

      return {
        ...dept.toObject(),
        doctors: doctorCount,
        staff: staffCount,
        patients: activeAdmissions.length, // actively admitted patients
        totalBeds, // total beds in department
        occupiedBeds, // beds currently occupied
        availableBeds, // beds currently free
      };
    });

    res.json({ success: true, departments: enriched });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
