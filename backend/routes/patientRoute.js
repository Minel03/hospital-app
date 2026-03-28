import express from 'express';
import {
  addPatient,
  deletePatient,
  getAllPatients,
  getPatientById,
} from '../controllers/patientController.js';

const patientRouter = express.Router();

patientRouter.post('/add', addPatient);
patientRouter.get('/list', getAllPatients);
patientRouter.post('/get', getPatientById);
patientRouter.delete('/delete', deletePatient);

export default patientRouter;
