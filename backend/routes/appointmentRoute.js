import express from 'express';
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
} from '../controllers/appointmentController.js';

const appointmentRouter = express.Router();

appointmentRouter.post('/add', createAppointment);
appointmentRouter.post('/update', updateAppointment);
appointmentRouter.get('/list', getAllAppointments);
appointmentRouter.post('/get', getAppointmentById);
appointmentRouter.post('/cancel', cancelAppointment);

export default appointmentRouter;
