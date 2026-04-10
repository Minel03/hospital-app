import express from 'express';
import {
  addPatient,
  deletePatient,
  getAllPatients,
  getAllPatientsUnfiltered,
  getPatientById,
  updatePatient,
} from '../controllers/patientController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const patientRouter = express.Router();

// All patient routes require authentication
patientRouter.use(authUser);

patientRouter.post('/add', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), addPatient);
patientRouter.post('/update', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'medtech'), updatePatient);
patientRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'medtech', 'accountant'), getAllPatients);
patientRouter.get('/all', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'medtech', 'accountant'), getAllPatientsUnfiltered);
patientRouter.post('/get', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'medtech', 'accountant'), getPatientById);

// Only admins can delete patients
patientRouter.delete('/delete', restrictTo('admin'), deletePatient);

export default patientRouter;
