import express from 'express';
import {
  addAdmission,
  updateAdmission,
  dischargePatient,
  getAllAdmissions,
  deleteAdmission,
  getPatientAdmissions,
} from '../controllers/admissionController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const admissionRouter = express.Router();

admissionRouter.use(authUser);

admissionRouter.post('/admit', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), addAdmission);
admissionRouter.post('/update', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), updateAdmission);
admissionRouter.post('/discharge', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), dischargePatient);
admissionRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'accountant'), getAllAdmissions);
admissionRouter.post('/delete', restrictTo('admin'), deleteAdmission);
admissionRouter.get('/patient', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'accountant'), getPatientAdmissions);

export default admissionRouter;
