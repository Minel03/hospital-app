import express from 'express';
import {
  addStaff,
  updateStaff,
  getAllStaff,
  deleteStaff,
} from '../controllers/staffController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const staffRouter = express.Router();

staffRouter.use(authUser);
staffRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'medtech', 'accountant'), getAllStaff);
staffRouter.post('/add', restrictTo('admin'), addStaff);
staffRouter.put('/update', restrictTo('admin'), updateStaff);
staffRouter.delete('/delete', restrictTo('admin'), deleteStaff);

export default staffRouter;
