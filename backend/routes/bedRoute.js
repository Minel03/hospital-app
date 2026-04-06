import express from 'express';
import {
  addBed,
  getAllBeds,
  getAvailableBedsByDepartment,
  updateBed,
  deleteBed,
} from '../controllers/bedController.js';

const bedRouter = express.Router();

bedRouter.post('/add', addBed);
bedRouter.get('/list', getAllBeds);
bedRouter.post('/available', getAvailableBedsByDepartment);
bedRouter.put('/update', updateBed);
bedRouter.post('/delete', deleteBed);

export default bedRouter;
