import patientModel from '../models/patientModel.js';

export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, phone, email, lastVisit, status } = req.body;

    const patientData = {
      name,
      age,
      gender,
      phone,
      email,
      lastVisit,
      status,
    };

    const patient = new patientModel(patientData);
    await patient.save();

    res.json({ success: true, message: 'Patient added successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const patients = await patientModel.find();
    res.json({ success: true, patients });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId)
      return res.json({ success: false, message: 'Patient ID is required' });

    const patient = await patientModel.findById(patientId);
    if (!patient)
      return res.json({ success: false, message: 'Patient not found' });

    res.json({ success: true, patient });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
