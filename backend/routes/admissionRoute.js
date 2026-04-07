import express from 'express';
import {
  addAdmission,
  updateAdmission,
  dischargePatient,
  getAllAdmissions,
  deleteAdmission,
} from '../controllers/admissionController.js';

const admissionRouter = express.Router();

admissionRouter.post('/admit', addAdmission);
admissionRouter.post('/update', updateAdmission);
admissionRouter.post('/discharge', dischargePatient);
admissionRouter.get('/list', getAllAdmissions);
admissionRouter.post('/delete', deleteAdmission);

export default admissionRouter;
