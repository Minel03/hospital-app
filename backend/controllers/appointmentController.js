import appointmentModel from '../models/appointmentModel.js';

export const createAppointment = async (req, res) => {
  try {
    const { patient, doctor, date, time, department, status, type } = req.body;

    const appointment = await appointmentModel.create({
      patient,
      doctor,
      date,
      time,
      department,
      status,
      type,
    });

    res.json({
      success: true,
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment)
      return res.json({ success: false, message: 'Appointment not found' });

    appointment.status = 'Cancelled';
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const {
      appointmentId,
      patient,
      doctor,
      date,
      time,
      department,
      status,
      type,
    } = req.body;

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        patient,
        doctor,
        date,
        time,
        department,
        status,
        type,
      },
      { new: true },
    );

    if (!updatedAppointment) {
      return res.json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel
      .find()
      .populate('patient')
      .populate('doctor');

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel
      .findById(appointmentId)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return res.json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};
