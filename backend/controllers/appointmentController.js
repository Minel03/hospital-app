import appointmentModel from '../models/appointmentModel.js';
import { createLog } from './auditLogController.js';
import { sendAppointmentEmail } from '../utils/emailHelper.js';

/* =========================================================
   CREATE APPOINTMENT
========================================================= */
export const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, department, datetime, status, type, meetingLink } = req.body;

    if (!patient || !doctor || !department || !datetime) {
      return res.json({ success: false, message: 'Missing required fields' });
    }

    const appointment = await appointmentModel.create({
      patient,
      doctor,
      department,
      datetime: new Date(datetime),
      status: status || 'Pending',
      type: type || 'Check-up',
      meetingLink: meetingLink || '',
    });

    // Fetch details for email
    const fullAppointment = await appointmentModel.findById(appointment._id)
      .populate('patient')
      .populate('doctor');

    // Trigger Email Notification (Non-blocking)
    if (fullAppointment.patient?.email) {
      sendAppointmentEmail(fullAppointment.patient.email, {
        date: new Date(datetime).toLocaleDateString(),
        time: new Date(datetime).toLocaleTimeString(),
        doctorName: fullAppointment.doctor?.name || 'Assigned Doctor',
      }).catch(err => console.error('Appointment Email Error:', err));
    }

    // Create audit log
    await createLog({
      entity: 'Appointment',
      entityId: appointment._id,
      action: 'Appointment Created',
      patient,
      doctor,
      details: `Appointment scheduled for ${new Date(datetime).toLocaleString()}`,
    });

    res.json({
      success: true,
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   CANCEL APPOINTMENT
========================================================= */
export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment ID is required',
      });
    }

    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate('patient')
      .populate('doctor')
      .populate('department');

    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    // Create audit log
    await createLog({
      entity: 'Appointment',
      entityId: appointment._id,
      action: 'Appointment Cancelled',
      patient: appointment.patient._id,
      doctor: appointment.doctor._id,
      details: `Appointment on ${new Date(appointment.datetime).toLocaleString()} was cancelled`,
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   UPDATE APPOINTMENT
========================================================= */
export const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentId,
      patient,
      doctor,
      department,
      datetime,
      status,
      type,
    } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment ID is required',
      });
    }

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    // Update fields
    if (patient) appointment.patient = patient;
    if (doctor) appointment.doctor = doctor;
    if (department) appointment.department = department;
    if (datetime) appointment.datetime = new Date(datetime);
    if (status) appointment.status = status;
    if (type) appointment.type = type;

    await appointment.save();

    // Create audit log
    await createLog({
      entity: 'Appointment',
      entityId: appointment._id,
      action: 'Appointment Updated',
      patient: appointment.patient,
      doctor: appointment.doctor,
      details: `Appointment updated to ${new Date(appointment.datetime).toLocaleString()}`,
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET ALL APPOINTMENTS
========================================================= */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate('patient')
      .populate('doctor')
      .populate('department')
      .sort({ datetime: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   GET APPOINTMENT BY ID
========================================================= */
export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: 'Appointment ID is required',
      });
    }

    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate('patient')
      .populate('doctor')
      .populate('department');

    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
