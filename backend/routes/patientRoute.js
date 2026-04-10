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

patientRouter.post('/add', addPatient);
patientRouter.post('/update', updatePatient);
patientRouter.get('/list', getAllPatients);
patientRouter.get('/all', getAllPatientsUnfiltered);
patientRouter.post('/get', getPatientById);

// Only admins can delete patients
patientRouter.delete('/delete', restrictTo('admin'), deletePatient);

export default patientRouter;
