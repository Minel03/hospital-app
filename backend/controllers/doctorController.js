import doctorModel from '../models/doctorModel.js';

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
    } = req.body;

    const doctorData = {
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
    };

    const doctor = new doctorModel(doctorData);
    await doctor.save();

    res.json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body; // read from body

    if (!doctorId)
      return res.json({ success: false, message: 'Doctor ID is required' });

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
    } = req.body;

    const doctorData = {
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
    };

    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      doctorData,
      {
        new: true,
      },
    );

    if (!updatedDoctor)
      return res.json({ success: false, message: 'Doctor not found' });

    res.json({ success: true, message: 'Doctor updated successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find();
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

export const deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    if (!doctorId)
      return res.json({ success: false, message: 'Doctor ID is required' });

    await doctorModel.findByIdAndDelete(doctorId);

    res.json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
