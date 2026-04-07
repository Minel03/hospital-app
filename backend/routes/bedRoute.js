import express from 'express';
import {
  addBed,
  getAllBeds,
  getAvailableBedsByDepartment,
  updateBed,
  deleteBed,
  getAvailableBeds,
} from '../controllers/bedController.js';

const bedRouter = express.Router();

bedRouter.post('/add', addBed);
bedRouter.get('/list', getAllBeds);
bedRouter.get('/available', getAvailableBeds);
bedRouter.post('/available-by-department', getAvailableBedsByDepartment);
bedRouter.put('/update', updateBed);
bedRouter.post('/delete', deleteBed);

export default bedRouter;
