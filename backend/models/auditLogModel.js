// models/auditLogModel.js
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    entity: {
      type: String,
      enum: ['Admission', 'Appointment', 'Patient', 'Bed', 'Invoice'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      default: null,
    },
    details: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

const auditLogModel =
  mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);

export default auditLogModel;
