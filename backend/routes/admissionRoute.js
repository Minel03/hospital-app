import express from 'express';
import {
  addAdmission,
  updateAdmission,
  dischargePatient,
  getAllAdmissions,
  deleteAdmission,
  getPatientAdmissions,
} from '../controllers/admissionController.js';

const admissionRouter = express.Router();

admissionRouter.post('/admit', addAdmission);
admissionRouter.post('/update', updateAdmission);
admissionRouter.post('/discharge', dischargePatient);
admissionRouter.get('/list', getAllAdmissions);
admissionRouter.post('/delete', deleteAdmission);
admissionRouter.get('/patient', getPatientAdmissions);

export default admissionRouter;
