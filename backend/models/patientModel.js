import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    lastVisit: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'Inactive',
    },
  },
  { timestamps: true },
);

const patientModel =
  mongoose.models.patient || mongoose.model('patient', patientSchema);

export default patientModel;
