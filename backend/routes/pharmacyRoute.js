import express from 'express';
import {
  addMedicine,
  updateMedicine,
  getAllMedicines,
  createPrescription,
  getPendingPrescriptions,
  dispensePrescription,
} from '../controllers/pharmacyController.js';
import { authUser, restrictTo } from '../middleware/authMiddleware.js';

const pharmacyRouter = express.Router();

pharmacyRouter.use(authUser);

// INVENTORY
pharmacyRouter.get('/inventory', getAllMedicines);
pharmacyRouter.post('/inventory/add', restrictTo('admin', 'staff'), addMedicine);
pharmacyRouter.put('/inventory/update', restrictTo('admin', 'staff'), updateMedicine);

// PRESCRIPTIONS
pharmacyRouter.post('/prescribe', restrictTo('doctor', 'admin'), createPrescription);
pharmacyRouter.get('/prescriptions/pending', restrictTo('admin', 'staff', 'doctor'), getPendingPrescriptions);
pharmacyRouter.post('/dispense', restrictTo('admin', 'staff'), dispensePrescription);

export default pharmacyRouter;
