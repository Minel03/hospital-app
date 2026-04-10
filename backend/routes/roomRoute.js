import express from 'express';
import {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';

import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const roomRouter = express.Router();

roomRouter.use(authUser);
roomRouter.get('/list', restrictTo('admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'medtech', 'accountant'), getAllRooms);
roomRouter.post('/add', restrictTo('admin'), addRoom);
roomRouter.put('/update', restrictTo('admin'), updateRoom);
roomRouter.post('/delete', restrictTo('admin'), deleteRoom);

export default roomRouter;
