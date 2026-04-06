import express from 'express';
import {
  addRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';

const roomRouter = express.Router();

roomRouter.post('/add', addRoom);
roomRouter.get('/list', getAllRooms);
roomRouter.put('/update', updateRoom);
roomRouter.post('/delete', deleteRoom);

export default roomRouter;
