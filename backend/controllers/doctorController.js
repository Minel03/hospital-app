import doctorModel from '../models/doctorModel.js';
import departmentModel from '../models/departmentModel.js'; // ← import this

export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      specialty,
      experience,
      patients,
      rating,
      status,
      department,
    } = req.body;

    const doctor = new doctorModel({
      name,
      age,
      gender,
      phone,
      email,
      specialty,
      experience,
      patients,
      rating,
      status,
      department,
    });
    await doctor.save();

    // ← increment doctors count in department
    if (department) {
      await departmentModel.findByIdAndUpdate(department, {
        $inc: { doctors: 1 },
      });
    }

    res.json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { doctorId, department, ...rest } = req.body;

    if (!doctorId)
      return res.json({ success: false, message: 'Doctor ID is required' });

    // Get old doctor to check if department changed
    const oldDoctor = await doctorModel.findById(doctorId);
    if (!oldDoctor)
      return res.json({ success: false, message: 'Doctor not found' });

    const oldDepartmentId = oldDoctor.department?.toString();
    const newDepartmentId = department?.toString();

    // If department changed, update counts
    if (oldDepartmentId !== newDepartmentId) {
      // ← decrement old department
      if (oldDepartmentId) {
        await departmentModel.findByIdAndUpdate(oldDepartmentId, {
          $inc: { doctors: -1 },
        });
      }
      // ← increment new department
      if (newDepartmentId) {
        await departmentModel.findByIdAndUpdate(newDepartmentId, {
          $inc: { doctors: 1 },
        });
      }
    }

    await doctorModel.findByIdAndUpdate(
      doctorId,
      { ...rest, department },
      { new: true },
    );

    res.json({ success: true, message: 'Doctor updated successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId)
      return res.json({ success: false, message: 'Doctor ID is required' });

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor)
      return res.json({ success: false, message: 'Doctor not found' });

    // ← decrement department count on delete
    if (doctor.department) {
      await departmentModel.findByIdAndUpdate(doctor.department, {
        $inc: { doctors: -1 },
      });
    }

    await doctorModel.findByIdAndDelete(doctorId);

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find().populate('department');
    res.json({ success: true, doctors });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId)
      return res.json({ success: false, message: 'Doctor ID is required' });

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor)
      return res.json({ success: false, message: 'Doctor not found' });

    res.json({ success: true, doctor });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
