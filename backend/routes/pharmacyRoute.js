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
pharmacyRouter.post('/inventory/add', restrictTo('admin', 'pharmacist'), addMedicine);
pharmacyRouter.put('/inventory/update', restrictTo('admin', 'pharmacist'), updateMedicine);

// PRESCRIPTIONS
pharmacyRouter.post('/prescribe', restrictTo('doctor', 'admin'), createPrescription);
pharmacyRouter.get('/prescriptions/pending', restrictTo('admin', 'pharmacist', 'doctor', 'nurse'), getPendingPrescriptions);
pharmacyRouter.post('/dispense', restrictTo('admin', 'pharmacist'), dispensePrescription);

export default pharmacyRouter;
