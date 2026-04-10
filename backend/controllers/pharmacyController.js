import medicineModel from '../models/medicineModel.js';
import prescriptionModel from '../models/prescriptionModel.js';
import { createLog } from './auditLogController.js';

/* =========================================================
   MEDICINE INVENTORY
========================================================= */
export const addMedicine = async (req, res) => {
  try {
    const medicine = await medicineModel.create(req.body);
    await createLog({
      entity: 'Patient', // Using generic entity or I can expand AuditLog enum later
      action: 'Medicine Added',
      details: `Added ${medicine.name} to inventory.`,
    });
    res.json({ success: true, message: 'Medicine added to inventory', medicine });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const { id, ...data } = req.body;
    const medicine = await medicineModel.findByIdAndUpdate(id, data, { new: true });
    res.json({ success: true, message: 'Medicine updated', medicine });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineModel.find().sort({ name: 1 });
    res.json({ success: true, medicines });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/* =========================================================
   PRESCRIPTIONS
========================================================= */
export const createPrescription = async (req, res) => {
  try {
    const prescription = await prescriptionModel.create(req.body);
    await createLog({
      entity: 'Patient',
      entityId: prescription.patient,
      action: 'Prescription Created',
      details: `New prescription created by doctor.`,
    });
    res.json({ success: true, message: 'Prescription created', prescription });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPendingPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionModel.find({ status: 'Pending' })
      .populate('patient')
      .populate('doctor')
      .populate('items.medicine')
      .sort({ createdAt: -1 });
    res.json({ success: true, prescriptions });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const dispensePrescription = async (req, res) => {
  try {
    const { id } = req.body;
    const prescription = await prescriptionModel.findById(id).populate('items.medicine');
    
    if (!prescription) return res.json({ success: false, message: 'Prescription not found' });
    if (prescription.status !== 'Pending') return res.json({ success: false, message: 'Already dispensed or cancelled' });

    // Deduct stock
    for (const item of prescription.items) {
      const medicine = await medicineModel.findById(item.medicine._id);
      if (medicine.stock < item.quantity) {
        return res.json({ success: false, message: `Insufficient stock for ${medicine.name}` });
      }
      medicine.stock -= item.quantity;
      await medicine.save();
    }

    prescription.status = 'Dispensed';
    prescription.dispensedAt = new Date();
    await prescription.save();

    await createLog({
      entity: 'Patient',
      entityId: prescription.patient,
      action: 'Prescription Dispensed',
      details: `Prescription dispensed by pharmacy.`,
    });

    res.json({ success: true, message: 'Prescription dispensed successfully', prescription });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
