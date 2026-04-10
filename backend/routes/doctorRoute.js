import express from 'express';
import {
  addDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from '../controllers/doctorController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const doctorRouter = express.Router();

doctorRouter.use(authUser);

doctorRouter.post('/add', restrictTo('admin'), addDoctor);
doctorRouter.post('/update', restrictTo('admin', 'doctor'), updateDoctor);
doctorRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'medtech', 'pharmacist', 'accountant'), getAllDoctors);
doctorRouter.post('/get', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), getDoctorById);
doctorRouter.delete('/delete', restrictTo('admin'), deleteDoctor);

export default doctorRouter;
