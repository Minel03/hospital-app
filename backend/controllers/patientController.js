import admissionModel from '../models/admissionModel.js';
import patientModel from '../models/patientModel.js';

export const addPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phone,
      email,
      bloodType,
      address,
      allergies,
      medicalHistory,
      lastVisit,
      status,
    } = req.body;

    const patientData = {
      name,
      age,
      gender,
      phone,
      email,
      bloodType,
      address,
      allergies,
      medicalHistory,
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

export const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.body; // read from body

    if (!patientId) {
      return res.json({ success: false, message: 'Patient ID is required' });
    }

    const {
      name,
      age,
      gender,
      phone,
      email,
      bloodType,
      address,
      allergies,
      medicalHistory,
      lastVisit,
      status,
    } = req.body;

    const patientData = {
      name,
      age,
      gender,
      phone,
      email,
      bloodType,
      address,
      allergies,
      medicalHistory,
      lastVisit,
      status,
    };

    const updatedPatient = await patientModel.findByIdAndUpdate(
      patientId,
      patientData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedPatient) {
      return res.json({ success: false, message: 'Patient not found' });
    }

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: updatedPatient,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const activeAdmissions = await admissionModel.find(
      { status: 'Admitted' },
      'patient',
    );
    const admittedPatientIds = activeAdmissions.map((a) =>
      a.patient.toString(),
    );

    const patients = await patientModel.find({
      _id: { $nin: admittedPatientIds },
    });

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

// New endpoint — returns ALL patients, used for edit mode
export const getAllPatientsUnfiltered = async (req, res) => {
  try {
    const patients = await patientModel.find();
    res.json({ success: true, patients });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;
    await patientModel.findByIdAndDelete(patientId);

    res.json({
      success: true,
      message: 'Patient deleted successfully',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
