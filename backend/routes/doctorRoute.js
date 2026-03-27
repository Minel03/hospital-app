import express from 'express';
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
} from '../controllers/doctorController.js';

const doctorRouter = express.Router();

doctorRouter.post('/add', addDoctor);
doctorRouter.get('/list', getAllDoctors);
doctorRouter.post('/get', getDoctorById);

export default doctorRouter;
