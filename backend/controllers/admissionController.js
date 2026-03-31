import admissionModel from '../models/admissionModel.js';
import bedModel from '../models/bedModel.js';

export const addAdmission = async (req, res) => {
  try {
    const {
      patient,
      doctor,
      department,
      bed,
      admissionDate,
      expectedDischargeDate,
      diagnosis,
    } = req.body;

    // Check if bed is available
    const selectedBed = await bedModel.findById(bed);
    if (!selectedBed)
      return res.json({ success: false, message: 'Bed not found' });
    if (selectedBed.status !== 'Available')
      return res.json({ success: false, message: 'Bed is not available' });

    // Create admission
    const admission = new admissionModel({
      patient,
      doctor,
      department,
      bed,
      admissionDate,
      expectedDischargeDate,
      diagnosis,
    });
    await admission.save();

    // Mark bed as occupied
    await bedModel.findByIdAndUpdate(bed, {
      status: 'Occupied',
      currentPatient: patient,
    });

    res.json({ success: true, message: 'Patient admitted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const dischargePatient = async (req, res) => {
  try {
    const { admissionId } = req.body;
    if (!admissionId)
      return res.json({ success: false, message: 'Admission ID is required' });

    const admission = await admissionModel.findByIdAndUpdate(
      admissionId,
      { status: 'Discharged' },
      { new: true },
    );
    if (!admission)
      return res.json({ success: false, message: 'Admission not found' });

    // Free up the bed
    await bedModel.findByIdAndUpdate(admission.bed, {
      status: 'Available',
      currentPatient: null,
    });

    res.json({ success: true, message: 'Patient discharged successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const updateAdmission = async (req, res) => {
  try {
    const { admissionId, bed, ...rest } = req.body;
    if (!admissionId)
      return res.json({ success: false, message: 'Admission ID is required' });

    const oldAdmission = await admissionModel.findById(admissionId);
    if (!oldAdmission)
      return res.json({ success: false, message: 'Admission not found' });

    // If bed changed, update old and new bed status
    if (bed && bed !== oldAdmission.bed?.toString()) {
      // Free old bed
      await bedModel.findByIdAndUpdate(oldAdmission.bed, {
        status: 'Available',
        currentPatient: null,
      });
      // Occupy new bed
      await bedModel.findByIdAndUpdate(bed, {
        status: 'Occupied',
        currentPatient: oldAdmission.patient,
      });
    }

    await admissionModel.findByIdAndUpdate(
      admissionId,
      { ...rest, bed },
      { new: true },
    );

    res.json({ success: true, message: 'Admission updated successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await admissionModel
      .find()
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .populate('bed'); // ← populate bed with roomNumber and bedNumber
    res.json({ success: true, admissions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteAdmission = async (req, res) => {
  try {
    const { admissionId } = req.body;
    if (!admissionId)
      return res.json({ success: false, message: 'Admission ID is required' });

    const admission = await admissionModel.findById(admissionId);
    if (!admission)
      return res.json({ success: false, message: 'Admission not found' });

    // Free up bed on delete too
    await bedModel.findByIdAndUpdate(admission.bed, {
      status: 'Available',
      currentPatient: null,
    });

    await admissionModel.findByIdAndDelete(admissionId);
    res.json({ success: true, message: 'Admission deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
