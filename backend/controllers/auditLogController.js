// controllers/auditLogController.js
import auditLogModel from '../models/auditLogModel.js';

// Create a log entry (called internally from other controllers)
export const createLog = async ({
  entity,
  entityId,
  action,
  patient = null,
  doctor = null,
  bed = null,
  details = '',
}) => {
  try {
    await auditLogModel.create({
      entity,
      entityId,
      action,
      patient,
      doctor,
      bed,
      details,
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
  }
};

// Get all logs
export const getAllLogs = async (req, res) => {
  try {
    const logs = await auditLogModel
      .find()
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('bed', 'bedNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, logs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get logs by entity (e.g. all logs for a specific bed or patient)
export const getLogsByEntity = async (req, res) => {
  try {
    const { entity, entityId } = req.body;

    const logs = await auditLogModel
      .find({ entity, entityId })
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .populate('bed', 'bedNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, logs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
