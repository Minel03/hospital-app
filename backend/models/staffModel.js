import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    role: {
      type: String,
      enum: [
        'Nurse',
        'Medical Technologist',
        'Radiologist',
        'Pharmacist',
        'Physical Therapist',
        'Administrative',
        'Other',
      ],
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    experience: { type: Number },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true },
);

const staffModel =
  mongoose.models.Staff || mongoose.model('Staff', staffSchema);

export default staffModel;
