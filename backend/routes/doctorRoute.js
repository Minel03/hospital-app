import express from 'express';
import {
  addDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

doctorRouter.post('/add', addDoctor);
doctorRouter.post('/update', updateDoctor);
doctorRouter.get('/list', getAllDoctors);
doctorRouter.post('/get', getDoctorById);
doctorRouter.delete('/delete', deleteDoctor);

export default doctorRouter;
