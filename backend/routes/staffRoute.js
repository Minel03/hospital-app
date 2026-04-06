import express from 'express';
import {
  addStaff,
  updateStaff,
  getAllStaff,
  deleteStaff,
} from '../controllers/staffController.js';

const staffRouter = express.Router();

staffRouter.post('/add', addStaff);
staffRouter.put('/update', updateStaff);
staffRouter.get('/list', getAllStaff);
staffRouter.delete('/delete', deleteStaff);

export default staffRouter;
