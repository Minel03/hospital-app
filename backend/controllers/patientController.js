// controllers/patientController.js
import admissionModel from '../models/admissionModel.js';
import patientModel from '../models/patientModel.js';
import { createLog } from './auditLogController.js';

/* =========================================================
   ADD PATIENT
========================================================= */
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

    // Create audit log
    await createLog({
      entity: 'Patient',
      entityId: patient._id,
      action: 'Patient Added',
      patient: patient._id,
      details: `Patient ${name} added to the system.`,
    });

    res.json({ success: true, message: 'Patient added successfully', patient });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE PATIENT
========================================================= */
export const updatePatient = async (req, res) => {
  try {
    const { patientId } = req.body;

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
      { new: true, runValidators: true },
    );

    if (!updatedPatient) {
      return res.json({ success: false, message: 'Patient not found' });
    }

    // Create audit log
    await createLog({
      entity: 'Patient',
      entityId: updatedPatient._id,
      action: 'Patient Updated',
      patient: updatedPatient._id,
      details: `Patient ${updatedPatient.name} updated.`,
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      patient: updatedPatient,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL PATIENTS (excluding currently admitted)
========================================================= */
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
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET PATIENT BY ID
========================================================= */
export const getPatientById = async (req, res) => {
  try {
    const { patientId } = req.body;
    if (!patientId) {
      return res.json({ success: false, message: 'Patient ID is required' });
    }

    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.json({ success: false, message: 'Patient not found' });
    }

    res.json({ success: true, patient });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL PATIENTS UNFILTERED
========================================================= */
export const getAllPatientsUnfiltered = async (req, res) => {
  try {
    const patients = await patientModel.find();
    res.json({ success: true, patients });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   DELETE PATIENT
========================================================= */
export const deletePatient = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!patientId) {
      return res.json({ success: false, message: 'Patient ID is required' });
    }

    const patient = await patientModel.findById(patientId);
    if (!patient) {
      return res.json({ success: false, message: 'Patient not found' });
    }

    await patientModel.findByIdAndDelete(patientId);

    // Create audit log
    await createLog({
      entity: 'Patient',
      entityId: patientId,
      action: 'Patient Deleted',
      patient: patientId,
      details: `Patient ${patient.name} was deleted from the system.`,
    });

    res.json({ success: true, message: 'Patient deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
