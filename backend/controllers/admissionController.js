import admissionModel from '../models/admissionModel.js';
import bedModel from '../models/bedModel.js';
import invoiceModel from '../models/invoiceModel.js';
import { createLog } from './auditLogController.js';

/* =========================================================
   ADD ADMISSION (Admit Patient)
========================================================= */
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

    if (!patient || !doctor || !department || !bed) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    const selectedBed = await bedModel.findById(bed);
    if (!selectedBed)
      return res.json({ success: false, message: 'Bed not found' });
    if (selectedBed.status !== 'Available')
      return res.json({ success: false, message: 'Bed is not available' });

    const admission = await admissionModel.create({
      patient,
      doctor,
      department,
      bed,
      admissionDate,
      expectedDischargeDate,
      diagnosis,
      status: 'Admitted',
    });

    // Occupy bed
    selectedBed.status = 'Occupied';
    selectedBed.currentPatient = patient;
    await selectedBed.save();

    await createLog({
      entity: 'Admission',
      entityId: admission._id,
      action: 'Patient Admitted',
      patient: admission.patient,
      doctor: admission.doctor,
      bed: admission.bed,
      details: `Patient admitted. Diagnosis: ${diagnosis}`,
    });

    res.json({
      success: true,
      message: 'Patient admitted successfully',
      admission,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   DISCHARGE PATIENT
========================================================= */
export const dischargePatient = async (req, res) => {
  try {
    const { admissionId } = req.body;

    if (!admissionId) {
      return res.json({
        success: false,
        message: 'Admission ID is required',
      });
    }

    const admission = await admissionModel.findById(admissionId);

    if (!admission) {
      return res.json({
        success: false,
        message: 'Admission not found',
      });
    }

    if (admission.status === 'Discharged') {
      return res.json({
        success: false,
        message: 'Patient already discharged',
      });
    }

    /* ===============================
       SET DISCHARGE DATE
    =============================== */

    const dischargeDate = new Date();
    admission.status = 'Discharged';
    admission.dischargeDate = dischargeDate;

    /* ===============================
       CALCULATE LENGTH OF STAY
    =============================== */

    const admissionDate = new Date(admission.admissionDate);

    const msPerDay = 1000 * 60 * 60 * 24;

    const daysStayed = Math.max(
      1,
      Math.ceil((dischargeDate - admissionDate) / msPerDay),
    );

    admission.lengthOfStay = daysStayed;

    await admission.save();

    /* ===============================
       FREE BED
    =============================== */

    const bed = await bedModel.findById(admission.bed).populate('room');

    if (bed) {
      bed.status = 'Available';
      bed.currentPatient = null;
      await bed.save();
    }

    /* ===============================
       ROOM BILLING
    =============================== */

    const ratePerNight = bed?.room?.ratePerNight || 0;

    const roomCharge = daysStayed * ratePerNight;

    const services = [
      {
        name: 'Room & Board',
        description: `${daysStayed} night(s) @ $${ratePerNight}/night`,
        amount: roomCharge,
      },
    ];

    const totalAmount = services.reduce((sum, s) => sum + s.amount, 0);

    /* ===============================
       DUE DATE
    =============================== */

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    /* ===============================
       CREATE INVOICE
    =============================== */

    const invoice = await invoiceModel.create({
      patient: admission.patient,
      doctor: admission.doctor,
      admission: admission._id,
      appointment: null,
      services,
      totalAmount,
      dueDate,
      status: 'Draft',
    });

    /* ===============================
       AUDIT LOGS
    =============================== */

    await createLog({
      entity: 'Admission',
      entityId: admission._id,
      action: 'Patient Discharged',
      patient: admission.patient,
      doctor: admission.doctor,
      bed: admission.bed,
      details: `Patient discharged after ${daysStayed} day(s).`,
    });

    await createLog({
      entity: 'Invoice',
      entityId: invoice._id,
      action: 'Invoice Created',
      patient: admission.patient,
      doctor: admission.doctor,
      details: `Draft invoice created. Room & Board: $${roomCharge} (${daysStayed} nights × $${ratePerNight}).`,
    });

    /* ===============================
       RESPONSE
    =============================== */

    res.json({
      success: true,
      message: `Patient discharged successfully. Draft invoice created.`,
      invoice,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE / TRANSFER ADMISSION
========================================================= */
export const updateAdmission = async (req, res) => {
  try {
    const { admissionId, bed, ...rest } = req.body;
    if (!admissionId)
      return res.json({ success: false, message: 'Admission ID is required' });

    const admission = await admissionModel.findById(admissionId);
    if (!admission)
      return res.json({ success: false, message: 'Admission not found' });

    // BED TRANSFER
    if (bed && bed !== admission.bed?.toString()) {
      const oldBed = await bedModel.findById(admission.bed);
      const newBed = await bedModel.findById(bed);

      if (!newBed)
        return res.json({ success: false, message: 'New bed not found' });
      if (newBed.status !== 'Available')
        return res.json({
          success: false,
          message: 'New bed is not available',
        });

      // Free old bed
      if (oldBed) {
        oldBed.status = 'Available';
        oldBed.currentPatient = null;
        await oldBed.save();
      }

      // Occupy new bed
      newBed.status = 'Occupied';
      newBed.currentPatient = admission.patient;
      await newBed.save();

      rest.bed = bed;
    }

    const updatedAdmission = await admissionModel.findByIdAndUpdate(
      admissionId,
      rest,
      { new: true },
    );

    res.json({
      success: true,
      message: 'Admission updated successfully',
      admission: updatedAdmission,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL ADMISSIONS
========================================================= */
export const getAllAdmissions = async (req, res) => {
  try {
    const admissions = await admissionModel
      .find()
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .populate({ path: 'bed', populate: { path: 'room' } }) // 👈 nested populate
      .sort({ admissionDate: -1 });

    res.json({ success: true, admissions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   DELETE ADMISSION
========================================================= */
export const deleteAdmission = async (req, res) => {
  try {
    const { admissionId } = req.body;
    if (!admissionId)
      return res.json({ success: false, message: 'Admission ID is required' });

    const admission = await admissionModel.findById(admissionId);
    if (!admission)
      return res.json({ success: false, message: 'Admission not found' });

    // Free bed
    const bed = await bedModel.findById(admission.bed);
    if (bed) {
      bed.status = 'Available';
      bed.currentPatient = null;
      await bed.save();
    }

    await createLog({
      entity: 'Admission',
      entityId: admissionId,
      action: 'Admission Deleted',
      patient: admission.patient,
      doctor: admission.doctor,
      bed: admission.bed,
      details: `Admission record deleted.`,
    });

    await admissionModel.findByIdAndDelete(admissionId);

    res.json({ success: true, message: 'Admission deleted successfully' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
