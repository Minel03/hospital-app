import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    bed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bed',
      required: true,
    },
    admissionDate: {
      type: Date,
      required: true,
    },
    expectedDischargeDate: {
      type: Date,
      required: true,
    },
    dischargeDate: {
      type: Date,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Admitted', 'Discharged'],
      default: 'Admitted',
    },
  },
  { timestamps: true },
);

const admissionModel =
  mongoose.models.Admission || mongoose.model('Admission', admissionSchema);

export default admissionModel;
