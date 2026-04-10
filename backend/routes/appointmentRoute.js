import express from 'express';
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
} from '../controllers/appointmentController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const appointmentRouter = express.Router();

appointmentRouter.use(authUser);

appointmentRouter.post('/add', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), createAppointment);
appointmentRouter.post('/update', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), updateAppointment);
appointmentRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'accountant'), getAllAppointments);
appointmentRouter.post('/get', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), getAppointmentById);
appointmentRouter.post('/cancel', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), cancelAppointment);

export default appointmentRouter;
