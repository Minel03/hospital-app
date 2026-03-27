import express from 'express';
import {
  addPatient,
  getAllPatients,
  getPatientById,
} from '../controllers/patientController.js';

const patientRouter = express.Router();

patientRouter.post('/add', addPatient);
patientRouter.get('/list', getAllPatients);
patientRouter.post('/get', getPatientById);

export default patientRouter;
