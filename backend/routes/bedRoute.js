import express from 'express';
import {
  addBed,
  getAllBeds,
  getAvailableBedsByDepartment,
  updateBed,
  deleteBed,
  getAvailableBeds,
} from '../controllers/bedController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const bedRouter = express.Router();

bedRouter.use(authUser);

bedRouter.post('/add', restrictTo('admin'), addBed);
bedRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), getAllBeds);
bedRouter.get('/available', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), getAvailableBeds);
bedRouter.post('/available-by-department', restrictTo('admin', 'doctor', 'nurse', 'receptionist'), getAvailableBedsByDepartment);
bedRouter.put('/update', restrictTo('admin'), updateBed);
bedRouter.post('/delete', restrictTo('admin'), deleteBed);

export default bedRouter;
